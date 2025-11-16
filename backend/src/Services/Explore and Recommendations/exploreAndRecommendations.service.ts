import db from "../../drizzle/db";
import { ExploreAndRecommendParams } from "../../Validators/Explore.validator";

// ===============================
// 🧭 EXPLORE SERVICE
// ===============================
export const exploreService = async (params: ExploreAndRecommendParams) => {
  const { includeCreators, includeGroups, limit = 20, offset = 0 } = params;

  const results: Record<string, any[]> = {
    posts: [],
    groups: [],
  };

  // --- Explore Posts ---
  if (includeCreators || (!includeCreators && !includeGroups)) {
    const posts = await db.query.posts.findMany({
      with: {
        author: true,
        likes: true,
        media: true,
        // comments: true, // temporarily removed until ready
        // tags: { with: { tag: true } }, // temporarily removed until ready
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
      limit,
      offset,
    });

    results.posts = posts;
  }

  // --- Explore Groups ---
  if (includeGroups) {
    const groups = await db.query.groupChats.findMany({
      with: {
        creator: true,
        members: { with: { user: true } },
        messages: { with: { sender: true } },
      },
      orderBy: (groupChats, { desc }) => [desc(groupChats.createdAt)],
      limit,
      offset,
    });

    results.groups = groups;
  }

  return results;
};

// ===============================
// ❤️ RECOMMENDATION SERVICE
// ===============================
export const recommendationService = async (params: ExploreAndRecommendParams) => {
  const {
    userId,
    gender,
    orientation,
    distanceKm,
    interests,
    minAge,
    maxAge,
    limit = 20,
    offset = 0,
  } = params;

  // --- Get current user's location ---
  const userLocation = userId
    ? await db.query.locations.findFirst({
        where: (table, { eq }) => eq(table.userId, userId),
      })
    : null;

  const userLat = userLocation?.latitude ?? null;
  const userLon = userLocation?.longitude ?? null;

  if (userLat == null || userLon == null) {
    console.warn("User location not set — distance filter skipped.");
  }

  // --- Fetch potential matches ---
  const potentialMatches = await db.query.users.findMany({
    with: {
      location: true,
      interests: { with: { interest: true } },
      preferences: true,
    },
    limit,
    offset,
  });

  let filtered = potentialMatches;

  // --- Filter by gender/orientation ---
  if (gender) filtered = filtered.filter((u) => u.gender === gender);
  if (orientation) filtered = filtered.filter((u) => u.orientation === orientation);

  // --- Filter by shared interests ---
  if (interests && interests.length > 0) {
    filtered = filtered.filter((u) =>
      u.interests?.some((i: any) => i.interest && interests.includes(i.interest.name ?? ""))
    );
  }

  // --- Filter by age range ---
  if (minAge && maxAge) {
    const now = new Date();
    filtered = filtered.filter((u) => {
      const birthDate = new Date(u.dateOfBirth);
      const age =
        now.getFullYear() -
        birthDate.getFullYear() -
        (now < new Date(birthDate.setFullYear(now.getFullYear())) ? 1 : 0);
      return age >= minAge && age <= maxAge;
    });
  }

  // --- Filter by distance ---
  if (distanceKm && userLat != null && userLon != null) {
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371; // Earth radius in km

    filtered = filtered.filter((u) => {
      const loc = u.location;
      if (!loc?.latitude || !loc?.longitude) return false;

      const dLat = toRad(loc.latitude - userLat);
      const dLon = toRad(loc.longitude - userLon);
      const lat1 = toRad(userLat);
      const lat2 = toRad(loc.latitude);

      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c;

      return distance <= distanceKm;
    });
  }

  return filtered;
};

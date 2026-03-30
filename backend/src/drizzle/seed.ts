import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import db from "./db"; // your Drizzle DB instance
import {
  blocks,
  comments,
  follows,
  groupChats, groupMembers, groupMessages, groupTags,
  interactions,
  interests,
  languages,
  likes,
  locations,
  media,
  messages,
  notifications,
  personalityTraits,
  postMetrics,
  posts,
  postTags, reports,
  tags,
  userDiscoveryPreferences,
  userInterestedIn,
  userInterests,
  userLanguages,
  userMetrics,
  userPersonalityTraits,
  userPreferences,
  users,
  userVibeCounts,
  vibeVotes,
} from "./schema";

// Use console for seed output since logger writes to file only
const log = (msg: string) => console.log(msg);
const logError = (msg: string, err?: unknown) => console.error(msg, err ?? "");

// Helper to create password hash
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function seed() {
  try {
    log("🌱 Seeding started...");
    log("⚠️  This will create comprehensive test data for all screens\n");

    // ========================== CLEANUP EXISTING DATA ==========================
    log("🧹 Cleaning up existing data...");

    // Delete in reverse order of foreign key dependencies
    await db.delete(postTags);
    await db.delete(groupTags);
    await db.delete(groupMessages);
    await db.delete(groupMembers);
    await db.delete(groupChats);
    await db.delete(postMetrics);
    await db.delete(userMetrics);
    await db.delete(interactions);
    await db.delete(reports);
    await db.delete(notifications);
    await db.delete(userVibeCounts);
    await db.delete(vibeVotes);
    await db.delete(comments);
    await db.delete(likes);
    await db.delete(media);
    await db.delete(userPreferences);
    await db.delete(userInterests);
    await db.delete(userDiscoveryPreferences);
    await db.delete(userInterestedIn);
    await db.delete(userLanguages);
    await db.delete(userPersonalityTraits);
    await db.delete(locations);
    await db.delete(messages);
    await db.delete(follows);
    await db.delete(blocks);
    await db.delete(posts);
    await db.delete(tags);
    await db.delete(interests);
    await db.delete(personalityTraits);
    await db.delete(languages);
    await db.delete(users);

    log("✅ Existing data cleared!\n");

    // ========================== LANGUAGES ==========================
    log("🌐 Seeding languages...");
    const englishId = uuidv4();
    const frenchId = uuidv4();
    const spanishId = uuidv4();
    const portugueseId = uuidv4();
    const swahiliId = uuidv4();
    const arabicId = uuidv4();
    const hindiId = uuidv4();
    const mandarinId = uuidv4();
    const germanId = uuidv4();
    const italianId = uuidv4();
    const japaneseId = uuidv4();
    const koreanId = uuidv4();
    const russianId = uuidv4();
    const turkishId = uuidv4();
    const amharicId = uuidv4();
    const yorubaId = uuidv4();
    const igboId = uuidv4();
    const hausaId = uuidv4();
    const zuluId = uuidv4();
    const afrikaansId = uuidv4();

    await db.insert(languages).values([
      { id: englishId, name: "English", code: "en" },
      { id: frenchId, name: "French", code: "fr" },
      { id: spanishId, name: "Spanish", code: "es" },
      { id: portugueseId, name: "Portuguese", code: "pt" },
      { id: swahiliId, name: "Swahili", code: "sw" },
      { id: arabicId, name: "Arabic", code: "ar" },
      { id: hindiId, name: "Hindi", code: "hi" },
      { id: mandarinId, name: "Mandarin", code: "zh" },
      { id: germanId, name: "German", code: "de" },
      { id: italianId, name: "Italian", code: "it" },
      { id: japaneseId, name: "Japanese", code: "ja" },
      { id: koreanId, name: "Korean", code: "ko" },
      { id: russianId, name: "Russian", code: "ru" },
      { id: turkishId, name: "Turkish", code: "tr" },
      { id: amharicId, name: "Amharic", code: "am" },
      { id: yorubaId, name: "Yoruba", code: "yo" },
      { id: igboId, name: "Igbo", code: "ig" },
      { id: hausaId, name: "Hausa", code: "ha" },
      { id: zuluId, name: "Zulu", code: "zu" },
      { id: afrikaansId, name: "Afrikaans", code: "af" },
    ]);
    log("✅ Languages seeded!\n");

    // ========================== PERSONALITY TRAITS ==========================
    log("🧠 Seeding personality traits...");
    const adventurousTraitId = uuidv4();
    const ambitiousTraitId = uuidv4();
    const artisticTraitId = uuidv4();
    const calmTraitId = uuidv4();
    const caringTraitId = uuidv4();
    const confidentTraitId = uuidv4();
    const creativeTraitId = uuidv4();
    const empatheticTraitId = uuidv4();
    const extrovertTraitId = uuidv4();
    const foodieTraitId = uuidv4();
    const funnyTraitId = uuidv4();
    const gentleTraitId = uuidv4();
    const intellectualTraitId = uuidv4();
    const introvertTraitId = uuidv4();
    const kindTraitId = uuidv4();
    const loyalTraitId = uuidv4();
    const optimisticTraitId = uuidv4();
    const passionateTraitId = uuidv4();
    const romanticTraitId = uuidv4();
    const spiritualTraitId = uuidv4();

    await db.insert(personalityTraits).values([
      { id: adventurousTraitId, name: "Adventurous" },
      { id: ambitiousTraitId, name: "Ambitious" },
      { id: artisticTraitId, name: "Artistic" },
      { id: calmTraitId, name: "Calm" },
      { id: caringTraitId, name: "Caring" },
      { id: confidentTraitId, name: "Confident" },
      { id: creativeTraitId, name: "Creative" },
      { id: empatheticTraitId, name: "Empathetic" },
      { id: extrovertTraitId, name: "Extrovert" },
      { id: foodieTraitId, name: "Foodie" },
      { id: funnyTraitId, name: "Funny" },
      { id: gentleTraitId, name: "Gentle" },
      { id: intellectualTraitId, name: "Intellectual" },
      { id: introvertTraitId, name: "Introvert" },
      { id: kindTraitId, name: "Kind" },
      { id: loyalTraitId, name: "Loyal" },
      { id: optimisticTraitId, name: "Optimistic" },
      { id: passionateTraitId, name: "Passionate" },
      { id: romanticTraitId, name: "Romantic" },
      { id: spiritualTraitId, name: "Spiritual" },
    ]);
    log("✅ Personality traits seeded!\n");

    // ========================== USERS ==========================
    log("👥 Inserting users...");
    const defaultPassword = await hashPassword("Password123!");

    // Main test users
    const testUserId = uuidv4();
    const user1Id = uuidv4();
    const user2Id = uuidv4();
    const user3Id = uuidv4();
    const user4Id = uuidv4();
    const user5Id = uuidv4();
    const user6Id = uuidv4();
    const user7Id = uuidv4();
    const user8Id = uuidv4();
    const user9Id = uuidv4();
    const user10Id = uuidv4();

    await db.insert(users).values([
      {
        id: testUserId,
        username: "testuser",
        email: "test@perlme.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1995-06-15"),
        gender: "MALE",
        orientation: "STRAIGHT",
        pronouns: "HE_HIM",
        relationshipIntention: "LONG_TERM",
        hasChildren: "NO",
        wantsChildren: "WANT",
        smoking: "NON_SMOKER",
        drinking: "SOCIALLY",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "BACHELORS",
        occupation: "Software Developer",
        industry: "Technology",
        bio: "Test user account for app development. Love hiking, photography, and good coffee ☕",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
        coverPhotoUrl: "https://picsum.photos/800/400?random=1",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
        profileCompletedAt: new Date(),
      },
      {
        id: user1Id,
        username: "sarah_smith",
        email: "sarah@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1992-03-20"),
        gender: "FEMALE",
        orientation: "STRAIGHT",
        pronouns: "SHE_HER",
        relationshipIntention: "LONG_TERM",
        hasChildren: "NO",
        wantsChildren: "WANT",
        smoking: "NON_SMOKER",
        drinking: "SOCIALLY",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "BACHELORS",
        occupation: "Visual Artist",
        industry: "Arts & Entertainment",
        bio: "Artist 🎨 | Dog lover 🐕 | Coffee enthusiast ☕ | NYC",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        coverPhotoUrl: "https://picsum.photos/800/400?random=2",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
        profileCompletedAt: new Date(),
      },
      {
        id: user2Id,
        username: "mike_jones",
        email: "mike@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1988-11-10"),
        gender: "MALE",
        orientation: "GAY",
        pronouns: "HE_HIM",
        relationshipIntention: "CASUAL",
        hasChildren: "NO",
        wantsChildren: "DONT_WANT",
        smoking: "OCCASIONALLY",
        drinking: "SOCIALLY",
        fitnessLevel: "VERY_ACTIVE",
        educationLevel: "COLLEGE",
        occupation: "Personal Trainer",
        industry: "Health & Fitness",
        bio: "Fitness coach 💪 | Travel addict ✈️ | Plant dad 🌱",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
        coverPhotoUrl: "https://picsum.photos/800/400?random=3",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
        profileCompletedAt: new Date(),
      },
      {
        id: user3Id,
        username: "emma_davis",
        email: "emma@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1996-07-25"),
        gender: "FEMALE",
        orientation: "BISEXUAL",
        pronouns: "SHE_HER",
        relationshipIntention: "LONG_TERM_OPEN_SHORT",
        hasChildren: "NO",
        wantsChildren: "NOT_SURE",
        smoking: "NON_SMOKER",
        drinking: "SOCIALLY",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "MASTERS",
        occupation: "Software Engineer",
        industry: "Technology",
        bio: "Tech enthusiast 💻 | Bookworm 📚 | Amateur chef 👩‍🍳",
        avatarUrl: "https://i.pravatar.cc/150?img=9",
        coverPhotoUrl: "https://picsum.photos/800/400?random=4",
        isVerified: false,
        visibility: "PUBLIC",
        role: "REGULAR",
        profileCompletedAt: new Date(),
      },
      {
        id: user4Id,
        username: "alex_rivera",
        email: "alex@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1994-01-30"),
        gender: "NON_BINARY",
        orientation: "PANSEXUAL",
        pronouns: "THEY_THEM",
        relationshipIntention: "FRIENDSHIP",
        hasChildren: "NO",
        wantsChildren: "NOT_SURE",
        smoking: "NON_SMOKER",
        drinking: "NEVER",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "COLLEGE",
        occupation: "Musician",
        industry: "Arts & Entertainment",
        bio: "Musician 🎸 | Vegan 🌱 | Mental health advocate",
        avatarUrl: "https://i.pravatar.cc/150?img=15",
        coverPhotoUrl: "https://picsum.photos/800/400?random=5",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
        profileCompletedAt: new Date(),
      },
      {
        id: user5Id,
        username: "jessica_lee",
        email: "jessica@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1993-09-12"),
        gender: "FEMALE",
        orientation: "LESBIAN",
        pronouns: "SHE_HER",
        relationshipIntention: "LONG_TERM",
        hasChildren: "NO",
        wantsChildren: "WANT",
        smoking: "NON_SMOKER",
        drinking: "SOCIALLY",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "BACHELORS",
        occupation: "Photographer",
        industry: "Arts & Entertainment",
        bio: "Photographer 📸 | Nature lover 🌲 | Coffee snob",
        avatarUrl: "https://i.pravatar.cc/150?img=20",
        coverPhotoUrl: "https://picsum.photos/800/400?random=6",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
        profileCompletedAt: new Date(),
      },
      {
        id: user6Id,
        username: "david_kim",
        email: "david@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1990-05-18"),
        gender: "MALE",
        orientation: "STRAIGHT",
        pronouns: "HE_HIM",
        relationshipIntention: "CASUAL",
        hasChildren: "NO",
        wantsChildren: "DONT_WANT",
        smoking: "NON_SMOKER",
        drinking: "SOCIALLY",
        fitnessLevel: "NOT_ACTIVE",
        educationLevel: "BACHELORS",
        occupation: "Software Engineer",
        industry: "Technology",
        bio: "Software engineer 👨‍💻 | Gamer 🎮 | Pizza lover 🍕",
        avatarUrl: "https://i.pravatar.cc/150?img=13",
        coverPhotoUrl: "https://picsum.photos/800/400?random=7",
        isVerified: false,
        visibility: "PUBLIC",
        role: "REGULAR",
        profileCompletedAt: new Date(),
      },
      {
        id: user7Id,
        username: "lisa_brown",
        email: "lisa@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1997-04-08"),
        gender: "FEMALE",
        orientation: "STRAIGHT",
        pronouns: "SHE_HER",
        relationshipIntention: "LONG_TERM",
        hasChildren: "NO",
        wantsChildren: "WANT",
        smoking: "NON_SMOKER",
        drinking: "NEVER",
        fitnessLevel: "VERY_ACTIVE",
        educationLevel: "COLLEGE",
        occupation: "Yoga Instructor",
        industry: "Health & Wellness",
        bio: "Yoga instructor 🧘‍♀️ | Wellness coach | Beach bum 🏖️",
        avatarUrl: "https://i.pravatar.cc/150?img=25",
        coverPhotoUrl: "https://picsum.photos/800/400?random=8",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
        profileCompletedAt: new Date(),
      },
      {
        id: user8Id,
        username: "chris_taylor",
        email: "chris@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1991-12-22"),
        gender: "MALE",
        orientation: "BISEXUAL",
        pronouns: "HE_HIM",
        relationshipIntention: "SHORT_TERM_OPEN_LONG",
        hasChildren: "NO",
        wantsChildren: "NOT_SURE",
        smoking: "OCCASIONALLY",
        drinking: "SOCIALLY",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "BACHELORS",
        occupation: "Food Blogger",
        industry: "Media & Content",
        bio: "Food blogger 🍜 | Adventure seeker 🏔️ | Cat dad 🐱",
        avatarUrl: "https://i.pravatar.cc/150?img=33",
        coverPhotoUrl: "https://picsum.photos/800/400?random=9",
        isVerified: false,
        visibility: "PUBLIC",
        role: "REGULAR",
        profileCompletedAt: new Date(),
      },
      {
        id: user9Id,
        username: "amanda_wilson",
        email: "amanda@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1989-08-16"),
        gender: "FEMALE",
        orientation: "STRAIGHT",
        pronouns: "SHE_HER",
        relationshipIntention: "LONG_TERM",
        hasChildren: "NO",
        wantsChildren: "WANT",
        smoking: "NON_SMOKER",
        drinking: "SOCIALLY",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "BACHELORS",
        occupation: "Fashion Designer",
        industry: "Fashion & Retail",
        bio: "Fashion designer 👗 | Vintage lover | Tea enthusiast 🍵",
        avatarUrl: "https://i.pravatar.cc/150?img=28",
        coverPhotoUrl: "https://picsum.photos/800/400?random=10",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
        profileCompletedAt: new Date(),
      },
      {
        id: user10Id,
        username: "ryan_martinez",
        email: "ryan@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1994-02-28"),
        gender: "MALE",
        orientation: "GAY",
        pronouns: "HE_HIM",
        relationshipIntention: "LONG_TERM",
        hasChildren: "NO",
        wantsChildren: "DONT_WANT",
        smoking: "NON_SMOKER",
        drinking: "SOCIALLY",
        fitnessLevel: "MODERATELY_ACTIVE",
        educationLevel: "COLLEGE",
        occupation: "Actor",
        industry: "Arts & Entertainment",
        bio: "Actor 🎭 | Drama queen 👑 | Brunch lover 🥞",
        avatarUrl: "https://i.pravatar.cc/150?img=52",
        coverPhotoUrl: "https://picsum.photos/800/400?random=11",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
        profileCompletedAt: new Date(),
      },
    ]);
    log("✅ Users inserted! (11 users)");

    // ========================== INTERESTS ==========================
    log("🎯 Inserting interests...");
    const musicId = uuidv4();
    const sportsId = uuidv4();
    const artId = uuidv4();
    const travelId = uuidv4();
    const techId = uuidv4();
    const foodId = uuidv4();
    const fitnessId = uuidv4();
    const photographyId = uuidv4();
    const readingId = uuidv4();
    const gamingId = uuidv4();

    await db.insert(interests).values([
      { id: musicId, name: "Music" },
      { id: sportsId, name: "Sports" },
      { id: artId, name: "Art" },
      { id: travelId, name: "Travel" },
      { id: techId, name: "Technology" },
      { id: foodId, name: "Food" },
      { id: fitnessId, name: "Fitness" },
      { id: photographyId, name: "Photography" },
      { id: readingId, name: "Reading" },
      { id: gamingId, name: "Gaming" },
    ]);

    // Assign interests to users
    await db.insert(userInterests).values([
      { userId: testUserId, interestId: photographyId },
      { userId: testUserId, interestId: travelId },
      { userId: testUserId, interestId: foodId },
      { userId: user1Id, interestId: artId },
      { userId: user1Id, interestId: photographyId },
      { userId: user2Id, interestId: fitnessId },
      { userId: user2Id, interestId: travelId },
      { userId: user3Id, interestId: techId },
      { userId: user3Id, interestId: readingId },
      { userId: user4Id, interestId: musicId },
      { userId: user4Id, interestId: artId },
      { userId: user5Id, interestId: photographyId },
      { userId: user5Id, interestId: travelId },
      { userId: user6Id, interestId: techId },
      { userId: user6Id, interestId: gamingId },
      { userId: user7Id, interestId: fitnessId },
      { userId: user8Id, interestId: foodId },
      { userId: user8Id, interestId: travelId },
      { userId: user9Id, interestId: artId },
      { userId: user10Id, interestId: musicId },
    ]);
    log("✅ Interests inserted! (10 interests)");

    // ========================== USER LANGUAGES ==========================
    log("🌐 Inserting user languages...");
    await db.insert(userLanguages).values([
      { userId: testUserId, languageId: englishId },
      { userId: testUserId, languageId: frenchId },
      { userId: user1Id, languageId: englishId },
      { userId: user1Id, languageId: spanishId },
      { userId: user2Id, languageId: englishId },
      { userId: user2Id, languageId: portugueseId },
      { userId: user3Id, languageId: englishId },
      { userId: user3Id, languageId: frenchId },
      { userId: user3Id, languageId: germanId },
      { userId: user4Id, languageId: englishId },
      { userId: user4Id, languageId: spanishId },
      { userId: user5Id, languageId: englishId },
      { userId: user5Id, languageId: mandarinId },
      { userId: user6Id, languageId: englishId },
      { userId: user6Id, languageId: koreanId },
      { userId: user7Id, languageId: englishId },
      { userId: user8Id, languageId: englishId },
      { userId: user8Id, languageId: italianId },
      { userId: user9Id, languageId: englishId },
      { userId: user9Id, languageId: frenchId },
      { userId: user10Id, languageId: englishId },
      { userId: user10Id, languageId: spanishId },
    ]);
    log("✅ User languages inserted! (22 assignments)");

    // ========================== USER PERSONALITY TRAITS ==========================
    log("🧠 Inserting user personality traits...");
    await db.insert(userPersonalityTraits).values([
      { userId: testUserId, traitId: creativeTraitId },
      { userId: testUserId, traitId: adventurousTraitId },
      { userId: testUserId, traitId: optimisticTraitId },
      { userId: user1Id, traitId: artisticTraitId },
      { userId: user1Id, traitId: creativeTraitId },
      { userId: user1Id, traitId: empatheticTraitId },
      { userId: user2Id, traitId: ambitiousTraitId },
      { userId: user2Id, traitId: confidentTraitId },
      { userId: user2Id, traitId: adventurousTraitId },
      { userId: user3Id, traitId: intellectualTraitId },
      { userId: user3Id, traitId: creativeTraitId },
      { userId: user3Id, traitId: calmTraitId },
      { userId: user4Id, traitId: passionateTraitId },
      { userId: user4Id, traitId: creativeTraitId },
      { userId: user4Id, traitId: kindTraitId },
      { userId: user5Id, traitId: adventurousTraitId },
      { userId: user5Id, traitId: artisticTraitId },
      { userId: user5Id, traitId: introvertTraitId },
      { userId: user6Id, traitId: funnyTraitId },
      { userId: user6Id, traitId: loyalTraitId },
      { userId: user7Id, traitId: calmTraitId },
      { userId: user7Id, traitId: caringTraitId },
      { userId: user7Id, traitId: spiritualTraitId },
      { userId: user8Id, traitId: foodieTraitId },
      { userId: user8Id, traitId: extrovertTraitId },
      { userId: user8Id, traitId: adventurousTraitId },
      { userId: user9Id, traitId: romanticTraitId },
      { userId: user9Id, traitId: artisticTraitId },
      { userId: user9Id, traitId: gentleTraitId },
      { userId: user10Id, traitId: extrovertTraitId },
      { userId: user10Id, traitId: funnyTraitId },
      { userId: user10Id, traitId: passionateTraitId },
    ]);
    log("✅ User personality traits inserted! (32 assignments)");

    // ========================== USER DISCOVERY PREFERENCES ==========================
    log("🔍 Inserting user discovery preferences...");
    await db.insert(userDiscoveryPreferences).values([
      { userId: testUserId, minAge: 22, maxAge: 38, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
      { userId: user1Id, minAge: 25, maxAge: 40, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
      { userId: user2Id, minAge: 24, maxAge: 42, distanceKm: 100, distancePreference: "KM_100", showLocation: true },
      { userId: user3Id, minAge: 21, maxAge: 35, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
      { userId: user4Id, minAge: 20, maxAge: 40, distanceKm: null, distancePreference: "GLOBAL", showLocation: false },
      { userId: user5Id, minAge: 22, maxAge: 38, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
      { userId: user6Id, minAge: 23, maxAge: 37, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
      { userId: user7Id, minAge: 25, maxAge: 40, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
      { userId: user8Id, minAge: 23, maxAge: 40, distanceKm: 100, distancePreference: "KM_100", showLocation: true },
      { userId: user9Id, minAge: 27, maxAge: 45, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
      { userId: user10Id, minAge: 22, maxAge: 38, distanceKm: 50, distancePreference: "KM_50", showLocation: true },
    ]);
    log("✅ User discovery preferences inserted! (11 preferences)");

    // ========================== USER INTERESTED IN ==========================
    log("💘 Inserting user interested-in genders...");
    await db.insert(userInterestedIn).values([
      // testuser (MALE, STRAIGHT) → interested in FEMALE
      { userId: testUserId, gender: "FEMALE" },
      // sarah_smith (FEMALE, STRAIGHT) → interested in MALE
      { userId: user1Id, gender: "MALE" },
      // mike_jones (MALE, GAY) → interested in MALE
      { userId: user2Id, gender: "MALE" },
      // emma_davis (FEMALE, BISEXUAL) → interested in MALE + FEMALE
      { userId: user3Id, gender: "MALE" },
      { userId: user3Id, gender: "FEMALE" },
      // alex_rivera (NON_BINARY, PANSEXUAL) → all genders
      { userId: user4Id, gender: "MALE" },
      { userId: user4Id, gender: "FEMALE" },
      { userId: user4Id, gender: "NON_BINARY" },
      // jessica_lee (FEMALE, LESBIAN) → interested in FEMALE
      { userId: user5Id, gender: "FEMALE" },
      // david_kim (MALE, STRAIGHT) → interested in FEMALE
      { userId: user6Id, gender: "FEMALE" },
      // lisa_brown (FEMALE, STRAIGHT) → interested in MALE
      { userId: user7Id, gender: "MALE" },
      // chris_taylor (MALE, BISEXUAL) → interested in MALE + FEMALE
      { userId: user8Id, gender: "MALE" },
      { userId: user8Id, gender: "FEMALE" },
      // amanda_wilson (FEMALE, STRAIGHT) → interested in MALE
      { userId: user9Id, gender: "MALE" },
      // ryan_martinez (MALE, GAY) → interested in MALE
      { userId: user10Id, gender: "MALE" },
    ]);
    log("✅ User interested-in inserted! (15 entries)");

    // ========================== FOLLOWS ==========================
    log("🤝 Inserting follows...");
    await db.insert(follows).values([
      // testuser follows
      { followerId: testUserId, followingId: user1Id },
      { followerId: testUserId, followingId: user2Id },
      { followerId: testUserId, followingId: user3Id },
      { followerId: testUserId, followingId: user5Id },
      { followerId: testUserId, followingId: user7Id },

      // Follow testuser back (mutual follows)
      { followerId: user1Id, followingId: testUserId },
      { followerId: user2Id, followingId: testUserId },
      { followerId: user5Id, followingId: testUserId },

      // Cross follows between other users
      { followerId: user1Id, followingId: user2Id },
      { followerId: user2Id, followingId: user3Id },
      { followerId: user3Id, followingId: user4Id },
      { followerId: user4Id, followingId: user5Id },
      { followerId: user5Id, followingId: user6Id },
      { followerId: user6Id, followingId: user7Id },
      { followerId: user7Id, followingId: user8Id },
      { followerId: user8Id, followingId: user9Id },
      { followerId: user9Id, followingId: user10Id },
      { followerId: user10Id, followingId: user1Id },

      // Some mutual follows
      { followerId: user3Id, followingId: user1Id },
      { followerId: user4Id, followingId: user2Id },
      { followerId: user6Id, followingId: user3Id },
      { followerId: user8Id, followingId: user4Id },
      { followerId: user10Id, followingId: user5Id },
    ]);
    log("✅ Follows inserted! (23 relationships)");

    // ========================== BLOCKS ==========================
    log("🚫 Inserting blocks...");
    await db.insert(blocks).values([
      { blockerId: testUserId, blockedId: user4Id },
      { blockerId: user6Id, blockedId: user9Id },
    ]);
    log("✅ Blocks inserted! (2 blocks)");

    // ========================== LOCATIONS ==========================
    log("📍 Inserting locations...");
    await db.insert(locations).values([
      { userId: testUserId, country: "USA", city: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
      { userId: user1Id, country: "USA", city: "New York", latitude: 40.7128, longitude: -74.006 },
      { userId: user2Id, country: "USA", city: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
      { userId: user3Id, country: "UK", city: "London", latitude: 51.5074, longitude: -0.1278 },
      { userId: user4Id, country: "Canada", city: "Toronto", latitude: 43.6532, longitude: -79.3832 },
      { userId: user5Id, country: "USA", city: "Seattle", latitude: 47.6062, longitude: -122.3321 },
      { userId: user6Id, country: "USA", city: "Austin", latitude: 30.2672, longitude: -97.7431 },
      { userId: user7Id, country: "USA", city: "Miami", latitude: 25.7617, longitude: -80.1918 },
      { userId: user8Id, country: "USA", city: "Portland", latitude: 45.5152, longitude: -122.6784 },
      { userId: user9Id, country: "France", city: "Paris", latitude: 48.8566, longitude: 2.3522 },
      { userId: user10Id, country: "USA", city: "Chicago", latitude: 41.8781, longitude: -87.6298 },
    ]);
    log("✅ Locations inserted! (11 locations)");

    // ========================== USER PREFERENCES ==========================
    log("⚙️ Inserting user preferences...");
    await db.insert(userPreferences).values([
      { userId: testUserId, type: "AGE", value: "25-35" },
      { userId: testUserId, type: "DISTANCE", value: "50" },
      { userId: user1Id, type: "AGE", value: "28-38" },
      { userId: user2Id, type: "GENDER", value: "MALE" },
      { userId: user3Id, type: "AGE", value: "22-32" },
      { userId: user5Id, type: "GENDER", value: "FEMALE" },
    ]);
    log("✅ User preferences inserted! (6 preferences)");

    // ========================== MESSAGES ==========================
    log("💬 Inserting messages...");
    const now = new Date();

    // Conversation: testuser <-> user1 (sarah_smith)
    await db.insert(messages).values([
      { senderId: user1Id, receiverId: testUserId, content: "Hey! Love your recent photos 📸", createdAt: new Date(now.getTime() - 3600000 * 24) },
      { senderId: testUserId, receiverId: user1Id, content: "Thanks Sarah! Your art gallery visit looked amazing", createdAt: new Date(now.getTime() - 3600000 * 23) },
      { senderId: user1Id, receiverId: testUserId, content: "It was! We should definitely go together sometime", createdAt: new Date(now.getTime() - 3600000 * 22) },
      { senderId: testUserId, receiverId: user1Id, content: "I'd love that! Let me know when you're free", createdAt: new Date(now.getTime() - 3600000 * 21) },
      { senderId: user1Id, receiverId: testUserId, content: "How about this weekend?", createdAt: new Date(now.getTime() - 3600000 * 2) },
    ]);

    // Conversation: testuser <-> user2 (mike_jones)
    await db.insert(messages).values([
      { senderId: user2Id, receiverId: testUserId, content: "Yo! Want to hit the gym later?", createdAt: new Date(now.getTime() - 3600000 * 12) },
      { senderId: testUserId, receiverId: user2Id, content: "Can't today, maybe tomorrow?", createdAt: new Date(now.getTime() - 3600000 * 10) },
      { senderId: user2Id, receiverId: testUserId, content: "Sounds good! 7am?", createdAt: new Date(now.getTime() - 3600000 * 8) },
      { senderId: testUserId, receiverId: user2Id, content: "Perfect 💪", createdAt: new Date(now.getTime() - 3600000 * 7) },
    ]);

    // Conversation: testuser <-> user3 (emma_davis) 
    await db.insert(messages).values([
      { senderId: testUserId, receiverId: user3Id, content: "Hey Emma! Saw your tech blog post", createdAt: new Date(now.getTime() - 3600000 * 48) },
      { senderId: user3Id, receiverId: testUserId, content: "Thanks for reading! What did you think?", createdAt: new Date(now.getTime() - 3600000 * 46) },
      { senderId: testUserId, receiverId: user3Id, content: "Really insightful stuff about AI", createdAt: new Date(now.getTime() - 3600000 * 45) },
    ]);

    // Conversation: testuser <-> user5 (jessica_lee)
    await db.insert(messages).values([
      { senderId: user5Id, receiverId: testUserId, content: "Your photography is incredible! 😍", createdAt: new Date(now.getTime() - 3600000 * 72) },
      { senderId: testUserId, receiverId: user5Id, content: "Wow, thank you! Coming from you that means a lot", createdAt: new Date(now.getTime() - 3600000 * 70) },
      { senderId: user5Id, receiverId: testUserId, content: "We should do a photo walk together!", createdAt: new Date(now.getTime() - 3600000 * 68) },
      { senderId: testUserId, receiverId: user5Id, content: "Yes! I know some great spots in the city", createdAt: new Date(now.getTime() - 3600000 * 66) },
      { senderId: user5Id, receiverId: testUserId, content: "Can't wait! DM me the details", createdAt: new Date(now.getTime() - 3600000 * 1), status: "SENT" },
    ]);

    // Conversation: testuser <-> user7 (lisa_brown)
    await db.insert(messages).values([
      { senderId: user7Id, receiverId: testUserId, content: "Hey! Interested in trying yoga?", createdAt: new Date(now.getTime() - 3600000 * 5), status: "SENT" },
    ]);

    // Some messages between other users
    await db.insert(messages).values([
      { senderId: user1Id, receiverId: user2Id, content: "Great workout today!", createdAt: new Date(now.getTime() - 3600000 * 15) },
      { senderId: user3Id, receiverId: user4Id, content: "Love your latest track!", createdAt: new Date(now.getTime() - 3600000 * 30) },
      { senderId: user6Id, receiverId: user7Id, content: "Thanks for the recommendation", createdAt: new Date(now.getTime() - 3600000 * 20) },
    ]);

    log("✅ Messages inserted! (24 messages across 8 conversations)");

    // ========================== POSTS ==========================
    log("📝 Inserting posts...");

    // Posts by testuser
    const testPost1Id = uuidv4();
    const testPost2Id = uuidv4();
    const testPost3Id = uuidv4();

    // Posts by other users
    const post1Id = uuidv4();
    const post2Id = uuidv4();
    const post3Id = uuidv4();
    const post4Id = uuidv4();
    const post5Id = uuidv4();
    const post6Id = uuidv4();
    const post7Id = uuidv4();
    const post8Id = uuidv4();
    const post9Id = uuidv4();
    const post10Id = uuidv4();
    const post11Id = uuidv4();
    const post12Id = uuidv4();
    const post13Id = uuidv4();
    const post14Id = uuidv4();
    const post15Id = uuidv4();

    await db.insert(posts).values([
      // testuser posts
      {
        id: testPost1Id,
        authorId: testUserId,
        content: "Amazing sunset at the beach today 🌅 Nature never fails to inspire me!",
        createdAt: new Date(now.getTime() - 3600000 * 10),
      },
      {
        id: testPost2Id,
        authorId: testUserId,
        content: "Just finished editing my latest photoshoot. So proud of how these turned out! 📸✨",
        createdAt: new Date(now.getTime() - 3600000 * 72),
      },
      {
        id: testPost3Id,
        authorId: testUserId,
        content: "Coffee and coding on a rainy Sunday ☕💻 Perfect way to spend the day!",
        createdAt: new Date(now.getTime() - 3600000 * 168),
      },

      // sarah_smith posts (verified creator)
      {
        id: post1Id,
        authorId: user1Id,
        content: "New art piece finished! 🎨 Took me 3 weeks but so worth it. What do you think?",
        createdAt: new Date(now.getTime() - 3600000 * 5),
      },
      {
        id: post2Id,
        authorId: user1Id,
        content: "Visiting the MoMA today. Art fills my soul ❤️ #ArtLovers",
        createdAt: new Date(now.getTime() - 3600000 * 36),
      },
      {
        id: post3Id,
        authorId: user1Id,
        content: "Morning coffee with this view 😍 NYC never gets old",
        createdAt: new Date(now.getTime() - 3600000 * 96),
      },

      // mike_jones posts
      {
        id: post4Id,
        authorId: user2Id,
        content: "Leg day complete! 💪 Remember: progress over perfection",
        createdAt: new Date(now.getTime() - 3600000 * 8),
      },
      {
        id: post5Id,
        authorId: user2Id,
        content: "Exploring Bali this week 🌴 Travel is the best education",
        createdAt: new Date(now.getTime() - 3600000 * 120),
      },

      // emma_davis posts
      {
        id: post6Id,
        authorId: user3Id,
        content: "Just published my latest blog post on AI ethics. Link in bio! 🤖",
        createdAt: new Date(now.getTime() - 3600000 * 15),
      },
      {
        id: post7Id,
        authorId: user3Id,
        content: "Currently reading 'The Pragmatic Programmer' - highly recommend! 📚",
        createdAt: new Date(now.getTime() - 3600000 * 84),
      },

      // alex_rivera posts (verified creator)
      {
        id: post8Id,
        authorId: user4Id,
        content: "New single dropping this Friday! 🎸 Who's ready?",
        createdAt: new Date(now.getTime() - 3600000 * 20),
      },
      {
        id: post9Id,
        authorId: user4Id,
        content: "Recording vocals today. The creative process is magic ✨",
        createdAt: new Date(now.getTime() - 3600000 * 60),
      },

      // jessica_lee posts (verified)
      {
        id: post10Id,
        authorId: user5Id,
        content: "Golden hour at Mount Rainier 🏔️ The best light for photography!",
        createdAt: new Date(now.getTime() - 3600000 * 12),
      },
      {
        id: post11Id,
        authorId: user5Id,
        content: "Black and white street photography session downtown 📷",
        createdAt: new Date(now.getTime() - 3600000 * 100),
      },

      // david_kim posts
      {
        id: post12Id,
        authorId: user6Id,
        content: "Finally beat that boss! 🎮 40 hours well spent lol",
        createdAt: new Date(now.getTime() - 3600000 * 18),
      },

      // lisa_brown posts (verified creator)
      {
        id: post13Id,
        authorId: user7Id,
        content: "Morning yoga flow by the ocean 🧘‍♀️ Start your day with intention",
        createdAt: new Date(now.getTime() - 3600000 * 4),
      },
      {
        id: post14Id,
        authorId: user7Id,
        content: "Beach sunset meditation 🌊 Finding peace in the present moment",
        createdAt: new Date(now.getTime() - 3600000 * 48),
      },

      // chris_taylor posts
      {
        id: post15Id,
        authorId: user8Id,
        content: "Found the BEST ramen spot in Portland 🍜 Foodie heaven!",
        createdAt: new Date(now.getTime() - 3600000 * 24),
      },
    ]);
    log("✅ Posts inserted! (18 posts)");

    // ========================== MEDIA ==========================
    log("🖼️ Inserting media...");
    await db.insert(media).values([
      // testuser posts media
      { postId: testPost1Id, url: "https://picsum.photos/800/600?random=100", type: "image" },
      { postId: testPost2Id, url: "https://picsum.photos/800/600?random=101", type: "image" },
      { postId: testPost2Id, url: "https://picsum.photos/800/600?random=102", type: "image" },
      { postId: testPost3Id, url: "https://picsum.photos/800/600?random=103", type: "image" },

      // sarah_smith posts media
      { postId: post1Id, url: "https://picsum.photos/800/600?random=104", type: "image" },
      { postId: post2Id, url: "https://picsum.photos/800/600?random=105", type: "image" },
      { postId: post2Id, url: "https://picsum.photos/800/600?random=106", type: "image" },
      { postId: post3Id, url: "https://picsum.photos/800/600?random=107", type: "image" },

      // mike_jones posts media
      { postId: post4Id, url: "https://picsum.photos/800/600?random=108", type: "image" },
      { postId: post5Id, url: "https://picsum.photos/800/600?random=109", type: "image" },
      { postId: post5Id, url: "https://picsum.photos/800/600?random=110", type: "image" },
      { postId: post5Id, url: "https://picsum.photos/800/600?random=111", type: "image" },

      // emma_davis posts media
      { postId: post6Id, url: "https://picsum.photos/800/600?random=112", type: "image" },
      { postId: post7Id, url: "https://picsum.photos/800/600?random=113", type: "image" },

      // alex_rivera posts media
      { postId: post8Id, url: "https://picsum.photos/800/600?random=114", type: "image" },
      { postId: post9Id, url: "https://picsum.photos/800/600?random=115", type: "image" },

      // jessica_lee posts media
      { postId: post10Id, url: "https://picsum.photos/800/600?random=116", type: "image" },
      { postId: post11Id, url: "https://picsum.photos/800/600?random=117", type: "image" },
      { postId: post11Id, url: "https://picsum.photos/800/600?random=118", type: "image" },

      // david_kim posts media
      { postId: post12Id, url: "https://picsum.photos/800/600?random=119", type: "image" },

      // lisa_brown posts media
      { postId: post13Id, url: "https://picsum.photos/800/600?random=120", type: "image" },
      { postId: post14Id, url: "https://picsum.photos/800/600?random=121", type: "image" },

      // chris_taylor posts media
      { postId: post15Id, url: "https://picsum.photos/800/600?random=122", type: "image" },
    ]);
    log("✅ Media inserted! (25 media files)");

    // ========================== LIKES ==========================
    log("❤️ Inserting likes...");
    await db.insert(likes).values([
      // Likes on testuser posts
      { postId: testPost1Id, userId: user1Id },
      { postId: testPost1Id, userId: user2Id },
      { postId: testPost1Id, userId: user5Id },
      { postId: testPost1Id, userId: user7Id },
      { postId: testPost2Id, userId: user1Id },
      { postId: testPost2Id, userId: user5Id },
      { postId: testPost3Id, userId: user3Id },

      // testuser likes other posts
      { postId: post1Id, userId: testUserId },
      { postId: post2Id, userId: testUserId },
      { postId: post4Id, userId: testUserId },
      { postId: post10Id, userId: testUserId },
      { postId: post13Id, userId: testUserId },

      // Cross likes
      { postId: post1Id, userId: user2Id },
      { postId: post1Id, userId: user3Id },
      { postId: post1Id, userId: user5Id },
      { postId: post1Id, userId: user7Id },
      { postId: post2Id, userId: user1Id },
      { postId: post4Id, userId: user1Id },
      { postId: post4Id, userId: user3Id },
      { postId: post5Id, userId: user1Id },
      { postId: post5Id, userId: user7Id },
      { postId: post6Id, userId: user2Id },
      { postId: post8Id, userId: user3Id },
      { postId: post10Id, userId: user1Id },
      { postId: post10Id, userId: user2Id },
      { postId: post13Id, userId: user2Id },
      { postId: post13Id, userId: user5Id },
      { postId: post15Id, userId: user4Id },
    ]);
    log("✅ Likes inserted! (28 likes)");

    // ========================== COMMENTS ==========================
    log("💬 Inserting comments...");
    await db.insert(comments).values([
      // Comments on testuser posts
      { postId: testPost1Id, userId: user1Id, content: "Stunning shot! 😍" },
      { postId: testPost1Id, userId: user2Id, content: "Wow, where is this?" },
      { postId: testPost1Id, userId: user5Id, content: "The colors are amazing!" },
      { postId: testPost2Id, userId: user1Id, content: "You're so talented! ✨" },
      { postId: testPost2Id, userId: user5Id, content: "Love your work!" },
      { postId: testPost3Id, userId: user3Id, content: "My kind of day! ☕" },

      // testuser comments on other posts
      { postId: post1Id, userId: testUserId, content: "This is incredible! 🎨" },
      { postId: post2Id, userId: testUserId, content: "MoMA is the best!" },
      { postId: post4Id, userId: testUserId, content: "You're an inspiration! 💪" },
      { postId: post10Id, userId: testUserId, content: "Breathtaking shot!" },

      // Cross comments
      { postId: post1Id, userId: user2Id, content: "Beautiful work Sarah!" },
      { postId: post1Id, userId: user3Id, content: "I need to see this in person 😊" },
      { postId: post1Id, userId: user5Id, content: "The detail is incredible!" },
      { postId: post4Id, userId: user1Id, content: "Keep pushing! 🔥" },
      { postId: post4Id, userId: user3Id, content: "This motivated me to workout!" },
      { postId: post5Id, userId: user1Id, content: "Bali looks amazing! Jealous 😭" },
      { postId: post6Id, userId: user2Id, content: "Great read!" },
      { postId: post8Id, userId: user3Id, content: "Can't wait to hear it! 🎵" },
      { postId: post10Id, userId: user1Id, content: "Perfect timing!" },
      { postId: post10Id, userId: user2Id, content: "Nature at its finest 🏔️" },
      { postId: post13Id, userId: user2Id, content: "Need to try your class!" },
      { postId: post13Id, userId: user5Id, content: "So peaceful 🧘‍♀️" },
      { postId: post15Id, userId: user4Id, content: "Taking notes! 🍜" },
    ]);
    log("✅ Comments inserted! (23 comments)");

    // ========================== TAGS & POST TAGS ==========================
    log("🏷️ Inserting tags and post tags...");
    const photographyTag = uuidv4();
    const artTag = uuidv4();
    const fitnessTag = uuidv4();
    const travelTag = uuidv4();
    const techTag = uuidv4();
    const foodTag = uuidv4();
    const musicTag = uuidv4();
    const yogaTag = uuidv4();
    const natureTag = uuidv4();
    const lifestyleTag = uuidv4();

    await db.insert(tags).values([
      { id: photographyTag, name: "photography" },
      { id: artTag, name: "art" },
      { id: fitnessTag, name: "fitness" },
      { id: travelTag, name: "travel" },
      { id: techTag, name: "tech" },
      { id: foodTag, name: "food" },
      { id: musicTag, name: "music" },
      { id: yogaTag, name: "yoga" },
      { id: natureTag, name: "nature" },
      { id: lifestyleTag, name: "lifestyle" },
    ]);

    await db.insert(postTags).values([
      { postId: testPost1Id, tagId: photographyTag },
      { postId: testPost1Id, tagId: natureTag },
      { postId: testPost2Id, tagId: photographyTag },
      { postId: testPost3Id, tagId: lifestyleTag },
      { postId: post1Id, tagId: artTag },
      { postId: post2Id, tagId: artTag },
      { postId: post2Id, tagId: travelTag },
      { postId: post3Id, tagId: lifestyleTag },
      { postId: post4Id, tagId: fitnessTag },
      { postId: post5Id, tagId: travelTag },
      { postId: post6Id, tagId: techTag },
      { postId: post7Id, tagId: techTag },
      { postId: post8Id, tagId: musicTag },
      { postId: post9Id, tagId: musicTag },
      { postId: post10Id, tagId: photographyTag },
      { postId: post10Id, tagId: natureTag },
      { postId: post11Id, tagId: photographyTag },
      { postId: post13Id, tagId: yogaTag },
      { postId: post14Id, tagId: yogaTag },
      { postId: post15Id, tagId: foodTag },
    ]);
    log("✅ Tags and post tags inserted! (10 tags)");

    // ========================== GROUP CHATS ==========================
    log("👥 Inserting group chats...");
    const group1Id = uuidv4();
    const group2Id = uuidv4();
    const group3Id = uuidv4();

    await db.insert(groupChats).values([
      {
        id: group1Id,
        name: "Photography Enthusiasts",
        description: "Share your best shots and tips! 📸",
        creatorId: testUserId,
        isPrivate: false,
        avatarUrl: "https://picsum.photos/200/200?random=200",
      },
      {
        id: group2Id,
        name: "Fitness Warriors",
        description: "Motivation and workout tips 💪",
        creatorId: user2Id,
        isPrivate: false,
        avatarUrl: "https://picsum.photos/200/200?random=201",
      },
      {
        id: group3Id,
        name: "Tech Talk",
        description: "Latest in technology and coding 💻",
        creatorId: user3Id,
        isPrivate: true,
        avatarUrl: "https://picsum.photos/200/200?random=202",
      },
    ]);
    log("✅ Group chats inserted! (3 groups)");

    // ========================== GROUP MEMBERS ==========================
    log("👤 Inserting group members...");
    await db.insert(groupMembers).values([
      // Photography Enthusiasts group
      { groupId: group1Id, userId: testUserId, role: "GROUP_ADMIN" },
      { groupId: group1Id, userId: user1Id, role: "GROUP_MEMBER" },
      { groupId: group1Id, userId: user5Id, role: "GROUP_MEMBER" },
      { groupId: group1Id, userId: user9Id, role: "GROUP_MEMBER" },

      // Fitness Warriors group
      { groupId: group2Id, userId: user2Id, role: "GROUP_ADMIN" },
      { groupId: group2Id, userId: testUserId, role: "GROUP_MEMBER" },
      { groupId: group2Id, userId: user7Id, role: "GROUP_MODERATOR" },
      { groupId: group2Id, userId: user8Id, role: "GROUP_MEMBER" },

      // Tech Talk group
      { groupId: group3Id, userId: user3Id, role: "GROUP_ADMIN" },
      { groupId: group3Id, userId: testUserId, role: "GROUP_MEMBER" },
      { groupId: group3Id, userId: user6Id, role: "GROUP_MEMBER" },
    ]);
    log("✅ Group members inserted!");

    // ========================== GROUP MESSAGES ==========================
    log("💬 Inserting group messages...");
    await db.insert(groupMessages).values([
      // Photography Enthusiasts messages
      { groupId: group1Id, senderId: testUserId, content: "Welcome to Photography Enthusiasts! Share your best work here 📸" },
      { groupId: group1Id, senderId: user1Id, content: "Excited to be here! Love this community already" },
      { groupId: group1Id, senderId: user5Id, content: "Just posted some new landscape shots on my profile!" },
      { groupId: group1Id, senderId: user9Id, content: "Anyone have tips for low light photography?" },
      { groupId: group1Id, senderId: testUserId, content: "Try using a tripod and longer exposure times @amanda" },

      // Fitness Warriors messages
      { groupId: group2Id, senderId: user2Id, content: "Let's crush it this week! 💪" },
      { groupId: group2Id, senderId: testUserId, content: "Starting my morning run now!" },
      { groupId: group2Id, senderId: user7Id, content: "Don't forget to stretch before and after!" },
      { groupId: group2Id, senderId: user8Id, content: "Hit a new PR on squats today! 🎉" },

      // Tech Talk messages
      { groupId: group3Id, senderId: user3Id, content: "Anyone trying out the new React 19 features?" },
      { groupId: group3Id, senderId: testUserId, content: "Yes! The server components are game changing" },
      { groupId: group3Id, senderId: user6Id, content: "Still learning the basics but excited to try!" },
    ]);
    log("✅ Group messages inserted! (12 messages)");

    // ========================== GROUP TAGS ==========================
    log("🏷️ Inserting group tags...");
    await db.insert(groupTags).values([
      { groupId: group1Id, tagId: photographyTag },
      { groupId: group2Id, tagId: fitnessTag },
      { groupId: group3Id, tagId: techTag },
    ]);
    log("✅ Group tags inserted!");

    // ========================== REPORTS ==========================
    log("🚨 Inserting reports...");
    await db.insert(reports).values([
      {
        reporterId: user6Id,
        reportedUserId: user9Id,
        reason: "Inappropriate content in messages",
        status: "PENDING",
      },
      {
        reporterId: user8Id,
        reportedUserId: user6Id,
        postId: post12Id,
        reason: "Spam",
        status: "REVIEWED",
      },
    ]);
    log("✅ Reports inserted! (2 reports)");

    // ========================== POST METRICS ==========================
    log("📊 Inserting post metrics...");
    await db.insert(postMetrics).values([
      { postId: testPost1Id, likeCount: 4, commentCount: 3, shareCount: 0, viewCount: 45, score: 15 },
      { postId: testPost2Id, likeCount: 2, commentCount: 2, shareCount: 0, viewCount: 30, score: 10 },
      { postId: testPost3Id, likeCount: 1, commentCount: 1, shareCount: 0, viewCount: 20, score: 5 },
      { postId: post1Id, likeCount: 5, commentCount: 4, shareCount: 0, viewCount: 80, score: 25 },
      { postId: post2Id, likeCount: 2, commentCount: 1, shareCount: 0, viewCount: 40, score: 8 },
      { postId: post3Id, likeCount: 0, commentCount: 0, shareCount: 0, viewCount: 15, score: 0 },
      { postId: post4Id, likeCount: 3, commentCount: 2, shareCount: 0, viewCount: 50, score: 12 },
      { postId: post5Id, likeCount: 2, commentCount: 1, shareCount: 0, viewCount: 60, score: 10 },
      { postId: post6Id, likeCount: 1, commentCount: 1, shareCount: 0, viewCount: 25, score: 5 },
      { postId: post7Id, likeCount: 0, commentCount: 0, shareCount: 0, viewCount: 18, score: 0 },
      { postId: post8Id, likeCount: 1, commentCount: 1, shareCount: 0, viewCount: 35, score: 6 },
      { postId: post9Id, likeCount: 0, commentCount: 0, shareCount: 0, viewCount: 12, score: 0 },
      { postId: post10Id, likeCount: 3, commentCount: 2, shareCount: 0, viewCount: 55, score: 14 },
      { postId: post11Id, likeCount: 0, commentCount: 0, shareCount: 0, viewCount: 22, score: 0 },
      { postId: post12Id, likeCount: 0, commentCount: 0, shareCount: 0, viewCount: 10, score: 0 },
      { postId: post13Id, likeCount: 3, commentCount: 2, shareCount: 0, viewCount: 48, score: 13 },
      { postId: post14Id, likeCount: 0, commentCount: 0, shareCount: 0, viewCount: 28, score: 0 },
      { postId: post15Id, likeCount: 1, commentCount: 1, shareCount: 0, viewCount: 32, score: 6 },
    ]);
    log("✅ Post metrics inserted! (18 posts)");

    // ========================== USER METRICS ==========================
    log("📈 Inserting user metrics...");
    await db.insert(userMetrics).values([
      { userId: testUserId, followersCount: 3, followingCount: 5, postsCount: 3, likesReceived: 7, engagementScore: 30 },
      { userId: user1Id, followersCount: 3, followingCount: 2, postsCount: 3, likesReceived: 7, engagementScore: 33 },
      { userId: user2Id, followersCount: 2, followingCount: 2, postsCount: 2, likesReceived: 5, engagementScore: 22 },
      { userId: user3Id, followersCount: 2, followingCount: 2, postsCount: 2, likesReceived: 1, engagementScore: 6 },
      { userId: user4Id, followersCount: 1, followingCount: 2, postsCount: 2, likesReceived: 1, engagementScore: 6 },
      { userId: user5Id, followersCount: 4, followingCount: 2, postsCount: 2, likesReceived: 3, engagementScore: 16 },
      { userId: user6Id, followersCount: 2, followingCount: 2, postsCount: 1, likesReceived: 0, engagementScore: 0 },
      { userId: user7Id, followersCount: 2, followingCount: 1, postsCount: 2, likesReceived: 3, engagementScore: 13 },
      { userId: user8Id, followersCount: 1, followingCount: 2, postsCount: 1, likesReceived: 1, engagementScore: 6 },
      { userId: user9Id, followersCount: 1, followingCount: 1, postsCount: 0, likesReceived: 0, engagementScore: 0 },
      { userId: user10Id, followersCount: 1, followingCount: 2, postsCount: 0, likesReceived: 0, engagementScore: 0 },
    ]);
    log("✅ User metrics inserted! (11 users)");

    // ========================== INTERACTIONS ==========================
    log("🔄 Inserting interactions...");
    await db.insert(interactions).values([
      { userId: testUserId, targetUserId: user1Id, type: "VIEW" },
      { userId: testUserId, targetUserId: user2Id, type: "VIEW" },
      { userId: testUserId, targetUserId: user5Id, type: "LIKE_PROFILE" },
      { userId: user1Id, targetUserId: testUserId, type: "VIEW" },
      { userId: user1Id, targetUserId: user2Id, type: "VIEW" },
      { userId: user2Id, targetUserId: testUserId, type: "LIKE_PROFILE" },
      { userId: user2Id, targetUserId: user3Id, type: "VIEW" },
      { userId: user3Id, targetUserId: user4Id, type: "VIEW" },
      { userId: user5Id, targetUserId: testUserId, type: "VIEW" },
      { userId: user5Id, targetUserId: user6Id, type: "VIEW" },
    ]);
    log("✅ Interactions inserted! (10 interactions)");

    // ========================== NOTIFICATIONS ==========================
    log("🔔 Inserting notifications...");
    await db.insert(notifications).values([
      // testuser receives: new followers
      {
        userId: testUserId,
        actorId: user1Id,
        type: "FOLLOW",
        message: "sarah_smith started following you",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 25),
      },
      {
        userId: testUserId,
        actorId: user2Id,
        type: "FOLLOW",
        message: "mike_jones started following you",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 24),
      },
      {
        userId: testUserId,
        actorId: user5Id,
        type: "FOLLOW",
        message: "jessica_lee started following you",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 5),
      },
      // testuser receives: likes on posts
      {
        userId: testUserId,
        actorId: user1Id,
        type: "LIKE",
        entityId: testPost1Id,
        message: "sarah_smith liked your post",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 10),
      },
      {
        userId: testUserId,
        actorId: user2Id,
        type: "LIKE",
        entityId: testPost1Id,
        message: "mike_jones liked your post",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 9),
      },
      {
        userId: testUserId,
        actorId: user5Id,
        type: "LIKE",
        entityId: testPost1Id,
        message: "jessica_lee liked your post",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 8),
      },
      {
        userId: testUserId,
        actorId: user7Id,
        type: "LIKE",
        entityId: testPost1Id,
        message: "lisa_brown liked your post",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 7),
      },
      // testuser receives: comments on posts
      {
        userId: testUserId,
        actorId: user1Id,
        type: "COMMENT",
        entityId: testPost1Id,
        message: "sarah_smith commented: \"Stunning shot! 😍\"",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 10),
      },
      {
        userId: testUserId,
        actorId: user2Id,
        type: "COMMENT",
        entityId: testPost1Id,
        message: "mike_jones commented: \"Wow, where is this?\"",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 9),
      },
      {
        userId: testUserId,
        actorId: user5Id,
        type: "COMMENT",
        entityId: testPost1Id,
        message: "jessica_lee commented: \"The colors are amazing!\"",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 3),
      },
      // testuser receives: messages
      {
        userId: testUserId,
        actorId: user1Id,
        type: "MESSAGE",
        message: "New message from sarah_smith",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 2),
      },
      {
        userId: testUserId,
        actorId: user7Id,
        type: "MESSAGE",
        message: "New message from lisa_brown",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 5),
      },
      // user1 (sarah_smith) receives notifications
      {
        userId: user1Id,
        actorId: testUserId,
        type: "FOLLOW",
        message: "testuser started following you",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 48),
      },
      {
        userId: user1Id,
        actorId: testUserId,
        type: "LIKE",
        entityId: post1Id,
        message: "testuser liked your post",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 5),
      },
      {
        userId: user1Id,
        actorId: testUserId,
        type: "COMMENT",
        entityId: post1Id,
        message: "testuser commented: \"This is incredible! 🎨\"",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 5),
      },
      // user2 (mike_jones) receives notifications
      {
        userId: user2Id,
        actorId: testUserId,
        type: "FOLLOW",
        message: "testuser started following you",
        isRead: true,
        createdAt: new Date(now.getTime() - 3600000 * 48),
      },
      {
        userId: user2Id,
        actorId: testUserId,
        type: "LIKE",
        entityId: post4Id,
        message: "testuser liked your post",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 8),
      },
      // user7 (lisa_brown) receives a follow
      {
        userId: user7Id,
        actorId: testUserId,
        type: "FOLLOW",
        message: "testuser started following you",
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000 * 48),
      },
    ]);
    log("✅ Notifications inserted! (18 notifications)");

    // ========================== VIBE VOTES ==========================
    log("✨ Inserting vibe votes...");
    await db.insert(vibeVotes).values([
      { voterId: testUserId, targetUserId: user1Id, vibeType: "SOCIAL_BUTTERFLY" },
      { voterId: testUserId, targetUserId: user7Id, vibeType: "WHOLESOME" },
      { voterId: testUserId, targetUserId: user2Id, vibeType: "ACTIVITY_JUNKIE" },
      { voterId: user1Id, targetUserId: testUserId, vibeType: "DEEP_DIVER" },
      { voterId: user2Id, targetUserId: testUserId, vibeType: "SOCIAL_BUTTERFLY" },
      { voterId: user3Id, targetUserId: testUserId, vibeType: "WITTY_ONE" },
      { voterId: user5Id, targetUserId: testUserId, vibeType: "INSTANT_MATCH" },
      { voterId: user7Id, targetUserId: user2Id, vibeType: "ACTIVITY_JUNKIE" },
      { voterId: user4Id, targetUserId: user3Id, vibeType: "DEEP_DIVER" },
      { voterId: user6Id, targetUserId: user5Id, vibeType: "SOLO_ADVENTURER" },
      { voterId: user8Id, targetUserId: user1Id, vibeType: "CAFFEINE_CRITIC" },
      { voterId: user9Id, targetUserId: user7Id, vibeType: "WHOLESOME" },
    ]);
    log("✅ Vibe votes inserted! (12 votes)");

    // ========================== USER VIBE COUNTS (denormalized) ==========================
    log("📊 Inserting user vibe counts...");
    await db.insert(userVibeCounts).values([
      // testuser received: DEEP_DIVER(1), SOCIAL_BUTTERFLY(1), WITTY_ONE(1), INSTANT_MATCH(1)
      { targetUserId: testUserId, vibeType: "DEEP_DIVER", count: 1 },
      { targetUserId: testUserId, vibeType: "SOCIAL_BUTTERFLY", count: 1 },
      { targetUserId: testUserId, vibeType: "WITTY_ONE", count: 1 },
      { targetUserId: testUserId, vibeType: "INSTANT_MATCH", count: 1 },
      // user1 received: SOCIAL_BUTTERFLY(1), CAFFEINE_CRITIC(1)
      { targetUserId: user1Id, vibeType: "SOCIAL_BUTTERFLY", count: 1 },
      { targetUserId: user1Id, vibeType: "CAFFEINE_CRITIC", count: 1 },
      // user2 received: ACTIVITY_JUNKIE(2)
      { targetUserId: user2Id, vibeType: "ACTIVITY_JUNKIE", count: 2 },
      // user3 received: DEEP_DIVER(1)
      { targetUserId: user3Id, vibeType: "DEEP_DIVER", count: 1 },
      // user5 received: SOLO_ADVENTURER(1)
      { targetUserId: user5Id, vibeType: "SOLO_ADVENTURER", count: 1 },
      // user7 received: WHOLESOME(2)
      { targetUserId: user7Id, vibeType: "WHOLESOME", count: 2 },
    ]);
    log("✅ User vibe counts inserted! (10 entries)");

    log("\n🎉 ================================");
    log("✅ SEED DATA COMPLETED SUCCESSFULLY!");
    log("================================");
    log("\n📊 Summary:");
    log("  - 20 languages (with IDs)");
    log("  - 20 personality traits (with IDs)");
    log("  - 11 users (full profiles, all fields, profileCompletedAt set)");
    log("  - 10 interests");
    log("  - 22 user language assignments");
    log("  - 32 user personality trait assignments");
    log("  - 11 user discovery preferences");
    log("  - 15 user interested-in entries");
    log("  - 23 follow relationships");
    log("  - 2 blocks");
    log("  - 11 locations");
    log("  - 6 user preferences");
    log("  - 24 direct messages across 8 conversations");
    log("  - 18 posts with rich content");
    log("  - 25 media files");
    log("  - 28 likes");
    log("  - 23 comments");
    log("  - 10 tags");
    log("  - 3 group chats");
    log("  - 11 group members");
    log("  - 12 group messages");
    log("  - 2 reports");
    log("  - 18 post metrics");
    log("  - 11 user metrics");
    log("  - 10 interactions");
    log("  - 18 notifications");
    log("  - 12 vibe votes");
    log("  - 10 user vibe counts");
    log("\n🔐 Test User Credentials:");
    log("  Email: test@perlme.com");
    log("  Password: Password123!");
    log("  (All other users also use Password123!)");
    log("\n🚀 All screens should now have realistic data for testing!");
  } catch (err) {
    logError("❌ Seeding failed:", err);
    process.exit(1);
  }
}

// Run the seed function
seed().then(() => process.exit(0)).catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});



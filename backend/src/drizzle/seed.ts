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
  likes,
  locations,
  media,
  messages,
  postMetrics,
  posts,
  postTags, reports,
  tags,
  userInterests,
  userMetrics,
  userPreferences,
  users,
} from "./schema";

// Helper to create password hash
async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

export async function seed() {
  try {
    console.log("🌱 Seeding started...");
    console.log("⚠️  This will create comprehensive test data for all screens\n");

    // ========================== CLEANUP EXISTING DATA ==========================
    console.log("🧹 Cleaning up existing data...");

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
    await db.delete(comments);
    await db.delete(likes);
    await db.delete(media);
    await db.delete(userPreferences);
    await db.delete(userInterests);
    await db.delete(locations);
    await db.delete(messages);
    await db.delete(follows);
    await db.delete(blocks);
    await db.delete(posts);
    await db.delete(tags);
    await db.delete(interests);
    await db.delete(users);

    console.log("✅ Existing data cleared!\n");

    // ========================== USERS ==========================
    console.log("👥 Inserting users...");
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
        bio: "Test user account for app development. Love hiking, photography, and good coffee ☕",
        avatarUrl: "https://i.pravatar.cc/150?img=12",
        coverPhotoUrl: "https://picsum.photos/800/400?random=1",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
      },
      {
        id: user1Id,
        username: "sarah_smith",
        email: "sarah@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1992-03-20"),
        gender: "FEMALE",
        orientation: "STRAIGHT",
        bio: "Artist 🎨 | Dog lover 🐕 | Coffee enthusiast ☕ | NYC",
        avatarUrl: "https://i.pravatar.cc/150?img=5",
        coverPhotoUrl: "https://picsum.photos/800/400?random=2",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
      },
      {
        id: user2Id,
        username: "mike_jones",
        email: "mike@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1988-11-10"),
        gender: "MALE",
        orientation: "GAY",
        bio: "Fitness coach 💪 | Travel addict ✈️ | Plant dad 🌱",
        avatarUrl: "https://i.pravatar.cc/150?img=8",
        coverPhotoUrl: "https://picsum.photos/800/400?random=3",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
      },
      {
        id: user3Id,
        username: "emma_davis",
        email: "emma@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1996-07-25"),
        gender: "FEMALE",
        orientation: "BISEXUAL",
        bio: "Tech enthusiast 💻 | Bookworm 📚 | Amateur chef 👩‍🍳",
        avatarUrl: "https://i.pravatar.cc/150?img=9",
        coverPhotoUrl: "https://picsum.photos/800/400?random=4",
        isVerified: false,
        visibility: "PUBLIC",
        role: "REGULAR",
      },
      {
        id: user4Id,
        username: "alex_rivera",
        email: "alex@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1994-01-30"),
        gender: "NON_BINARY",
        orientation: "PANSEXUAL",
        bio: "Musician 🎸 | Vegan 🌱 | Mental health advocate",
        avatarUrl: "https://i.pravatar.cc/150?img=15",
        coverPhotoUrl: "https://picsum.photos/800/400?random=5",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
      },
      {
        id: user5Id,
        username: "jessica_lee",
        email: "jessica@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1993-09-12"),
        gender: "FEMALE",
        orientation: "LESBIAN",
        bio: "Photographer 📸 | Nature lover 🌲 | Coffee snob",
        avatarUrl: "https://i.pravatar.cc/150?img=20",
        coverPhotoUrl: "https://picsum.photos/800/400?random=6",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
      },
      {
        id: user6Id,
        username: "david_kim",
        email: "david@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1990-05-18"),
        gender: "MALE",
        orientation: "STRAIGHT",
        bio: "Software engineer 👨‍💻 | Gamer 🎮 | Pizza lover 🍕",
        avatarUrl: "https://i.pravatar.cc/150?img=13",
        coverPhotoUrl: "https://picsum.photos/800/400?random=7",
        isVerified: false,
        visibility: "PUBLIC",
        role: "REGULAR",
      },
      {
        id: user7Id,
        username: "lisa_brown",
        email: "lisa@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1997-04-08"),
        gender: "FEMALE",
        orientation: "STRAIGHT",
        bio: "Yoga instructor 🧘‍♀️ | Wellness coach | Beach bum 🏖️",
        avatarUrl: "https://i.pravatar.cc/150?img=25",
        coverPhotoUrl: "https://picsum.photos/800/400?random=8",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
      },
      {
        id: user8Id,
        username: "chris_taylor",
        email: "chris@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1991-12-22"),
        gender: "MALE",
        orientation: "BISEXUAL",
        bio: "Food blogger 🍜 | Adventure seeker 🏔️ | Cat dad 🐱",
        avatarUrl: "https://i.pravatar.cc/150?img=33",
        coverPhotoUrl: "https://picsum.photos/800/400?random=9",
        isVerified: false,
        visibility: "PUBLIC",
        role: "REGULAR",
      },
      {
        id: user9Id,
        username: "amanda_wilson",
        email: "amanda@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1989-08-16"),
        gender: "FEMALE",
        orientation: "STRAIGHT",
        bio: "Fashion designer 👗 | Vintage lover | Tea enthusiast 🍵",
        avatarUrl: "https://i.pravatar.cc/150?img=28",
        coverPhotoUrl: "https://picsum.photos/800/400?random=10",
        isVerified: true,
        visibility: "PUBLIC",
        role: "CREATOR",
      },
      {
        id: user10Id,
        username: "ryan_martinez",
        email: "ryan@example.com",
        passwordHash: defaultPassword,
        dateOfBirth: new Date("1994-02-28"),
        gender: "MALE",
        orientation: "GAY",
        bio: "Actor 🎭 | Drama queen 👑 | Brunch lover 🥞",
        avatarUrl: "https://i.pravatar.cc/150?img=52",
        coverPhotoUrl: "https://picsum.photos/800/400?random=11",
        isVerified: true,
        visibility: "PUBLIC",
        role: "REGULAR",
      },
    ]);
    console.log("✅ Users inserted! (11 users)");

    // ========================== INTERESTS ==========================
    console.log("🎯 Inserting interests...");
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
    console.log("✅ Interests inserted! (10 interests)");

    // ========================== FOLLOWS ==========================
    console.log("🤝 Inserting follows...");
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
    console.log("✅ Follows inserted! (23 relationships)");

    // ========================== BLOCKS ==========================
    console.log("🚫 Inserting blocks...");
    await db.insert(blocks).values([
      { blockerId: testUserId, blockedId: user4Id },
      { blockerId: user6Id, blockedId: user9Id },
    ]);
    console.log("✅ Blocks inserted! (2 blocks)");

    // ========================== LOCATIONS ==========================
    console.log("📍 Inserting locations...");
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
    console.log("✅ Locations inserted! (11 locations)");

    // ========================== USER PREFERENCES ==========================
    console.log("⚙️ Inserting user preferences...");
    await db.insert(userPreferences).values([
      { userId: testUserId, type: "AGE", value: "25-35" },
      { userId: testUserId, type: "DISTANCE", value: "50" },
      { userId: user1Id, type: "AGE", value: "28-38" },
      { userId: user2Id, type: "GENDER", value: "MALE" },
      { userId: user3Id, type: "AGE", value: "22-32" },
      { userId: user5Id, type: "GENDER", value: "FEMALE" },
    ]);
    console.log("✅ User preferences inserted! (6 preferences)");

    // ========================== MESSAGES ==========================
    console.log("💬 Inserting messages...");
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

    console.log("✅ Messages inserted! (24 messages across 8 conversations)");

    // ========================== POSTS ==========================
    console.log("📝 Inserting posts...");

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
    console.log("✅ Posts inserted! (18 posts)");

    // ========================== MEDIA ==========================
    console.log("🖼️ Inserting media...");
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
    console.log("✅ Media inserted! (25 media files)");

    // ========================== LIKES ==========================
    console.log("❤️ Inserting likes...");
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
    console.log("✅ Likes inserted! (28 likes)");

    // ========================== COMMENTS ==========================
    console.log("💬 Inserting comments...");
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
    console.log("✅ Comments inserted! (23 comments)");

    // ========================== TAGS & POST TAGS ==========================
    console.log("🏷️ Inserting tags and post tags...");
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
    console.log("✅ Tags and post tags inserted! (10 tags)");

    // ========================== GROUP CHATS ==========================
    console.log("👥 Inserting group chats...");
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
    console.log("✅ Group chats inserted! (3 groups)");

    // ========================== GROUP MEMBERS ==========================
    console.log("👤 Inserting group members...");
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
    console.log("✅ Group members inserted!");

    // ========================== GROUP MESSAGES ==========================
    console.log("💬 Inserting group messages...");
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
    console.log("✅ Group messages inserted! (12 messages)");

    // ========================== GROUP TAGS ==========================
    console.log("🏷️ Inserting group tags...");
    await db.insert(groupTags).values([
      { groupId: group1Id, tagId: photographyTag },
      { groupId: group2Id, tagId: fitnessTag },
      { groupId: group3Id, tagId: techTag },
    ]);
    console.log("✅ Group tags inserted!");

    // ========================== REPORTS ==========================
    console.log("🚨 Inserting reports...");
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
    console.log("✅ Reports inserted! (2 reports)");

    // ========================== POST METRICS ==========================
    console.log("📊 Inserting post metrics...");
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
    console.log("✅ Post metrics inserted! (18 posts)");

    // ========================== USER METRICS ==========================
    console.log("📈 Inserting user metrics...");
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
    console.log("✅ User metrics inserted! (11 users)");

    // ========================== INTERACTIONS ==========================
    console.log("🔄 Inserting interactions...");
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
    console.log("✅ Interactions inserted! (10 interactions)");

    console.log("\n🎉 ================================");
    console.log("✅ SEED DATA COMPLETED SUCCESSFULLY!");
    console.log("================================");
    console.log("\n📊 Summary:");
    console.log("  - 11 users (with profiles, bios, avatars)");
    console.log("  - 10 interests");
    console.log("  - 23 follow relationships");
    console.log("  - 2 blocks");
    console.log("  - 11 locations");
    console.log("  - 6 user preferences");
    console.log("  - 24 direct messages across 8 conversations");
    console.log("  - 18 posts with rich content");
    console.log("  - 25 media files");
    console.log("  - 28 likes");
    console.log("  - 23 comments");
    console.log("  - 10 tags");
    console.log("  - 3 group chats");
    console.log("  - 11 group members");
    console.log("  - 12 group messages");
    console.log("  - 2 reports");
    console.log("  - 18 post metrics");
    console.log("  - 11 user metrics");
    console.log("  - 10 interactions");
    console.log("\n🔐 Test User Credentials:");
    console.log("  Email: test@perlme.com");
    console.log("  Password: Password123!");
    console.log("\n🚀 All screens should now have realistic data for testing!");
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

// Run the seed function
void seed();


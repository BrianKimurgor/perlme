import db from "./db"; // your Drizzle DB instance
import {
  users, interests, userInterests, follows, blocks, messages, posts, media,
  comments, likes, tags, postTags, reports, locations, userPreferences,
  groupChats, groupMembers, groupMessages, groupTags, postMetrics,
  userMetrics, interactions,
} from "./schema";
import { v4 as uuidv4 } from "uuid";

export async function seed() {
  try {
    console.log("Seeding started...");

    // ========================== USERS ==========================
    console.log("Inserting users...");
    const user1Id = uuidv4();
    const user2Id = uuidv4();
    const user3Id = uuidv4();
    await db.insert(users).values([
      { id: user1Id, username: "alice", email: "alice@test.com", passwordHash: "hash1", dateOfBirth: new Date("1990-01-01"), gender: "FEMALE", orientation: "STRAIGHT" },
      { id: user2Id, username: "bob", email: "bob@test.com", passwordHash: "hash2", dateOfBirth: new Date("1988-05-10"), gender: "MALE", orientation: "GAY" },
      { id: user3Id, username: "charlie", email: "charlie@test.com", passwordHash: "hash3", dateOfBirth: new Date("1995-07-20"), gender: "NON_BINARY", orientation: "PANSEXUAL" },
    ]);
    console.log("Users inserted!");

    // ========================== INTERESTS ==========================
    console.log("Inserting interests...");
    const interest1Id = uuidv4();
    const interest2Id = uuidv4();
    await db.insert(interests).values([
      { id: interest1Id, name: "Music" },
      { id: interest2Id, name: "Sports" },
    ]);
    await db.insert(userInterests).values([
      { userId: user1Id, interestId: interest1Id },
      { userId: user2Id, interestId: interest2Id },
      { userId: user3Id, interestId: interest1Id },
    ]);
    console.log("Interests inserted!");

    // ========================== FOLLOWS ==========================
    console.log("Inserting follows...");
    await db.insert(follows).values([
      { followerId: user1Id, followingId: user2Id },
      { followerId: user2Id, followingId: user3Id },
      { followerId: user3Id, followingId: user1Id },
    ]);
    console.log("Follows inserted!");

    // ========================== BLOCKS ==========================
    console.log("Inserting blocks...");
    await db.insert(blocks).values([
      { blockerId: user1Id, blockedId: user3Id },
    ]);
    console.log("Blocks inserted!");

    // ========================== MESSAGES ==========================
    console.log("Inserting messages...");
    await db.insert(messages).values([
      { id: uuidv4(), senderId: user1Id, receiverId: user2Id, content: "Hello Bob!" },
      { id: uuidv4(), senderId: user2Id, receiverId: user1Id, content: "Hey Alice!" },
    ]);
    console.log("Messages inserted!");

    // ========================== POSTS ==========================
    console.log("Inserting posts...");
    const post1Id = uuidv4();
    const post2Id = uuidv4();
    await db.insert(posts).values([
      { id: post1Id, authorId: user1Id, content: "Alice's first post" },
      { id: post2Id, authorId: user2Id, content: "Bob's first post" },
    ]);
    console.log("Posts inserted!");

    // ========================== MEDIA ==========================
    console.log("Inserting media...");
    await db.insert(media).values([
      { id: uuidv4(), postId: post1Id, url: "https://placekitten.com/200/300", type: "image" },
      { id: uuidv4(), postId: post2Id, url: "https://placekitten.com/400/300", type: "image" },
    ]);
    console.log("Media inserted!");

    // ========================== COMMENTS ==========================
    console.log("Inserting comments...");
    await db.insert(comments).values([
      { id: uuidv4(), postId: post1Id, userId: user2Id, content: "Nice post!" },
      { id: uuidv4(), postId: post2Id, userId: user3Id, content: "Great!" },
    ]);
    console.log("Comments inserted!");

    // ========================== LIKES ==========================
    console.log("Inserting likes...");
    await db.insert(likes).values([
      { id: uuidv4(), postId: post1Id, userId: user3Id },
      { id: uuidv4(), postId: post2Id, userId: user1Id },
    ]);
    console.log("Likes inserted!");

    // ========================== TAGS & POST TAGS ==========================
    console.log("Inserting tags and post tags...");
    const tag1Id = uuidv4();
    const tag2Id = uuidv4();
    await db.insert(tags).values([{ id: tag1Id, name: "fun" }, { id: tag2Id, name: "tech" }]);
    await db.insert(postTags).values([
      { postId: post1Id, tagId: tag1Id },
      { postId: post2Id, tagId: tag2Id },
    ]);
    console.log("Tags and post tags inserted!");

    // ========================== REPORTS ==========================
    console.log("Inserting reports...");
    await db.insert(reports).values([
      { id: uuidv4(), reporterId: user2Id, reportedUserId: user3Id, reason: "Spam" },
    ]);
    console.log("Reports inserted!");

    // ========================== LOCATIONS ==========================
    console.log("Inserting locations...");
    await db.insert(locations).values([
      { id: uuidv4(), userId: user1Id, country: "USA", city: "New York", latitude: 40.7128, longitude: -74.0060 },
      { id: uuidv4(), userId: user2Id, country: "UK", city: "London", latitude: 51.5074, longitude: -0.1278 },
    ]);
    console.log("Locations inserted!");

    // ========================== USER PREFERENCES ==========================
    console.log("Inserting user preferences...");
    await db.insert(userPreferences).values([
      { id: uuidv4(), userId: user1Id, type: "AGE", value: "25-35" },
      { id: uuidv4(), userId: user2Id, type: "GENDER", value: "FEMALE" },
    ]);
    console.log("User preferences inserted!");

    // ========================== GROUP CHATS ==========================
    console.log("Inserting group chats...");
    const group1Id = uuidv4();
    await db.insert(groupChats).values([
      { id: group1Id, name: "Test Group", description: "A test group", creatorId: user1Id, isPrivate: false },
    ]);
    console.log("Group chats inserted!");

    // ========================== GROUP MEMBERS ==========================
    console.log("Inserting group members...");
    await db.insert(groupMembers).values([
      { id: uuidv4(), groupId: group1Id, userId: user1Id, role: "GROUP_ADMIN" },
      { id: uuidv4(), groupId: group1Id, userId: user2Id, role: "GROUP_MEMBER" },
      { id: uuidv4(), groupId: group1Id, userId: user3Id, role: "GROUP_MEMBER" },
    ]);
    console.log("Group members inserted!");

    // ========================== GROUP MESSAGES ==========================
    console.log("Inserting group messages...");
    await db.insert(groupMessages).values([
      { id: uuidv4(), groupId: group1Id, senderId: user1Id, content: "Welcome!" },
      { id: uuidv4(), groupId: group1Id, senderId: user2Id, content: "Hello!" },
    ]);
    console.log("Group messages inserted!");

    // ========================== GROUP TAGS ==========================
    console.log("Inserting group tags...");
    await db.insert(groupTags).values([
      { groupId: group1Id, tagId: tag1Id },
    ]);
    console.log("Group tags inserted!");

    // ========================== POST METRICS ==========================
    console.log("Inserting post metrics...");
    await db.insert(postMetrics).values([
      { postId: post1Id, likeCount: 1, commentCount: 1, shareCount: 0, viewCount: 10, score: 5 },
      { postId: post2Id, likeCount: 1, commentCount: 1, shareCount: 0, viewCount: 5, score: 3 },
    ]);
    console.log("Post metrics inserted!");

    // ========================== USER METRICS ==========================
    console.log("Inserting user metrics...");
    await db.insert(userMetrics).values([
      { userId: user1Id, followersCount: 1, followingCount: 1, postsCount: 1, likesReceived: 1, engagementScore: 5 },
      { userId: user2Id, followersCount: 1, followingCount: 1, postsCount: 1, likesReceived: 1, engagementScore: 4 },
    ]);
    console.log("User metrics inserted!");

    // ========================== INTERACTIONS ==========================
    console.log("Inserting interactions...");
    await db.insert(interactions).values([
      { id: uuidv4(), userId: user1Id, targetUserId: user2Id, type: "VIEW" },
      { id: uuidv4(), userId: user2Id, targetUserId: user1Id, type: "LIKE_PROFILE" },
    ]);
    console.log("Interactions inserted!");

    console.log("Full seed data inserted successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

// Run the seed function immediately
(async () => {
  await seed();
  process.exit(0); // Ensure Node exits after seeding
})();

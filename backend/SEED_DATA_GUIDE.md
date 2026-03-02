# 🌱 Seed Data Guide

This guide explains the comprehensive seed data created for testing all mobile app screens.

## 📊 What's Included

The seed file populates the database with realistic test data including:

### 👥 Users (11 total)
- **testuser** (test@perlme.com) - Main test account with complete profile
- 10 diverse users with different:
  - Genders and orientations
  - Verified/unverified status
  - Roles (REGULAR, CREATOR)
  - Bios, avatars, and cover photos
  - Cities across USA, UK, Canada, and France

### 🎯 Interests & Preferences
- 10 interests (Music, Sports, Art, Travel, Tech, Food, Fitness, Photography, Reading, Gaming)
- Users assigned 1-3 interests each
- User preferences for age ranges and distance

### 🤝 Social Connections
- **23 follow relationships** (mutual and one-way)
- **2 blocks** (to test blocking functionality)
- **10 interactions** (views, profile likes)

### 💬 Messages
- **24 messages** across 8 conversations
- Multiple conversations with testuser:
  - sarah_smith (5 messages) - Recent conversation
  - mike_jones (4 messages) - Gym plans
  - emma_davis (3 messages) - Tech discussion
  - jessica_lee (5 messages) - Photography collaboration
  - lisa_brown (1 unread message) - Yoga invitation
- Messages with timestamps for realistic ordering
- Some marked as unread to test notification badges

### 📝 Posts & Content
- **18 posts** with diverse content:
  - 3 posts by testuser
  - Posts by verified creators and regular users
  - Content about art, fitness, travel, tech, music, food, yoga
- **25 media files** (images from picsum.photos)
- **28 likes** across posts
- **23 comments** with emojis and engaging content
- **10 tags** (photography, art, fitness, travel, tech, food, music, yoga, nature, lifestyle)

### 👥 Groups
- **3 group chats**:
  - Photography Enthusiasts (public, 4 members)
  - Fitness Warriors (public, 4 members)
  - Tech Talk (private, 3 members)
- **12 group messages** across all groups
- Different roles: Admin, Moderator, Member

### 📊 Metrics
- Post metrics (likes, comments, views, engagement scores)
- User metrics (followers, following, posts count, engagement)

### 🚨 Reports
- 2 sample reports (one pending, one reviewed)

## 🔐 Test Account Credentials

```
Email: test@perlme.com
Password: Password123!
```

All other users also use: `Password123!`

## 🚀 How to Run the Seed

### Option 1: Using ts-node (Recommended)
```bash
cd backend
npx ts-node src/drizzle/seed.ts
```

### Option 2: Using npm script (if configured)
```bash
cd backend
npm run seed
# or
pnpm seed
```

### Option 3: Build and run
```bash
cd backend
npm run build
node dist/drizzle/seed.js
```

## ⚠️ Important Notes

1. **Database Connection**: Ensure your `.env` file has the correct `DATABASE_URL` for PostgreSQL (Neon)

2. **Clear Existing Data**: The seed will INSERT new data. To start fresh, you may need to:
   ```bash
   # Drop and recreate tables
   npx drizzle-kit push:pg
   ```

3. **Order Matters**: The seed inserts data in the correct order to respect foreign key constraints

4. **Password Hashing**: All passwords are properly hashed using bcrypt

## 📱 Testing Mobile App Screens

After seeding, you can test these screens with realistic data:

### ✅ Home/Feed Screen (index.tsx)
- Displays 18 posts with media, likes, and comments
- Posts from followed users and others
- Various content types (art, fitness, travel, tech, etc.)

### ✅ Chats Screen (chats.tsx)
- 5 conversations visible for testuser
- Some with unread badges
- Recent timestamps for proper ordering
- Shows user avatars and last messages

### ✅ Matches/Explore Screen (matches.tsx)
- Recommended users based on interests and location
- Mix of verified and regular users
- Complete profiles with bios

### ✅ Profile Screen (profile.tsx)
- testuser profile with stats:
  - 3 posts
  - 5 following
  - 3 followers
- Avatar and cover photo
- Bio information

### ✅ Create Post Screen (create-post.tsx)
- Ready to create new posts
- User avatars loaded

### ✅ Conversation Screen (conversation/[userId].tsx)
- Full conversation history
- Multiple messages with timestamps
- Test with sarah_smith, mike_jones, emma_davis, jessica_lee

### ✅ User Profile Screen (user/[userId].tsx)
- View any user's profile
- Their posts
- Follow/unfollow functionality
- Message button

### ✅ Post Detail Screen (post/[postId].tsx)
- Full post with comments
- Like functionality
- Comment on posts
- View all engagement

### ✅ Groups (when implemented)
- 3 groups ready with members and messages
- Different roles to test permissions

## 🎨 Images & Media

All images use placeholder services:
- User avatars: `https://i.pravatar.cc/150?img={1-52}`
- Cover photos: `https://picsum.photos/800/400?random={1-11}`
- Post media: `https://picsum.photos/800/600?random={100-122}`

Replace with real CDN URLs when deploying to production.

## 🔧 Customization

To customize the seed data:

1. **Edit user profiles**: Change names, bios, locations in the users section
2. **Add more posts**: Copy the post pattern and add more content
3. **Create more conversations**: Add message arrays for different user pairs
4. **Adjust relationships**: Modify follows/blocks as needed

## 📈 Data Summary

```
✅ 11 users (with full profiles)
✅ 10 interests
✅ 23 follow relationships
✅ 2 blocks
✅ 11 locations
✅ 6 preferences
✅ 24 messages (8 conversations)
✅ 18 posts
✅ 25 media files
✅ 28 likes
✅ 23 comments
✅ 10 tags
✅ 3 groups
✅ 11 group members
✅ 12 group messages
✅ 2 reports
✅ Full metrics for all entities
```

## 🐛 Troubleshooting

### "Table doesn't exist" error
```bash
# Run migrations first
cd backend
npx drizzle-kit push:pg
# Then seed
npx ts-node src/drizzle/seed.ts
```

### "Duplicate key" error
The database already has data. Either:
1. Drop and recreate tables, or
2. Modify the seed to use different UUIDs/emails

### "Connection refused"
Check your DATABASE_URL in `.env` and ensure PostgreSQL is running.

### Module errors with bcrypt
```bash
npm rebuild bcrypt
# or
npm install bcrypt
```

## 🎯 Next Steps

After seeding:
1. Start the backend server: `npm run dev`
2. Update frontend API base URL in all `*Api.ts` files
3. Start the mobile app: `npx expo start`
4. Login with: `test@perlme.com` / `Password123!`
5. Test all screens and features

Enjoy testing! 🚀

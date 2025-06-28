const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

class PrismaService {
  // User operations
  async createUser(userData) {
    try {
      return await prisma.user.create({
        data: userData
      });
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async findUserByEmail(email) {
    try {
      return await prisma.user.findUnique({
        where: { email }
      });
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  async findUserById(id) {
    try {
      return await prisma.user.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error finding user by id:', error);
      throw error;
    }
  }

  // Message operations
  async createMessage(messageData) {
    try {
      return await prisma.message.create({
        data: messageData,
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          receiver: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating message:', error);
      throw error;
    }
  }

  async getMessages(limit = 50, offset = 0) {
    try {
      return await prisma.message.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          },
          receiver: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting messages:', error);
      throw error;
    }
  }

  async getMessagesByGroup(groupId, limit = 50, offset = 0) {
    try {
      return await prisma.message.findMany({
        where: {
          groupId: groupId
        },
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          sender: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting group messages:', error);
      throw error;
    }
  }

  // Group operations
  async createGroup(groupData) {
    try {
      return await prisma.group.create({
        data: groupData
      });
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  }

  async addUserToGroup(userId, groupId, role = 'MEMBER') {
    try {
      return await prisma.groupMember.create({
        data: {
          userId,
          groupId,
          role
        }
      });
    } catch (error) {
      console.error('Error adding user to group:', error);
      throw error;
    }
  }

  async getGroupMembers(groupId) {
    try {
      return await prisma.groupMember.findMany({
        where: {
          groupId
        },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              avatarUrl: true
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting group members:', error);
      throw error;
    }
  }

  // Connection management
  async connect() {
    try {
      await prisma.$connect();
      console.log('✅ Connected to database');
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  }

  async disconnect() {
    try {
      await prisma.$disconnect();
      console.log('✅ Disconnected from database');
    } catch (error) {
      console.error('❌ Database disconnection failed:', error);
    }
  }
}

module.exports = new PrismaService(); 
// src/repositories/user.repository.js
import { PrismaClient } from '@prisma/client'

// Initialize and configure Prisma Client
const prisma = new PrismaClient()

// Database connection handler
async function initializeDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection established')
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Immediately test the database connection
initializeDatabase()

// Cleanup on process termination
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

// User Repository Implementation
export class UserRepository {
  // Create a new user
  async create(data) {
    return prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        passwordHash: data.passwordHash,
        dateOfBirth: data.dateOfBirth,
        bio: data.bio,
        avatarUrl: data.avatarUrl,
        coverPhotoUrl: data.coverPhotoUrl,
      },
    })
  }

  // Find user by email
  async findByEmail(email) {
    return prisma.user.findUnique({
      where: { email },
    })
  }

  // Find user by ID (profile view)
  async findById(id) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: this.profileFields(),
    })
    
    if (!user) return null
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio || undefined,
      avatarUrl: user.avatarUrl || undefined,
      coverPhotoUrl: user.coverPhotoUrl || undefined,
      dateOfBirth: user.dateOfBirth,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  // Update user profile
  async update(id, data) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
      },
      select: this.profileFields(),
    })
    
    return {
      id: user.id,
      username: user.username,
      email: user.email,
      bio: user.bio || undefined,
      avatarUrl: user.avatarUrl || undefined,
      coverPhotoUrl: user.coverPhotoUrl || undefined,
      dateOfBirth: user.dateOfBirth,
      isVerified: user.isVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  // Delete user
  async delete(id) {
    await prisma.user.delete({
      where: { id },
    })
  }

  // Helper method for profile fields selection
  profileFields() {
    return {
      id: true,
      username: true,
      email: true,
      bio: true,
      avatarUrl: true,
      coverPhotoUrl: true,
      dateOfBirth: true,
      isVerified: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    }
  }
}

export default prisma

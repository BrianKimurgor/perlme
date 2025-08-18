const prisma = new PrismaClient()

async function initializeDatabase() {
  try {
    await prisma.$connect()
    console.log('✅ Database connection established')
    
    // Optional: Add any initial queries or database checks here
    // Example: await prisma.$queryRaw`SELECT 1`
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    await prisma.$disconnect()
    process.exit(1)
  }
}

// Execute initialization immediately
initializeDatabase()

// Handle shutdown signals
process.on('SIGINT', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  await prisma.$disconnect()
  process.exit(0)
})

export default prisma
import mongoose from 'mongoose'

export async function connectMongo() {
  const uri = process.env.MONGODB_URI ?? 'mongodb://localhost:27017/duwitch'
  try {
    await mongoose.connect(uri)
    console.log('[MongoDB] Connected')
  } catch (err) {
    console.error('[MongoDB] Connection failed:', err)
    throw err
  }
}

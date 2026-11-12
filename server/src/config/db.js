import mongoose from 'mongoose'
import { env } from './env.js'

mongoose.set('strictQuery', true)

export async function connectDB() {
  mongoose.connection.on('disconnected', () => console.warn('[db] MongoDB disconnected'))
  mongoose.connection.on('reconnected', () => console.log('[db] MongoDB reconnected'))

  await mongoose.connect(env.mongoUri, { serverSelectionTimeoutMS: 8000 })
  console.log(`[db] MongoDB connected (${mongoose.connection.name})`)
}

export async function closeDB() {
  await mongoose.connection.close()
}

// 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
const STATES = ['disconnected', 'connected', 'connecting', 'disconnecting']
export const dbState = () => STATES[mongoose.connection.readyState] ?? 'unknown'

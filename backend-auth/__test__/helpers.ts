import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

const mongoServer = new MongoMemoryServer()

export const connect = async () => {
  await mongoServer.ensureInstance()
	const mongoUri = mongoServer.getUri()
	try {
		await mongoose.connect(mongoUri);
        console.log('Connected');
	} catch (error) {
		console.error(error)
	}
}

export const close = async () => {
	await mongoose.disconnect();
	await mongoServer.stop();
}

// export const clear = async () => {
// 	const collections = mongoose.connection.collections;

// 	for (const key in collections) {
// 		await collections[key].deleteMany();
// 	}
// }

export function mockFunction<T extends (...args: any[]) => any>(fn: T): jest.MockedFunction<T> {
    return fn as jest.MockedFunction<T>;
}
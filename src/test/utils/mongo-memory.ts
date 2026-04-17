import mongoose from 'mongoose';
import { MongoMemoryReplSet } from 'mongodb-memory-server';

let mongoServer: MongoMemoryReplSet | null = null;
let isConnected = false;

export async function connectTestDatabase(): Promise<void> {
  if (isConnected) {
    return;
  }

  jest.setTimeout(180000);

  mongoServer = await MongoMemoryReplSet.create({
    binary: {
      version: '7.0.14',
    },
    replSet: {
      count: 1,
    },
  });

  await mongoose.connect(mongoServer.getUri());
  isConnected = true;
}

export async function clearTestDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}

export async function disconnectTestDatabase(): Promise<void> {
  if (!isConnected) {
    return;
  }

  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();

  if (mongoServer) {
    await mongoServer.stop();
  }

  mongoServer = null;
  isConnected = false;
}

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export default async function mongoConnection(): Promise<string> {
    const mongod = await MongoMemoryServer.create();
    const mongo_uri = mongod.getUri();
    await mongoose.connect(mongo_uri, {
        dbName: 'crud-api-db',
    });
    return mongo_uri;
}
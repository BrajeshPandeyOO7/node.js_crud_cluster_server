import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export async function CreateMongoUri() {
    const mongod = await MongoMemoryServer.create();
    return mongod.getUri();
}

export default async function ConnectToMongoose(mongo_uri:string){
    await mongoose.connect(mongo_uri, {
        dbName: 'crud-api-db',
    });
    console.log(`MongoDB connected to ${mongo_uri}`);
}
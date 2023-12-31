import supertest from "supertest";
import { createExpressServer } from "../server/server-config";
import ConnectToMongoose, { CreateMongoUri } from "../db/conn";

describe('non existing endpoint', () => {
    beforeAll(async () => {
        const mongo_uri = await CreateMongoUri();
        await ConnectToMongoose(mongo_uri);
    });
    
    const request = supertest(createExpressServer())

    it('response should be 404' , async () =>{
        let { status, text } = await request
        .get('/api/order/')
        .set('Accept', 'application/json');

        expect(status).toBe(404);
        expect(text).toMatch('Endpoint does not exist');
    })
})
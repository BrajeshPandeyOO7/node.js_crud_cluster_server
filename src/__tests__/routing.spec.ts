import supertest from "supertest";
import createExpressServer from "../server/server-config";
import mongoConnection from "../db/conn";

describe('non existing endpoint', () => {
    beforeAll(async () => {
        await mongoConnection()
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
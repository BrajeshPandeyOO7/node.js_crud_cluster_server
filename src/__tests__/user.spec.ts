import supertest from "supertest"
import createExpressServer from "../server/server-config"
import mongoConnection from "../db/conn"

describe('user-controller', () => {
    beforeAll(async () => {
        await mongoConnection()
    })

    const request = supertest(createExpressServer())

    describe('/api/users', () => {
        it('response should be empty arry if no users in db', async () => {
            let { status, body } = await request
            .get('/api/users')
            .set('Accept', 'application/json');
            expect(status).toBe(200)
            expect(body).toEqual([]);
        });

        it('response should be 400 Bad request. if _id is not valid' , async () => {
            let { status, text } = await request
            .get('/api/users/1234d4')
            .set('Accept', 'application/json');
            expect(status).toBe(400)
            expect(text).toMatch('Id is not valid');
        });

        it('response should be 404 if record is not found', async () => {
            let { status, text } = await request
            .get('/api/users/656f8cf129f7dadf1fe9780d')
            .set('Accept', 'application/json');
            expect(status).toBe(404)
            expect(text).toMatch('record does not exist!');
        });

        let userid:any;
        it('response should contain newly created record' , async () => {
            let { status, body: { _id, username, age, hobbies } } = await request
            .post('/api/users')
            .send(
                {
                    username: 'john',
                    age: 21,
                    hobbies: ['cricket']
                }
            )
            .set('Content-Type', 'application/json');

            expect(status).toBe(201);
            expect(username).toMatch('john');
            expect(age).toBe(21);
            expect(hobbies).toEqual(['cricket']);
            userid = _id;
        });

        it('response should be newly created record by userid', async () => {
            let { status, body: { _id, username, age, hobbies } } = await request
            .get(`/api/users/${userid}`)
            .set('Accept', 'application/json');

            expect(status).toBe(200);
            expect(userid).toMatch(_id)
            expect(username).toMatch('john');
            expect(age).toBe(21);
            expect(hobbies).toEqual(['cricket']);
        });

        it('update newly created record and response should be same as well as there id', async () => {
            let { status, body: { _id, username, age, hobbies } } = await request
            .put(`/api/users/${userid}`)
            .send(
                {
                    age: 26,
                    hobbies: ['football']
                }
            )
            .set('Content-Type', 'application/json');

            expect(status).toBe(200);
            expect(userid).toMatch(_id);
            expect(username).toMatch('john');
            expect(age).toBe(26);
            expect(hobbies).toEqual(['cricket','football']);
        });

        it('delete currently created record by id' , async () => {
            let { status } = await request
            .delete(`/api/users/${userid}`);

            expect(status).toBe(204);
        })

        it('response should be 404 while try to fetch deleted record', async () => {
            let { status, text } = await request
            .get(`/api/users/${userid}`)
            .set('Accept', 'application/json');
            expect(status).toBe(404)
            expect(text).toMatch('record does not exist!');
        });
    });
})
import bodyParser from 'body-parser';
import express from 'express';
import { PORT } from '../utility/config';
import mongoConnection from '../db/conn';
import GloblApiRouting from '../routes/routes';

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use((req: any, res: any, next: any) => {
  res.header("Access-Control-Allow-Origin", "*") // Allow all origin to communicate with our server
  res.header("Access-Control-Allow-Headers",
    "Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR, access-token")
  if (req.method === 'OPTIONS') {
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE") // Allow all method
    return res.status(200).json({})
  }
  next()
});

GloblApiRouting(app);

mongoConnection().then((mongo_uri:string) => {
    console.log(`MongoDB connected to ${mongo_uri}`);
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`)
    })
}).catch(err => {
    console.log(err.message);
})


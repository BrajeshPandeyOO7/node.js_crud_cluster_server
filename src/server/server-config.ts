import GloblApiRouting from "../routes/routes";
import bodyParser from "body-parser";
import express from "express";
import ConnectToMongoose, { CreateMongoUri } from "../db/conn";

export function createExpressServer() {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.use((req: any, res: any, next: any) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origin to communicate with our server
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requeted-With, Content-Type, Accept, Authorization, RBR, access-token"
    );
    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, PATCH, DELETE"
      ); // Allow all method
      return res.status(200).json({});
    }
    next();
  });
  GloblApiRouting(app);
  return app;
}

export default async function bootstrap(PORT: string | number) {
  try {
    const app = createExpressServer();
    const mongo_uri = await CreateMongoUri();
    await ConnectToMongoose(mongo_uri);
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  } catch (error) {
    console.log("Failed to start server!");
  }
}

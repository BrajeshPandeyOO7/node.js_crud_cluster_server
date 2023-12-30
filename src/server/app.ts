import { PORT } from "../utility/config";
import mongoConnection from "../db/conn";
import createExpressServer from "./server-config";

const app = createExpressServer();

mongoConnection()
  .then((mongo_uri: string) => {
    console.log(`MongoDB connected to ${mongo_uri}`);
    app.listen(PORT, () => {
      console.log(`Server running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });

import cluster from "node:cluster";
import http from "node:http";
import { availableParallelism } from "node:os";
import process from "node:process";
import { createExpressServer } from "./server-config";
import ConnectToMongoose, { CreateMongoUri } from "../db/conn";
import { PORT } from "../utility/config";
import httpProxy from 'http-proxy';

const numCPUs = availableParallelism();

async function initiateDistributedServer() {
  if (cluster.isPrimary) {
    const mongo_uri = await CreateMongoUri();
    const workerInfo: any = {};
    const serversInfo: string[] = []

    for (let i = 0; i < numCPUs; i++) { // Fork workers.
      const env = {
        PORT: (Number(PORT) + 1 ) + i,
        MONGO_URI: mongo_uri,
      }
      const worker = cluster.fork(env);
      serversInfo.push(`http://localhost:${env.PORT}`)
      if (worker.process.pid) {
        workerInfo[worker.process.pid] = env.PORT;
      }
    }

    // Fork new worker. If existing workers exit
    cluster.on("exit", (worker, code, signal) => {
      if(worker.isDead() && worker.process.pid){
        let worker_port = workerInfo[worker.process.pid];
        delete workerInfo[worker.process.pid]; // Delete dies worker
        const new_worker = cluster.fork({
          PORT: worker_port,
          MONGO_URI: mongo_uri,
        });
        if (new_worker.process.pid) {
          workerInfo[new_worker.process.pid] = worker_port;
        }
      }
    });

  // Create Reverse proxy for load balancing!
    const proxy = httpProxy.createProxyServer();
    let serverNumber = 0;
    const server = http.createServer((req, res) => {
      const target = serversInfo[serverNumber];
      serverNumber = (serverNumber + 1) % serversInfo.length;
      proxy.web(req, res, { target: target });
    });

    server.listen(PORT, () => {
      console.log(`Proxy Server listen on ${PORT}`);
    });

  } else {
    let { PORT, MONGO_URI } = process.env;
    const app = createExpressServer();
    MONGO_URI && await ConnectToMongoose(MONGO_URI);
    app.listen(PORT, () => console.log(`server listen on ${PORT}`));
  }
}

initiateDistributedServer();

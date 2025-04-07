const cluster = require("node:cluster");
const http = require("http");
if (cluster.isPrimary) {
  const coreCount = require("node:os").availableParallelism();
  for (let i = 0; i < coreCount; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(
      `Worker ${worker.process.pid} died (${signal} | ${code}). Restarting...`
    );
    cluster.fork();
  });
} else {
  const PORT = 8090;
  const workerId = cluster.worker.id;
  //require("./index.js");
  const server = http.createServer((req, res) => {
    if (req.url === "/api/get-json-data" && req.method === "GET") {
      console.log(
        `Request received by Worker ID: ${workerId}, PID: ${process.pid}`
      );
      res.end("THis is big size json data".repeat(100));
    }
  });
  server.listen(PORT, () => {
    console.log(`Server has started on port ${PORT}`);
  });
}

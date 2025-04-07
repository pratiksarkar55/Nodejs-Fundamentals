const { Worker } = require("worker_threads");
const { performance } = require("perf_hooks");

process.title = "node-rs";
//---------------------without calc batch-------------------------
// 43 secs to handle 10k requests with 6.5 million bytes/sec with 1 thread.
// 17 secs to handle 10k requests with 17.5 million bytes/sec with 4 thread

//---------------------with calc batch-------------------------
//17 secs to handle 10k requests with 17.5 million bytes/sec with 1 thread
// with clusters(4 process in 12 core) took 130 secs for 1 million requests
//

//REFUSED TO CONNECTT ERROR WHEN I DO 4 THREADS AND calc-batch.js.Why?
const THREADS = 1;
const count = 10_000_000_000_000_000;
let completed = 0;

for (let i = 0; i < THREADS; i++) {
  const start = performance.now();

  const worker = new Worker("./calc-batch.js", {
    workerData: {
      count: count / THREADS,
      hostname: "localhost",
      port: 8090,
      path: "/api/get-json-data",
      method: "GET",
    },
  });

  const threadId = worker.threadId;
  console.log(`Worker ${threadId} started`);

  worker.on("message", (msg) => {});

  worker.on("error", (err) => {
    console.error(err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker ${threadId} exited.`);

    completed++;

    if (completed === THREADS) {
      console.log(`Time taken: ${(performance.now() - start) / 1000}s`);
    }

    if (code !== 0) {
      console.error(`Worker exited with code ${code}`);
    }
  });
}

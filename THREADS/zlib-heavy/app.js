const { Worker } = require("worker_threads");
const { performance } = require("perf_hooks");

process.env.UV_THREADPOOL_SIZE = 12;

const THREADS = 1;
let completed = 0;
//Crashes due to  high memory consumption in case of 100_000 in calc-sync.js
const count = 100_000;

for (let i = 0; i < THREADS; i++) {
  const start = performance.now();

  const worker = new Worker("./calc-sync.js", {
    workerData: { count: count / THREADS },
  });

  const threadId = worker.threadId;
  console.log(`Worker ${threadId} started.`);

  worker.on("message", (msg) => {
    console.log(msg);
  });

  worker.on("error", (err) => {
    console.error(err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker ${threadId} exited.`);

    completed++;

    if (completed === THREADS) {
      console.log(`Time taken: ${(performance.now() - start) / 1000} secs`);
    }

    if (code !== 0) {
      console.error(new Error(`Worker exited with code ${code}`));
    }
  });
}

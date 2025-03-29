const { Worker } = require("worker_threads");
const { performance } = require("perf_hooks");

// Time windows 12 logical core for 1_000_000_0 with 1 thread - 36s
// Time windows 12 logical core for 1_000_000_0 with 2 threads - 20s
// Time windows 12 logical core for 1_000_000_0 with 6 threads - 11s
// Time windows 12 logical core for 1_000_000_0 with 12 threads - 12s
const THREADS = 6;
let completed = 0;
let sum = 0;
const count = 1_000_000_0;
const workerFileName = "./calc-crypto.js";

console.log(`Running with ${workerFileName}...`);

for (let i = 0; i < THREADS; i++) {
  const start = performance.now();

  const worker = new Worker(workerFileName, {
    workerData: { count: count / THREADS },
  });

  const threadId = worker.threadId;
  console.log(`Worker ${threadId} started`);

  worker.on("message", (number) => {
    sum += number;
  });

  worker.on("error", (err) => {
    console.error(err);
  });

  worker.on("exit", (code) => {
    console.log(`Worker ${threadId} exited.`);

    completed++;

    if (completed === THREADS) {
      console.log(`Time taken: ${(performance.now() - start) / 1000} secs`);
      console.log(`Sum: ${sum}`);
    }

    if (code !== 0) {
      console.error(new Error(`Worker exited with code ${code}`));
    }
  });
}

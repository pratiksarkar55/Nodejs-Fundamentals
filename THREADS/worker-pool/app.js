const Pool = require("./pool");
const { performance } = require("perf_hooks");

const numWorkers = 4;
const pool = new Pool(numWorkers);

let result = [];
let tasksDone = 0;
// if increase to 200_000_000 heap memory allocation fails because main thread gets blocked by the loop and
//scheduledTasks builds up as worker.on message is not reached.
//const totalTasks = 200_000_000;
const totalTasks = 100_00;
const start = performance.now();
const batchSize = 1000;
let startIndex = 0;
let endIndex = batchSize;

function updateIndex() {
  startIndex = endIndex;
  endIndex = Math.min(endIndex + batchSize, totalTasks);
}

operation();

function operation() {
  for (let i = startIndex; i < endIndex; i++) {
    pool.submit(
      "generatePrimes",
      {
        count: 2_000_0,
        start: 1_000_000_000 + i * 500,
        format: true,
        log: false,
      },
      (primes) => {
        if (tasksDone === endIndex - 1 && endIndex < totalTasks) {
          console.log("Tasks done");
          updateIndex();
          operation();
        }

        // console.log("Primes generated.");

        console.log(performance.eventLoopUtilization());

        tasksDone++;
        // --------------WITH 4 THREADS-------------------------------
        // if count 200  and we comment below line eventloop utilization get's half.More time is given
        // to cpu utlization for other threads(Close to 32 in windows).
        //if we uncomment it's closer to 20 in windows

        //---------------WITH 2 THREADS-------------------------------
        //if we uncomment it's 16 in windows

        // HENCE KEEPING MAIN THREAD EVENTLOOP BUSY, WON'T PROVIDE CPU TIME TO OTHER THREADS
        //SO MORE THREADS IS NOT ALWAYS THE SOLUTION
        result = result.concat(primes);

        if (tasksDone === totalTasks) {
          console.log(`Time taken: ${performance.now() - start}ms`);
          console.log(result.sort());
          process.exit(0);
        }
      }
    );
    if (i === endIndex - 1)
      console.log(
        `Loop finished with startIndex=${startIndex} and endIndex=${endIndex}`
      );
  }
}

const { performance } = require("perf_hooks");

// The idle and active properties returned by performance.eventLoopUtilization()
// are cumulative values representing the total time spent in each state since the Node.js process started.

function sleep(seconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000);
  });
}

(async () => {
  //  console.log(performance.eventLoopUtilization());
  // for (let i = 0; i < 10_000_000_000_000; i++) {
  await sleep(5);
  // if (i % 100 === 0) {
  console.log(performance.eventLoopUtilization());
  //}
  //}
})();

for (let i = 0; i < 10_000; i++) {
  setTimeout(() => {}, 0);
}

console.log(performance.eventLoopUtilization());

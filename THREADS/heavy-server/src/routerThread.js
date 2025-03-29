const { performance } = require("perf_hooks");
const generatePrimes = require("../lib/prime-generator");
const { workerData, parentPort } = require("worker_threads");

const count = workerData.count;
const start = workerData.start;
const primes = generatePrimes(count, start);

parentPort.postMessage(primes);

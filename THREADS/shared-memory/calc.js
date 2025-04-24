const { workerData, threadId } = require("worker_threads");

const data = Buffer.from(workerData.data);

// console.log(`Thread before manipulation ${threadId} data =`, data);

data[threadId] = 255;

// console.log(`Thread after manipulation ${threadId} data =`, data);

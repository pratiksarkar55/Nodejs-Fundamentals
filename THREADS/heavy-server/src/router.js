// Controllers
const User = require("./controllers/user");
const url = require("url");

const { performance } = require("perf_hooks");
const { Worker } = require("worker_threads");

module.exports = (server) => {
  // ------------------------------------------------ //
  // ************ USER ROUTES ************* //
  // ------------------------------------------------ //

  // Log a user in and give them a token
  server.route("post", "/api/login", User.logUserIn);

  // Log a user out
  server.route("delete", "/api/logout", User.logUserOut);

  // Send user info
  server.route("get", "/api/user", User.sendUserInfo);

  // Update a user info
  server.route("put", "/api/user", User.updateUser);

  // ------------------------------------------------ //
  // ************ PRIME NUMBER ROUTES ************* //
  // ------------------------------------------------ //

  server.route("get", "/api/primes", (req, res) => {
    const startTime = performance.now();
    const parsedUrl = url.parse(req.url, true);
    const queryParams = parsedUrl.query;
    const count = queryParams.count;
    let start = BigInt(queryParams.start);
    if (start < BigInt(Number.MAX_SAFE_INTEGER)) {
      start = Number(start);
    }
    const routerThread = new Worker("./src/routerThread.js", {
      workerData: { count: count, start: start },
    });

    let result = [];

    routerThread.on("message", (msg) => {
      result = msg;
    });

    routerThread.on("exit", (code) => {
      if (code === 0) {
        const endTime = performance.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);
        res.json({
          primes: result,
          time: duration,
        });
      }
    });
  });
};

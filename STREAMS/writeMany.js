const fs = require("fs").promises;
const TIME = 1000000;
// time - around 2 mins
//cpu around 100%
//memory-around 40mb
// (async () => {
//   let fileHandler = await fs.open("./text.txt", "w");
//   console.time("startWrite");
//   for (let i = 0; i < TIME; i++) {
//     await fileHandler.write(i.toString() + "\n");
//   }
//   console.timeEnd("startWrite");
//   fileHandler.close();
// })();

//memory is around 1GB
//cpu around 100% (1 core)
//Time is 9 secs
// (async () => {
//   fs.open("./text.txt", "w", (err, fd) => {
//     console.time("startWrite");
//     for (let i = 0; i < TIME; i++) {
//       fs.write(fd, i.toString(), () => {}); // lots of callbacks are pushed to event loop and they are not executed in order
//     }
//     console.timeEnd("startWrite");
//   });
// })();

//memory is around 50mb
//cpu around 100% (1 core)
//Time is 24 secs
// (async () => {
//   fs.open("./text.txt", "w", (err, fd) => {
//     console.time("startWrite");
//     for (let i = 0; i < TIME; i++) {
//       const buffer = Buffer.from(`${i}`, "utf-8");
//       fs.writeSync(fd, buffer);
//     }
//     console.timeEnd("startWrite");
//   });
// })();

//time - 1 sec
//memeory - 250mb
//DON'T DO IT BEACUSE WE DON'T DRAIN THE STREAM
// (async () => {
//   let fileHandler = await fs.open("./text.txt", "w");
//   const stream = fileHandler.createWriteStream();
//   console.time("startWrite");
//   for (let i = 0; i < TIME; i++) {
//     const buffer = Buffer.from(`${i}`, "utf-8");
//     stream.write(buffer);
//   }
//   console.timeEnd("startWrite");
//   fileHandler.close();
// })();

//Memory usage is around 50mb.
(async () => {
  let fileHandler = await fs.open("./src.txt", "w");
  const stream = fileHandler.createWriteStream();
  //   console.log(stream.writableHighWaterMark);//16384 or 16kb
  //   console.log(stream.writableLength); // how much of stream is filled which is 0 now
  //   const buff = Buffer.from("A");
  //   stream.write(buff);
  //   console.log(stream.writableLength); //1
  let value = 0;
  console.time("startWrite");
  for (let i = 0; i < TIME; i++) {
    const buffer = Buffer.from(`${i} `, "utf-8");
    if (i === TIME - 1) {
      return stream.end(buffer);
    }
    if (!stream.write(buffer)) {
      value = i;
      break;
    }
  }
  stream.on("drain", () => {
    for (let i = value; i < TIME; i++) {
      const buffer = Buffer.from(`${i} `, "utf-8");
      if (i === TIME - 1) {
        return stream.end(buffer);
      }
      if (!stream.write(buffer)) {
        value = i;
        break;
      }
    }
  });

  stream.on("finish", () => {
    console.timeEnd("startWrite");
    console.log("file closing");
    fileHandler.close();
  });
  //   const buff = Buffer.alloc(16384, 65);
  //   console.log(stream.write(buff));
})();

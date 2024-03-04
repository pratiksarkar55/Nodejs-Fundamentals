const EventEmitter = require("events");

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

let fn = function (x) {
  console.log("Events with param occured " + x);
};

myEmitter.on("foo", () => {
  console.log("Events occured again");
});

myEmitter.on("foo", () => {
  console.log("Events occured");
});

myEmitter.on("foo", fn);

myEmitter.on("bar", (x) => {
  console.log("Events with param occured with bar");
});
// will emit only once
myEmitter.once("barOnce", (x) => {
  console.log("Events with param occured with barOnce");
});

myEmitter.emit("foo", "again");
myEmitter.off("foo", fn);
console.log("Now what happens");
myEmitter.emit("foo");
// myEmitter.emit("bar");
// myEmitter.emit("barOnce");
// myEmitter.emit("barOnce");

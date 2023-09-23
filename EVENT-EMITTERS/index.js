const EventEmitter = require("events");

class Emitter extends EventEmitter {}

const myEmitter = new Emitter();

myEmitter.on("foo", () => {
  console.log("Events occured again");
});
myEmitter.on("foo", () => {
  console.log("Events occured");
});

myEmitter.on("foo", (x) => {
  console.log("Events with param occured again");
});

myEmitter.on("bar", (x) => {
  console.log("Events with param occured with bar");
});
// will emit only once
myEmitter.once("barOnce", (x) => {
  console.log("Events with param occured with barOnce");
});

myEmitter.emit("foo", "a");
myEmitter.emit("bar");

myEmitter.emit("barOnce");
myEmitter.emit("barOnce");

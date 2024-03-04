function Emitters() {
  class CustomEmitter {
    listeners = {};

    addListener(eventName, fn) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      this.listeners[eventName].push(fn);
      return this;
    }

    on(eventName, fn) {
      return this.addListener(eventName, fn);
    }

    once(eventName, fn) {
      this.listeners[eventName] = this.listeners[eventName] || [];
      const onceWrapper = (...args) => {
        fn(...args);
        this.off(eventName, onceWrapper);
      };
      this.listeners[eventName].push(onceWrapper);
      return this;
    }

    off(eventName, fn) {
      return this.removeListener(eventName, fn);
    }

    removeListener(eventName, fn) {
      let lis = this.listeners[eventName];
      if (!lis) return this;
      for (let i = 0; i < lis.length; i++) {
        if (lis[i].toString() === fn.toString()) {
          lis.splice(i, 1);
          break;
        }
      }
      return this;
    }

    emit(eventName, ...args) {
      let fns = this.listeners[eventName];
      if (!fns) return false;
      fns.forEach((f) => {
        f(...args);
      });
      return true;
    }

    listenerCount(eventName) {
      let fns = this.listeners[eventName] || [];
      return fns.length;
    }

    rawListeners(eventName) {
      return this.listeners[eventName];
    }
  }

  class WithTime extends CustomEmitter {
    execute(asyncFunc, ...args) {
      asyncFunc();
    }
  }

  const withTime = new WithTime();

  withTime.on("begin", () => console.log("About to execute"));
  withTime.on("end", () => console.log("Done with execute"));

  withTime.execute(() => {
    withTime.emit("begin");
    fetch("https://jsonplaceholder.typicode.com/posts/1")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        withTime.emit("end");
      });
  });

  console.log(withTime.rawListeners("end"));
}

// console.log(b);
// var b = 10;

// // let a = function (...args) {
// //   b(...args);
// // };

// // let b = function (param) {
// //   console.log(param);
// // };

// // a("hello", "world");

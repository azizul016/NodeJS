const EventEmitter = require("events");
// const event = new EventEmitter();

// //listening events
// event.on("loadMessage", (arg) => {
//   console.log("Hello ", arg);
//   console.log("Listening to event");
// });

// //emitting event - raising event;
// event.emit("loadMessage", "Azizul");

class myEvent extends EventEmitter {
  log(message) {
    this.emit("loadMessage", message);
  }
}

const event = new myEvent();

event.on("loadMessage", (message) => {
  console.log("Hello ", message);
  console.log("Listening to Emit");
});

event.log("Azizul");

import socketio from "socket.io-client";

const socket = socketio("http://192.168.15.242:3333", {
  autoConnect: false
});

socket.on("connect_error", error => {
  console.log(error);
});

socket.on("error", error => {
  console.log(error);
});

function subscribeNewDevs(subscribeFunction) {
  socket.on("new-dev", subscribeFunction);
}

function connect(latitude, longitude, techs) {
  if (!socket.connected) {
    socket.io.opts.query = {
      latitude,
      longitude,
      techs
    };
    socket.connect();
    if (socket.connected) {
      console.log("connected");
    }
  }
}

function disconnect() {
  if (socket.connected) {
    socket.disconnect();
  }
}

export { connect, disconnect, subscribeNewDevs };

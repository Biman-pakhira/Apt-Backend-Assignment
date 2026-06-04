const Order = require("../models/Order");

const startOrderWatcher = (io) => {
  console.log("Order Watcher Started");

  const changeStream = Order.watch([], {
    fullDocument: "updateLookup",
  });

  changeStream.on("change", (change) => {
    console.log("DB Change Detected");
    console.log("Operation:", change.operationType);
    console.log(change.fullDocument);

    io.emit("orderUpdated", {
      operationType: change.operationType,
      document: change.fullDocument,
    });
  });

  changeStream.on("error", (err) => {
    console.error("Change Stream Error:", err);
  });
};

module.exports = startOrderWatcher;
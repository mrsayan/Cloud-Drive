const app = require("./app");
const dotenv = require("dotenv/config");
const mongoose = require("mongoose");

mongoose
  .connect("process.env.MONGO_URI || mongodb://localhost:27017/cloudManager", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connection established"));

app.listen(process.env.PORT || 3000, function () {
  console.log("listening");
});

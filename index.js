const express = require("express");
const cors = require("cors");
const app = express();
const api = require("./routes");
require("dotenv").config();
// Import Routes
const authRoute = require("./routes/auth");

const port = process.env.DB_PORT || 5000;

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//Route Middleware
app.use("/api/user", authRoute);
app.use("/api", api);

app.listen(port, (err) => {
  if (err) {
    throw new Error("Something bad happened");
  }
  console.log(`Server listening on port ${port}`);
});

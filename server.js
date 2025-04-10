if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const rootRouter = require("./routes/index");
const authorsRouter = require("./routes/author");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("layout", "layouts/mainLayout");

app.use(express.static("public"));
app.use(expressLayouts);
app.use("/", rootRouter);
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use("/authors", authorsRouter);
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error.name));
db.once("open", () => console.log("connected to mongoose"));

app.listen(4000);

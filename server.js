if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverRide = require("method-override")

const rootRouter = require("./routes/index");
const authorsRouter = require("./routes/author");
const bookRouter = require("./routes/book")

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.set("layout", "layouts/mainLayout");

app.use(express.static("public"));
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: false, limit: "10mb" }));
app.use(methodOverRide("_method"))

app.use("/", rootRouter);
app.use("/authors", authorsRouter);
app.use("/books", bookRouter)
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (error) => console.error(error.name));
db.once("open", () => console.log("connected to mongoose"));

app.listen(4000);

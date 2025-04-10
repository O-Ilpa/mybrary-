const express = require("express");
const router = express.Router();
const Books = require("../models/book")

router.get("/", async (req, res) => {
  let books;
  try {
    books = await Books.find().sort({createdAt: "desc"}).limit(5).exec()
  } catch {
    books = []
  }
  res.render("index", {books: books});
});

module.exports = router;

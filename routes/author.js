const express = require("express");
const Author = require("../models/author");
const router = express.Router();

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i")
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", {authors: authors, searchOptions: req.query});
  } catch {
    res.redirect("/")
  }
});

router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

router.post("/", async (req, res) => {
  const newAuthor = new Author({
    name: req.body.name,
  });
  try { 
    await newAuthor.save();
    console.log("book is saved now");
    res.redirect("authors")
  } catch (err) {
    res.render("authors/new", {
      message: "there is an error " + err,
      author: new Author(),
    });
  }
});

module.exports = router;

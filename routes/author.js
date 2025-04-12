const express = require("express");
const router = express.Router();
const Author = require("../models/author");
const Books = require("../models/book")

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.name != null && req.query.name !== "") {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const authors = await Author.find(searchOptions);
    res.render("authors/index", { authors: authors, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });
  try {
    await author.save();
    console.log("author is saved now");
    res.redirect(`authors/${author.id}`);
  } catch {
    res.render("authors/new", {
      message: "there is an error Creating the Author",
      author: new Author(),
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id)
    const books = await Books.find({author: author.id}).limit(6).exec();
    res.render("authors/show", {
      author: author,
      booksByAuthor: books
    })
  } catch {

  }
});
router.get("/:id/edit", async (req, res) => {
  try {
    const author = await Author.findById(req.params.id);
    res.render("authors/edit", { author: author });
  } catch {
    res.redirect("/authors");
  }
});
router.put("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    author.name = req.body.name;
    await author.save();
    res.redirect(`/authors/${author.id}`);
    console.log("author is saved now");
  } catch (err) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.render("authors/edit", {
        message: "there is an error Updating the Author",
        author: author,
      });
    }
    console.log(err)
  }
});
router.delete("/:id", async (req, res) => {
  let author;
  try {
    author = await Author.findById(req.params.id);
    await author.deleteOne();
    console.log("author is deleted now");
    res.redirect(`/authors`);
  } catch (err) {
    if (author == null) {
      res.redirect("/");
    } else {
      res.redirect(`/authors/${author.id}`)
      console.log(err)
    }
  }});
module.exports = router;

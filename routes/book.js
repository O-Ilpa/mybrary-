const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const router = express.Router();
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

router.get("/", async (req, res) => {
    let searchOptions = {};
    if (req.query.title != null && req.query.title !== "") {
      searchOptions.title = new RegExp(req.query.title, "i")
    }
    try {
      const Books = await Book.find(searchOptions);
      res.render("books/index", {books: Books, searchOptions: req.query});
    } catch {
      res.redirect("/")
    }
});

router.get("/new", async (req, res) => {
  renderNewPage(res, new Book())
});

router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.cover)
  try {
    await book.save();
    res.redirect("books")
    console.log("book saved Succesfully")
  } catch (err) {
    renderNewPage(res, book, err)
  } 
});
const saveCover = (book, coverEncoded) => {
  if (coverEncoded == null ) return 
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from( cover.data, "base64");
    book.coverImageType = cover.type
  }
}
const renderNewPage = async (res, book, hasError) => {
  try {
    const authors = await Author.find({});
    const params =  { authors: authors, book: book }
    if (hasError) {
      params.errMessage = hasError
      console.log(hasError)
    }
    res.render("books/new", params);
  } catch {
    res.redirect("/books");
  }
}
module.exports = router;

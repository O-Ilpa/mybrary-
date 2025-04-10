const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const path = require("path");
const uploadPath = path.join("public", Book.coverImageBasePath);
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const book = require("../models/book");
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];
const upload = multer({
  dest: uploadPath,
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype));
  },
});

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

router.post("/", upload.single("cover"), async (req, res) => {
  const fileName = req.file != null ? req.file.filename : null;
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
    coverImageName: fileName,
  });
  try {
    await book.save();
    res.redirect("books")
    console.log("book saved Succesfully")
  } catch (err) {
    if (book.coverImageName != null) {
      removeBookCover(book.coverImageName)
    }
    renderNewPage(res, book, err)
  } 
});
const removeBookCover = (fileName) => {
  fs.unlink(path.join(uploadPath, fileName), (err) => {
    console.error(err)
  })
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

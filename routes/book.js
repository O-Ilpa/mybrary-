const express = require("express");
const Book = require("../models/book");
const Author = require("../models/author");
const router = express.Router();
const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

router.get("/", async (req, res) => {
  let searchOptions = {};
  if (req.query.title != null && req.query.title !== "") {
    searchOptions.title = new RegExp(req.query.title, "i");
  }
  try {
    const Books = await Book.find(searchOptions);
    res.render("books/index", { books: Books, searchOptions: req.query });
  } catch {
    res.redirect("/");
  }
});

router.get("/new", async (req, res) => {
  renderNewPage(res, new Book());
});

router.post("/", async (req, res) => {
  const book = new Book({
    title: req.body.title,
    author: req.body.author,
    publishDate: new Date(req.body.publishDate),
    pageCount: req.body.pageCount,
    description: req.body.description,
  });
  saveCover(book, req.body.cover);
  try {
    const newBook = await book.save();
    res.redirect(`books/${newBook.id  }`);
    console.log("book saved Succesfully");
  } catch (err) {
    renderNewPage(res, book, err);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate("author").exec();
    res.render("books/show", { book: book });
  } catch {
    res.redirect("books");
  }
});

router.get("/:id/edit", async (req, res) => {
  const book = await Book.findById(req.params.id);
  try {
    renderEditPage(res, book);
  } catch {
    res.redirect("/");
  }
});
router.put("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    book.title = req.body.title;
    book.author = req.body.author;
    book.publishDate = req.body.publishDate;
    book.pageCount = req.body.pageCount;
    book.description = req.body.description;
    if (req.body.cover != null && req.body.cover !== "") {
      saveCover(book, req.body.cover);
    }
    await book.save();
    res.redirect(`/books/${book.id}`);
  } catch {
    if (book != null) {
      renderEditPage(res, book, true);
    } else {
      res.redirect("/");
    }
  }
});
router.delete("/:id", async (req, res) => {
  let book;
  try {
    book = await Book.findById(req.params.id);
    await book.deleteOne();
    res.redirect("/books")
  } catch {
    if (book != null) {
      res.render("books/show", {
        book: book,
        errMessage: "could not remove book",
      });
    }
  }
});
const saveCover = (book, coverEncoded) => {
  if (coverEncoded == null) return;
  const cover = JSON.parse(coverEncoded);
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    book.coverImage = new Buffer.from(cover.data, "base64");
    book.coverImageType = cover.type;
  }
};
const renderNewPage = async (res, book, hasError) => {
  renderFormPage(res, book, "new", hasError);
};
const renderEditPage = async (res, book, hasError) => {
  renderFormPage(res, book, "edit", hasError);
};
const renderFormPage = async (res, book, form, hasError = false) => {
  try {
    const author = await Author.find({});
    const params = {
      authors: author,
      book: book,
    };
    if (hasError) {
      if (form == "edit") {
        params.errMessage =
          "Error Updating Book, Please fill in all the required fields";
      } else if (form == "new") {
        params.errMessage =
          "Error Creating book, Please fill in all the required fields";
      }
    }

    res.render(`books/${form}`, params);
  } catch (err) {
    res.redirect("/books");
    console.log(err);
  }
};
module.exports = router;

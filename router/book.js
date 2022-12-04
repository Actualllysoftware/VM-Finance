const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Book = mongoose.model("financebook");

router.post("/createFinanceBook", (req, res) => {
  const { BookNo, Name, BookDate } = req.body;

  const CashBookFields = [
    "swamigal",
    "partners_captials",
    "deposit",
    "party_advance",
    "rc_book_advance",
    "tractor_monthly_ac",
    "ta_ac",
    "office_expenses",
    "printing_stationary",
    "salary",
    "phone_bill",
    "bank_charges",
    "deposit_penality_ac",
  ];

  const CashBookFields_Array = {
    swamigal: [],
    partners_captials: [],
    deposit: [],
    party_advance: [],
    rc_book_advance: [],
    tractor_monthly_ac: [],
    ta_ac: [],
    office_expenses: [],
    printing_stationary: [],
    salary: [],
    phone_bill: [],
    bank_charges: [],
    deposit_penality_ac: [],
  };

  const CashBook = {
    CashBookFields: CashBookFields,
    CashBookFields_Array: CashBookFields_Array,
  };

  const BookObject = {
    BookNo: BookNo,
    Name: Name,
    BookDate: BookDate,
    CashBook: CashBook,
    TrialBalance: [],
    BalanceSheet: [],
    Statement: [],
    Profit_Loss: [],
  };

  const book = new Book({
    BookObject,
  });
  book
    .save()
    .then((result) => {
      res.json({ book: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/financeBookList", (req, res) => {
  Book.find()
    .then((book) => {
      res.json({ book });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/deleteBook", (req, res) => {
  Book.findByIdAndRemove({ _id: req.body.bookID }, (err, doc) => {
    if (!err) {
      res.json("Deleted Successfully");
    } else {
      console.log("Something Went Wrong :" + err);
    }
  });
});

router.post("/updateFinanceBook", (req, res) => {
  const { BookID, FinanceBook } = req.body;

  Book.findOne({ _id: BookID })
    .then((book) => {
      if (!book) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      book.BookObject = FinanceBook.BookObject;
      book.save().then((savedbook) => {
        res.json({ message: "updated successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

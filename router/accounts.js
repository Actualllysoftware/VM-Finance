const express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const accounts = mongoose.model("accounts");

router.post("/form", (req, res) => {
  var account = new accounts();
  account.itemId = req.body.itemid;
  account.itemName = req.body.name;
  account.amount = req.body.amount;
  account.save((err, doc) => {
    if (!err) res.json({ message: "Item Added Successfully" });
    else console.log("Error during record insertion : " + err);
  });
});

router.post("/updateList", (req, res) => {
  accounts.findOneAndUpdate(
    { _id: req.body._id },
    req.body,
    { new: true },
    (err) => {
      if (!err) res.json({ message: "Item Updated Successfully" });
      else console.log("Error during record Updating : " + err);
    }
  );
});

router.get("/formlist", async (req, res) => {
  const data = await accounts.find();
  res.json(data);
});

router.get("/updatelist/:id", (req, res) => {
  accounts.findById({ _id: req.params.id }, (err, doc) => {
    if (!err) {
      res.json(doc);
    }
  });
});

router.post("/delete", (req, res) => {
  accounts.findByIdAndRemove({ _id: req.body._id }, (err, doc) => {
    if (!err) {
      res.json({ message: "Item Deleted Successfully" });
    } else {
      console.log("Error in employee delete :" + err);
    }
  });
});

module.exports = router;

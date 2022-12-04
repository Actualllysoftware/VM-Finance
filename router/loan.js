const express = require("express");
const app = express()
const router = express.Router();
const mongoose = require("mongoose");
const Loan = mongoose.model("loans");

router.post("/createloan", (req, res) => {
  const {
    LoanNo,
    Name,
    Address,
    LoanAmount,
    Total,
    Total_Principle,
    Total_Intrest,
    IntrestPerMonth,
    MonthlyAmount,
    Installment_Count,
    LoanDate,
    Phone,
    GuarantorName,
    GuarantorAddress,
    GuarantorPhone,
    Vehicle,
    Model,
    VehicleNo,
    Broker,
    SET,
    RC_Amount,
    TA_Amount,
    AreaCode,
    Intrest,
    Month_PayingArray,
    AccountStatus,
  } = req.body;

  const LoanObject = {
    LoanNo: LoanNo,
    Name: Name,
    Address: Address,
    LoanAmount: LoanAmount,
    Total: Total,
    Total_Principle: Total_Principle,
    Total_Intrest: Total_Intrest,
    IntrestPerMonth: IntrestPerMonth,
    MonthlyAmount: MonthlyAmount,
    Installment_Count: Installment_Count,
    LoanDate: LoanDate,
    Phone: Phone,
    GuarantorName: GuarantorName,
    GuarantorAddress: GuarantorAddress,
    GuarantorPhone: GuarantorPhone,
    Vehicle: Vehicle,
    Model: Model,
    VehicleNo: VehicleNo,
    Broker: Broker,
    SET: SET,
    RC_Amount: RC_Amount,
    TA_Amount: TA_Amount,
    AreaCode: AreaCode,
    Intrest: Intrest,
    Month_PayingArray: Month_PayingArray,
    Penality_Array: [],
    ReceiptArray: [],
    RC_Array: [],
    TA_Array: [],
    AccountStatus: AccountStatus,
    Balance_Principle: Total_Principle,
    Balance_Intrest: Total_Intrest,
  };

  const loan = new Loan({
    LoanObject,
  });
  loan
    .save()
    .then((result) => {
      res.json({ loan: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

//   Get Customer Name
router.get("/loanslist", (req, res) => {
  Loan.find()
    .then((loan) => {
      res.json({ loan });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/deleteLoan", (req, res) => {
  Loan.findByIdAndRemove({ _id: req.body.loanID }, (err, doc) => {
    if (!err) {
      res.json("Deleted Successfully");
    } else {
      console.log("Something Went Wrong :" + err);
    }
  });
});

router.post("/updateloan", (req, res) => {
  const {
    _id,
    LoanNo,
    Name,
    Address,
    LoanAmount,
    Total,
    MonthlyAmount,
    Installment_Count,
    LoanDate,
    Phone,
    GuarantorName,
    GuarantorAddress,
    GuarantorPhone,
    Vehicle,
    Model,
    VehicleNo,
    Broker,
    SET,
    RC_Amount,
    TA_Amount,
    AreaCode,
    Intrest,
    Month_PayingArray,
    Penality_Array,
    Receipt_Array,
    RC_Array,
    TA_Array,
    AccountStatus,
  } = req.body;

  const LoanObject = {
    LoanNo: LoanNo,
    Name: Name,
    Address: Address,
    LoanAmount: LoanAmount,
    Total: Total,
    MonthlyAmount: MonthlyAmount,
    Installment_Count: Installment_Count,
    LoanDate: LoanDate,
    Phone: Phone,
    GuarantorName: GuarantorName,
    GuarantorAddress: GuarantorAddress,
    GuarantorPhone: GuarantorPhone,
    Vehicle: Vehicle,
    Model: Model,
    VehicleNo: VehicleNo,
    Broker: Broker,
    SET: SET,
    RC_Amount: RC_Amount,
    TA_Amount: TA_Amount,
    AreaCode: AreaCode,
    Intrest: Intrest,
    Month_PayingArray: Month_PayingArray,
    Penality_Array: Penality_Array,
    ReceiptArray: Receipt_Array,
    RC_Array: RC_Array,
    TA_Array: TA_Array,
    AccountStatus: AccountStatus,
  };

  console.log(RC_Array, TA_Array);

  Loan.findOne({ _id: _id })
    .then((loan) => {
      if (!loan) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      loan.LoanObject = LoanObject;
      loan.save().then((savedLoan) => {
        res.json({ message: "updated successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/pay-due-current", (req, res) => {
  const {
    LoanID,
    ReceiptNO,
    Bill_Date,
    Receipt_Date,
    LoanNo,
    Intrest,
    Monthly_Pay,
    LoanAmount,
    DueMonthList,
    DueMonths,
    DueDays,
    DueAmount,
    Penality,
    PenalityAmount,
    TotalAmount,

    LoanData_Array,
    Monthly_Array,
    penality_Array,
    RC_Array,
    TA_Array,
    AccountStatus,
    _Balance_principle,
    _Balance_intrest,
  } = req.body;

  const ReceiptArray = LoanData_Array.ReceiptArray;

  const Receipt_Item = {
    ReceiptNO: ReceiptNO,
    Bill_Date: Bill_Date,
    Receipt_Date: Receipt_Date,
    LoanNo: LoanNo,
    Intrest: Intrest,
    LoanAmount: LoanAmount,
    Monthly_Pay: Monthly_Pay,
    DueMonthList: DueMonthList,
    DueMonths: DueMonths,
    DueDays: DueDays,
    DueAmount: DueAmount,
    Penality: Penality,
    PenalityAmount: PenalityAmount,
    TotalAmount: TotalAmount,
    Monthly_Array: Monthly_Array,
    penality_Array: penality_Array,
  };

  ReceiptArray.push(Receipt_Item);

  const LoanObject = {
    LoanNo: LoanData_Array.LoanNo,
    Name: LoanData_Array.Name,
    Address: LoanData_Array.Address,
    LoanAmount: LoanData_Array.LoanAmount,
    Total: LoanData_Array.Total,

    Total_Principle: LoanData_Array.Total_Principle,
    Total_Intrest: LoanData_Array.Total_Intrest,
    IntrestPerMonth: LoanData_Array.IntrestPerMonth,

    MonthlyAmount: LoanData_Array.MonthlyAmount,
    Installment_Count: LoanData_Array.Installment_Count,
    LoanDate: LoanData_Array.LoanDate,
    Phone: LoanData_Array.Phone,
    GuarantorName: LoanData_Array.GuarantorName,
    GuarantorAddress: LoanData_Array.GuarantorAddress,
    GuarantorPhone: LoanData_Array.GuarantorPhone,
    Vehicle: LoanData_Array.Vehicle,
    Model: LoanData_Array.Model,
    VehicleNo: LoanData_Array.VehicleNo,
    Broker: LoanData_Array.Broker,
    SET: LoanData_Array.SET,
    RC_Amount: LoanData_Array.RC_Amount,
    TA_Amount: LoanData_Array.TA_Amount,
    AreaCode: LoanData_Array.AreaCode,
    Intrest: LoanData_Array.Intrest,
    Month_PayingArray: Monthly_Array,
    Penality_Array: penality_Array,
    ReceiptArray: ReceiptArray,
    RC_Array: RC_Array,
    TA_Array: TA_Array,
    AccountStatus: AccountStatus,
    Balance_Principle: _Balance_principle,
    Balance_Intrest: _Balance_intrest,
  };

  Loan.findOne({ _id: LoanID })
    .then((loan) => {
      if (!loan) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      loan.LoanObject = LoanObject;
      loan.save().then((savedLoan) => {
        res.json({ message: "updated successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.post("/pay-self-receipt", (req, res) => {
  const { LoanID, LoanArray } = req.body;

  Loan.findOne({ _id: LoanID })
    .then((loan) => {
      if (!loan) {
        return res.status(422).json({ error: "Try again session expired" });
      }
      loan.LoanObject = LoanArray;
      loan.save().then((savedLoan) => {
        res.json({ message: "updated successfully" });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;

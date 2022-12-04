const mongoose = require('mongoose');
const loanSchema = new mongoose.Schema({
    LoanObject:Object
});

mongoose.model("loans",loanSchema);

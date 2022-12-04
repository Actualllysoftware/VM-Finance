const mongoose = require("mongoose");
const financebookSchema = new mongoose.Schema({
  BookObject: Object,
});

mongoose.model("financebook", financebookSchema);

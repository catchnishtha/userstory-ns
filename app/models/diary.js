var mongoose = require("mongoose");
var Schema= mongoose.Schema;
var diarySchema = new Schema({
	creator:      {type: Schema.Types.ObjectId,ref:"User"},
	title: String,
	content:      String,
	creatiodDate: {type:Date, default:Date.now },
	modificationDate: {type:Date, default:Date.now }
});
module.exports = mongoose.model("Diary", diarySchema);
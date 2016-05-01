var mongoose=require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var UserSchema = new mongoose.Schema({
	username: {type: String, required: true, index: {unique:true}},
	password: {type: String, required: true, select: false}
});

UserSchema.pre('save', function(next){
	var user = this;
	if(!user.isModified('password')) return next();

	bcrypt.hash(user.password, null, null, function(err, hash){
		if(err) return next(err);
		user.password = hash;
		next();
	});
});

UserSchema.methods.comparePassword= function(password){
	var user=this;
	var compareResult=bcrypt.compareSync(password, user.password);
	return compareResult;
}
module.exports= mongoose.model("User", UserSchema);
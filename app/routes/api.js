var User = require ('../models/user');
var Diary = require('../models/diary')
var config = require ('../../config');
var secretKey= config.secretKey;
var jsonwebtoken=require('jsonwebtoken');

function tokenCreate(user){
	var token = jsonwebtoken.sign({
		id:user._id,
		username:user.username
	},secretKey,{expiresInMinute:1440});
	return  token;
}

module.exports=function(app, express, io){
	var api=express.Router();
	api.post('/signup', function(req,res,next){
		if(!req.body.username || !req.body.password){ console.log("no id/password");
			//var err = new Error();
			//err.status = 422;
			//err.success=false;
			//err.message="no username/password";
			//return res.json(err);
			res.json({
				status:422,
				success: false,
				message: "no username/password"
			});

		} else {
			User.findOne({username:req.body.username}).select('username').exec(function(err, userexist){
				if(err) throw err;
				if(!userexist){
					var user= new User({
							username: req.body.username, 
							password: req.body.password
					});
					user.save(function(error){
							if(error){console.log("error=" + error);
								res.json({
									status:400,
									success: false,
									error: "databse error",
									message: "databse error"
								});
							} else{
								var token=tokenCreate(user);
								console.log("token="+token);
								res.json({
									status:200,
									success: true,
									message: "signed up successfully",
									token: token,
								});
							}
					});
				} else if(userexist){
					console.log("SIGNUP:user exists");
						res.json({
							status: 400,
							success: false,
							message: "user already exists"
						});
				}
			});
		}
	});
	api.get('/users',function(req,res){
		User.find({},function(err,users){
			if(err) {
				res.send(err);
			}
			else{
				res.json(users);
			}
		});
	});
	api.post('/login',function(req,res){
		console.log(req.body.username);
		User.findOne({username:req.body.username}).select('username password').exec(function(err, user){
			if(err) throw err;
			if(!user){
				res.json({
					status:422,
					success: false,
					message: "user you are trying to login doesn't exist"
				});
			} else if(user){
				var validatePassword=user.comparePassword(req.body.password);
				if(!validatePassword){
					res.json({
						status:422,
						success: false,
						message: "invalid password"
					});
				} else {
					var token=tokenCreate(user);
					res.json({
						status:200,
						success: true,
						message: "login successful",
						token: token,
					});
				}
			}
		});

	});

	api.use(function(req,res,next){
		console.log("hi");
		var token=req.body.token || req.params.token || req.headers['x-access-token'];
		if(token){
			jsonwebtoken.verify(token,secretKey, function(err,decoded){
			if(err){
				res.status(403).send({success:false, message:"Failed to authenticate user"});
			}else{
				req.decoded=decoded;
				next();
			}

		});
		} else{
			res.status(403).send({success:false, message:"No Token provided"});
		}
	});
/*	api.use(function(err, req, res, next) { console.log("error="+err.status);
		  if(err.status != 422) {
		   // return next(err);
		   console.log("INSIDE NOT 422 api.use");
		   return res.json(err);
		  }
		 
		  return res.json(err || '** no unicorns here **');
	});*/


	api.route('/diary')
	.put(function(req,res){
		if(req.body._id){
			console.log("api/diary - update _id=" + req.body._id);
			Diary.findOne({_id:req.body._id}).exec(function(err, diary){
				if(err) throw err;
				if(!diary){
					res.send({message: "diary you are trying to update doesn't exist"});
				} else if(diary){
					diary.title=(req.body.title),
					diary.content=req.body.content,
					diary.modificationDate=new Date();
					console.log("new date="+diary.modificationDate);
					diary.save(function(err, updatedDiary){
						if(err){
							res.send(err);
							return;
						}
						console.log("PUT diary updated");
						io.emit('diaryput', updatedDiary);
						res.json({message:"diary updated!"});
					});
				}
			});
		} else{
			res.json({message:"No ID to PUT!"});
		}
	})
	.post(function(req,res){
			var diary = new Diary({
				creator:req.decoded.id,
				title:req.body.title,
				content:req.body.content,
			});
			diary.save(function(err, newDiary){
				if(err){
					console.log("create diary database err= "+err)
					res.send(err);
					return;
				}
				io.emit('diaryio', newDiary);
				res.json({message:"new diary created!"});
			});
	})
	.get(function(req,res){ console.log("get with no param");
		Diary.find({creator:req.decoded.id},function(err,diaryentries){
			if(err){
				res.send(err);
			}
			else if(diaryentries){
				res.json(diaryentries);
			}
		})
	});
	api.route('/diary/:id').delete(function(req,res){ console.log("req.params.id="+req.params.id);
			Diary.findByIdAndRemove(
			      req.params.id,
			      function (err, diary) {  console.log("DELETE ERROR!!!!");
			        if(err){
			          console.log(err);
			          res.json({
							status: 422,
							success: false,
							error: "database error on delete entry.",
							message: "database error on delete entry."
						});
			          return;
			        }
			        console.log("diary deleted:", diary);
			        /*io.emit('diarydel', diary);*/
			        res.json({
							status:200,
							success: true,
							message: "diary entry deleted."
						});
			      }
			    );

	});
api.get("/getuser",function(req,res){
	res.send(req.decoded); 
});
	return api;
}
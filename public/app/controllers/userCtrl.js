angular.module('userCtrl', ["userService"])

.controller("UserController", function(User){

	var vm = this;
	vm.error="";
	User.all()
		.success(function(data){console.log("User.all");
			vm.users=data;
		})
})

.controller("UserCreateController", function(User, $location, $window){

	var vm = this;
	vm.signupUser = function(valid){
		if(!valid){
			vm.error="Please enter valid details";
		} else{
			vm.message="";
			User.create(vm.userData)
				.then(function(response){ console.log("response.data.status= "+response.data.status);
					console.log("response.data.message= "+response.data.message);
					console.log("response.status= "+response.status);
					if(response.data.success == true){
						vm.userData={};
						vm.error="";
						vm.message=response.data.message;
						$window.localStorage.setItem("token", response.data.token);
						//$location.path("/diaryorlist");
						window.location = '/diary';
					}else{
						console.log("signup error");
						vm.error=response.data.message;
					} 
					}, function(error){
						console.log("error= "+error);
						vm.error=error;
					}
				)
		}
	}
	vm.moveLabel = function(){console.log('focus');
		$(this).prev().addClass("has-focus");
	}
	vm.backLabel = function(){ alert("removed focus");
		$(this).prev().removeClass("has-focus");
	}
	

})
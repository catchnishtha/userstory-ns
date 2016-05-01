angular.module('mainCtrl',[])
.controller('MainController', function($rootScope, $location, Auth, $window){
	var vm = this;
	/*$window.localStorage.setItem("token", "");*/
	vm.loggedIn = Auth.isLoggedIn();
	vm.selectedId="";
	vm.sortorder="title";
	$rootScope.$on("$routeChangeStart", function(){
		vm.loggedIn=Auth.isLoggedIn();
		console.log("routeChangeStart");
		Auth.getUser()
		.then(function(data){ 
			vm.user=data.data; //test error handling data or data.data what if message is sent on error?
			console.log("vm.user="+vm.user.username);
		});
	});
//viewContentLoaded


	vm.doLogin= function(valid){
		vm.error="";
		if(!valid){
			vm.error="Please enter valid details";
		} else{
			vm.processing = true;
			console.log("vm.loginData.username="+vm.loginData.username);
			Auth.login(vm.loginData.username,vm.loginData.password)
			.success(function(data){ 
				vm.processing = false;
				if(data.success){
					console.log("success - message="+data.message);
					window.location = '/diary';
				//	$location.path("/diaryorlist");
					/*vm.loggedIn =true;*/
				}
				else
					vm.error=data.message;
			});
		}
	}

	vm.doLogout= function(){
		Auth.logout();
		$location.path('/');
	}
});
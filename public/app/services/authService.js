angular.module('authService',[])
.factory('Auth', function($http, $q, AuthToken){
	var authFactory={};
	authFactory.login= function(username,password){
		console.log("username="+username);
		console.log("username="+password);
		return $http.post("/api/login",{
			username:username,
			password:password
		}).success(function(data){console.log("authservice-success "+data.message);
			AuthToken.setToken(data.token);
			return data;
		});
	}	
	authFactory.logout= function(){
		AuthToken.setToken("");
		console.log("authservice - logout");
		window.location = '/';
		/*$location.path('/');*/
	}
	authFactory.isLoggedIn = function(){
		var istoken = AuthToken.getToken();
		if(istoken) 
			return true;
		else 
			return false;
	}
	authFactory.getUser= function(){
		if(AuthToken.getToken()){
			return $http.get('/api/getuser');
		} else 
			return $q.reject({message: "user has no token"});
	}
	return authFactory;
})

.factory("AuthToken", function($window){
	var authvar = {};
	authvar.getToken= function(){
		return $window.localStorage.getItem('token');
	}
	authvar.setToken= function(token){
		if(token)
			$window.localStorage.setItem('token',token);
		else
			$window.localStorage.removeItem('token');
	}
	return authvar;
})

.factory('AuthInterceptor', function($q, $location, AuthToken){
	var interceptorFactory={};
	interceptorFactory.request= function(config){
		var token =AuthToken.getToken();
		if(token){
			config.headers['x-access-token'] = token;
		}
		return config;
	}
	interceptorFactory.responseError = function(response){
		if(response.status == 403){
			$location.path('/');
			return $q.reject(response);
		}
	}
	return interceptorFactory;
});
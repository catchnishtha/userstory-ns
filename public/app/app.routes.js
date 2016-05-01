angular.module('appRoutes',['ngRoute', 'door3.css'])
.config(function($routeProvider, $locationProvider){

	$routeProvider
		.when('/', {
			templateUrl: 'app/views/pages/home.html',
			css: 'app/secret.css'
		})
		.when('/diaryorlist', {
			templateUrl: 'app/views/pages/diaryorlist.html',
			css: 'app/secret.css'
		})
		.when('/diary', {
			templateUrl: 'app/views/pages/diary.html',
			css: 'app/secret_mng.css'
		})
		.when('/lists', {
			templateUrl: 'app/views/pages/lists.html',
			css: 'app/secret.css'
		})
		/*.when(*, {
			templateUrl: 'app/views/pages/lists.html',
			css: 'app/secret.css'
		})*/
	$locationProvider.html5Mode(true);
})
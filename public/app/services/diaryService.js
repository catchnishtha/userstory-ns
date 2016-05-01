angular.module("diaryService",[])

.factory("Diary",function($http){
	var diaryFactory = {};
	diaryFactory.createDiary=function(diaryData){
		return $http.post("/api/diary",diaryData);
	}
	diaryFactory.updateDiary =function(diaryData){
		return $http.put("/api/diary",diaryData);
	}
	diaryFactory.allDiary = function(){
		return $http.get("/api/diary");
	}
	diaryFactory.deleteentryDiary = function(id){
		return $http.delete("/api/diary/" + id);
	}
	return diaryFactory;
})
.factory('socketio', function($rootScope){
	var socket =io.connect();
	return{
		on: function(eventName, callback){
			socket.on(eventName, function(){
				var args=arguments;
				$rootScope.$apply(function(){
					callback.apply(socket,args);
				});
			});
		},
		emit:function(eventName,data,callback){
			socket.emit(eventName,data,function(){
				var args=arguments;
				$rootScope.apply(function(){
					if(callback){
						callback.apply(socket,args);
					}
				});
			});
		}
	}
});
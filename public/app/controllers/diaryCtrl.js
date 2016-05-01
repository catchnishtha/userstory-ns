angular.module("diaryCtrl", ["diaryService"])

	.controller("diaryController", function($scope,Diary, socketio, $window, $timeout, filterFilter){
		
		var vm = this;
		vm.sortorder="modificationDate";
		vm.diaryData={};
		vm.diaries=[];
		vm.message="";
		vm.bool=false;
		vm.err="";
		vm.searchTerm='';
		vm.pageCount=0;
		$scope.filtered={};
		vm.aaa={};

		vm.itemsPerPage = 5;
  		vm.currentPage = 0;
		

		Diary.allDiary()
			.success(function(data){	
				vm.diaries = data;
				vm.pageCount=Math.ceil(vm.diaries.length/vm.itemsPerPage)-1;
				vm.searchTerm=''; console.log("SUCCESS: vm.diaries="+ vm.diaries);
				//vm.range();
				//vm.noOfPages = Math.ceil(vm.diaries.length / vm.numPerPage);
			});

			vm.range = function(end) { console.log("START range() end="+end+" currentPage= "+vm.currentPage);
				    var rangeSize = 5;
				    var ret = [];
				    var start;
				    start = vm.currentPage;
				    end1=parseInt(end);
				    vm.pageCount=Math.ceil(end1/vm.itemsPerPage)-1;//console.log("range() vm.pageCount="+vm.pageCount);
				    if(vm.pageCount<rangeSize){ //console.log("yes! vm.pageCount="+vm.pageCount)
				    	for (var i=0; i<=vm.pageCount; i++) {
					      ret.push(i);
					    }
				    } else{ //console.log("NO! vm.pageCount="+vm.pageCount)
					    if ( start > vm.pageCount-rangeSize ) {
					      start = vm.pageCount-rangeSize+1;
					    }

					    for (var i=start; i<start+rangeSize; i++) {
					      ret.push(i);
					    }
					}
				    return ret;
		  };
					  vm.prevPage = function() {
					    if (vm.currentPage > 0) {
					      vm.currentPage--;
					    }
					  };

					  vm.prevPageDisabled = function() {
					    return vm.currentPage === 0 ? "disabled" : "";
					  };

					  /*vm.pageCount = function() {
					    return Math.ceil(vm.diaries.length/vm.itemsPerPage)-1;
					  };*/

					  vm.nextPage = function() {  console.log("inside nextPage pageCount="+vm.pageCount);
					    if (vm.currentPage < vm.pageCount) {
					      vm.currentPage++; console.log("pageCount="+vm.pageCount);
					    }
					  };

					  vm.nextPageDisabled = function() {
					    return vm.currentPage === vm.pageCount ? "disabled" : "";
					  };

					  vm.setPage = function(n) {
					    vm.currentPage = n;
					  };
					
		/*vm.$watch( 'currentPage', vm.setPage );*/
					$scope.$watch(function () {
                        // Return the "result" of the watch expression.
                        return( vm.searchTerm );
                    }, function (newVal, oldVal) { 
							//vm.filtered = $scope.filtered.length;
							vm.aaa = filterFilter(vm.diaries, vm.filterOnTitleContent);
							console.log("inside WATCH $scope.filtered.length ="+vm.aaa.length );
							console.log(vm.aaa);
							if(vm.aaa){
								console.log("!!!!!!!!!="+ vm.aaa.length +"newVal="+newVal);
							//	vm.pageCount = Math.ceil($scope.filtered.length/ vm.itemsPerPage) - 1;
								vm.range(vm.aaa.length);
							} else {
							//	vm.pageCount =0;
							}
							vm.currentPage=0;
							
						}, true);

		vm.createUpdateDiary = function(){ console.log("createUpdateDiary called");
			vm.message="";
			vm.bool=false;
			vm.error="";
			console.log("vm.diaryData= "+vm.diaryData);
			console.log("vm.diaryData._id= "+vm.diaryData._id);
			if(!vm.diaryData.title){
				vm.error="please enter a title!"
			} else{ vm.error="";
				vm.message = "";
				vm.bool=false;
				if(vm.diaryData._id){
					Diary.updateDiary(vm.diaryData)
						.success(function(data){ console.log("message= "+data.message);
							//vm.diaryData={};
							vm.message = data.message;
							vm.bool = true;
							$timeout(function() {
					         	vm.bool = false;
					         	//vm.message="";
					         	console.log("inside bool false");
					         	/*$timeout(function() {
					         		vm.message = "";
					       		}, 3000);*/
					        }, 2000);
					});

				} else {
					Diary.createDiary(vm.diaryData)
						.success(function(data){ console.log("new message = "+data.message);
							//vm.diaryData={};
							vm.message = data.message;
							vm.bool = true;
							$timeout(function() {
					         	vm.bool = false;
					         	vm.message="";
					         	console.log("inside bool false");
					         	/*$timeout(function() {
					         		vm.message = "";
					       		}, 3000);*/
					        }, 2000);
					});
				}
			}
		}
		socketio.on('diaryio', function(data){
			vm.diaries.push(data);console.log("socketio");
			vm.diaryData._id=data._id;
			vm.pageCount=Math.ceil(vm.diaries.length/vm.itemsPerPage)-1;
			//vm.noOfPages = Math.ceil(vm.diaries.length / vm.numPerPage);
			console.log("createdId= "+data._id);
		});
		socketio.on('diaryput', function(data){console.log("push called data=" + data);
			//vm.diaries.splice(vm.diaries.indexOf(diaryDataata),1);
			//vm.diaries[vm.diaries.indexOf(data._id)]=data;
			var i=0;
			for(i=0;i<vm.diaries.length;++i) { console.log("inside");
              var diaryObj = vm.diaries[i];
              if ( diaryObj._id === data._id) {
              	console.log("ID FOUND AND UPDATED!!!!");
                  vm.diaries[i]=data;
                  break;
              }
          }

		});

		vm.filterOnTitleContent = function(diary) { console.log("filterOnTitleContent searchTerm"+vm.searchTerm);
			if(diary.title!=null){ 
				if(vm.searchTerm!=null){
					if(diary.content!=null){ 
			    		return diary.content.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) != -1 || diary.title.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) != -1;
					} else{
						return diary.title.toLowerCase().indexOf(vm.searchTerm.toLowerCase()) != -1 
					}
				}
				return true;
			}
				return true;
		}

		vm.newDiary=function(){
			vm.message="";
			vm.bool=false;
			vm.error="";
			vm.diaryData={};
		}
		vm.setcurrentDiary= function(toset){ 
			vm.message="";
			vm.bool=false;
			vm.error="";   
			console.log("setcurrentDiary called");      
		    vm.diaryData = toset;
		}
		vm.deleteDiaryEntry=function(todelete, beingedited){ console.log("deleteDiaryEntry called todelete_id = " + todelete._id);  
			vm.message = "";
			vm.bool=false;
			vm.error="";
			Diary.deleteentryDiary(todelete._id)
				.success(function(data){ 
					if(data.success == true){
						//console.log("controller - on success indexOf= "+ vm.diaries.indexOf(todelete));
						vm.diaries.splice(vm.diaries.indexOf(todelete),1);
						vm.pageCount=Math.ceil(vm.diaries.length/vm.itemsPerPage)-1;
						vm.message = data.message;
						vm.bool = true;
						$timeout(function() {
				         	vm.bool = false;
				         	vm.message="";
				         	console.log("delete inside bool false");
				         	/*$timeout(function() {
				         		vm.message = "";
				       		}, 3000);*/
				        }, 2000);
				        if (vm.currentPage > vm.pageCount) {
						      vm.currentPage--; console.log("p1ageCount="+vm.pageCount);
						    }
						//vm.noOfPages = Math.ceil(vm.diaries.length / vm.numPerPage);
						if(beingedited=='true' || todelete._id == vm.diaryData._id ){
							console.log("vm.diaryData_id = "+ vm.diaryData._id+" beingedited= "+beingedited + " todelete._id= "+todelete._id)
							vm.diaryData={};
						}
					}  else {
						vm.error = data.error;
						vm.err = true;
						$timeout(function() {
				         	vm.error = false;
				         	vm.error="";
				         	console.log("inside error false");
				         	/*$timeout(function() {
				         		vm.message = "";
				       		}, 3000);*/
				        }, 2000);
					}
					
				})
				.error(function(error){
					console.log(error);
				})
	}
})
var app = angular.module('main',[]);

app.controller('AppCtrl',['$scope', '$http', function($scope, $http){
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    $scope.searches = [];
    $scope.userInput = "";
    $scope.getBib = function(){
        for(i=0; i<$scope.searches.length; i++){
            if($scope.searches[i].status==="failed"){
                $scope.searches.splice(i,1);
                console.log("failed");
            }
        }
        $scope.newSearch = {
            title:'Loading...',
            bibliography:'',
            status:'pending'
        }
        $scope.searches.unshift($scope.newSearch);

        if($scope.userInput.indexOf("wikipedia.org/wiki/")>-1){
            //get input title parameter
            $scope.inputTitle = $scope.userInput.substring($scope.userInput.lastIndexOf("/")+1);
            //percentage encoding
            console.log($scope.pageTitle);
            $scope.pageTitle = $scope.inputTitle.replace(new RegExp('_', 'g'), '%20');
            $scope.APIUrl = "https://en.wikipedia.org/w/api.php?action=query&titles="+$scope.pageTitle+"&prop=revisions&rvprop=timestamp&format=json";

            $http.get($scope.APIUrl)
                .success(function(data){
                    console.log(data);
                    $scope.retrivedData = data.query.pages;
                    if($scope.retrivedData.hasOwnProperty("-1")){
                        $scope.searches[0].title="404: Page not found.";
                        $scope.searches[0].status="failed"
                    }
                    else{
                        $scope.retrivedDataIndex = Object.keys($scope.retrivedData);
                        if($scope.retrivedDataIndex.length === 1){
                            $scope.title = $scope.retrivedData[$scope.retrivedDataIndex[0]].title;

                            $scope.lastEditTimestampISO = new Date  ($scope.retrivedData[$scope.retrivedDataIndex[0]].revisions[0].timestamp);

                            $scope.lastEditTimestamp = $scope.lastEditTimestampISO.getDate()+" "+monthNames[$scope.lastEditTimestampISO.getMonth()]+" "+$scope.lastEditTimestampISO.getFullYear();

                            $scope.retriveTimestampISO = new Date();
                            $scope.retriveTimestamp = $scope.retriveTimestampISO.getDate()+" "+monthNames[$scope.retriveTimestampISO.getMonth()]+" "+$scope.retriveTimestampISO.getFullYear();

                            $scope.bibliography = '"'+$scope.title+'." Wikipedia: The Free Encyclopedia. Wikimedia Foundation, Inc.  '+$scope.lastEditTimestamp+'. Web. '+$scope.retriveTimestamp;
                            if($scope.includeUrl===true){
                                $scope.bibliography = $scope.bibliography+' <'+$scope.userInput+'>'
                            }
                            $scope.newSearch = {
                                title:$scope.title,
                                bibliography:$scope.bibliography
                            }
                            $scope.searches[0]=$scope.newSearch;
                            $scope.searches[0].status="success";
                        }
                        else{
                            console.log($scope.retrivedData);
                        }
                        document.getElementById("userInput").select();
                    }


                })
                .error(function(){
                    $scope.searches[0].title="Unable to reach to API. Check your internet connection.";
                    ;
                    $scope.searches[0].status = "failed";
                });

        }
        else{
            if($scope.userInput===""){
                $scope.searches[0].status="failed";
            }
            else{
                $scope.bibliography = "That doesn't look like a wikipedia URL";
                $scope.searches[0].title=$scope.bibliography;
                $scope.searches[0].status = "failed";
                document.getElementById("userInput").select();
            }
        }
    }

    $scope.copyToClipBoard = function(){
        element.select();
        document.execcommand('copy');
        alert("copied");
    };

    $scope.remove = function(index){
        $scope.searches.splice(index, 1);
    };
}]);

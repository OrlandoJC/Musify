var likes = (function(storageController){
    //get like element node

    var test = function(){
        console.log(storageController.test())
    }

    var handleLike = function (){
        console.log("like button has been clicked!");
    }

    
    return {
        test : test
    }
})(storage);



var storage = (function(){
    var getLocalStorage = function(){
        console.log("getting local storage");
    }

    var setLocalStorage = function(){
        console.log("setting local storgae")
    }

    var test = function(){
        console.log("local storage module works!");
    }

    return {
        getLocalStorage : getLocalStorage,
        setLocalStorage : setLocalStorage,
        test            : test
    }
})();
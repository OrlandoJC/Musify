var modal = (function(){
    var modal   =   document.createElement('div');
    var body    =   document.querySelector('body');
    var x       =   document.createElement('span');
    var textX   =   document.createTextNode('x');
    var edit    =   document.createElement('button');

    var createModal = function(){
        modal.classList.add('modalElement');
        modal.classList.add('hideModal');
        body.appendChild(modal);
    }

    var fillModal = function(text){
        modal.innerHTML = text;
        edit.value = "edita";
        x.appendChild(textX);         
        modal.appendChild(x);
    }

    var launchModalFrom = function(){
        modal.classList.remove('hideModal');
        modal.classList.add('showModal');
    };

    var closeModal = function(){
        modal.classList.remove('showModal');
        modal.classList.add('hideModal');
    }


    //!beta content editablee
    // modal.addEventListener('click', function(e){
    //     // console.log(e);
    //     console.log(e.target.textContent);
    //     e.target.setAttribute('contenteditable', '');
    //     localStorage.setItem('song', e.target.textContent);
    // })


    x.addEventListener('click', function(){
        closeModal();
    });

    
    return {
        createModal     : createModal,
        launchModalFrom : launchModalFrom,
        closeModal      : closeModal,
        modal           : modal,
        fillModal       : fillModal
    }
})();
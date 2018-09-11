/*
.##.....##.##.....##..######..####.########.##....##
.###...###.##.....##.##....##..##..##........##..##.
.####.####.##.....##.##........##..##.........####..
.##.###.##.##.....##..######...##..######......##...
.##.....##.##.....##.......##..##..##..........##...
.##.....##.##.....##.##....##..##..##..........##...
.##.....##..#######...######..####.##..........##...
*/


/** **********************************************
 * Autor : orlando de jesus 
 * Date : april 10th
*************************************************/


var player = (function(likesController, modal, alertify){
    var pre             = document.getElementById('pre'),
        play            = document.getElementById('play'),
        next            = document.getElementById('next'),
        musicListTable  = document.getElementById('musicListTable'),
        musicDetails    = document.getElementById('song'),
        title           = document.getElementById('song__title'),
        subtitle        = document.getElementById('song_subtitle'),
        songCover       = document.getElementById('song__cover'),
        songDescription = document.getElementById('song__description'),
        songDuration    = document.getElementById('song__duration'),
        point           = document.getElementById('point'),
        spinner         = document.getElementById('spinner'),
        lirycs          = document.getElementById('lirycs__button'),
        progressTime    = document.getElementById('progress_time'),
        timeDuration    = document.getElementById('time_duration'),
        buttonShuffle   = document.getElementById('shuffle__button'),
        buttonRepeat    = document.getElementById('repeat__button'),
        rangeVolume     = document.getElementById('range__sound');      
        
    
    var songs;
    var currentSong;
    var song = new Audio();
    var isShuffle = false;
    var isRepeat = false    ;
    
    /**
     * @param {id of the current selected song} id 
     * description : handles each of item list
     */
    var selectSong = function (id){
        currentSong = id;
        title.textContent           = songs[id]["name"];
        subtitle.textContent        = songs[id]["artist"];
        songDescription.textContent = songs[id]["album"];
        songDuration.textContent    = songs[id]["time"];
        timeDuration.textContent    = songs[id]["time"];
        songCover.setAttribute("src", songs[id]["cover"]);
        
       
        song.src = songs[id]["href"];
        song.play();
        //creates modal and fills it with the current liryc
        modal.createModal();
        modal.fillModal(songs[id]["lirycs"]);
    }

    /********************** 
     * Handles play button 
    ***********************/
    var handlePlay = function(){
        if( song.paused ) {
            song.play();
            play.setAttribute("src", "img/pause.svg");
        } else {
            song.pause();
            play.setAttribute("src", "img/play.svg");
        }
    }

    /***********************
     * handles next button 
    ************************/
    var handleNext = function(){
        if( currentSong > songs.length - 2 ) {
            selectSong( 0 );
            currentSong = 0;
        }else {
            currentSong += 1;           
            selectSong( Number( currentSong ) );
        }
    }

    /***********************
     * handdles prev button 
    ************************/
    var handlePrev = function(){
        currentSong -= 1;                 
        
        if( currentSong < 0 ) {
            selectSong( 0 );
            currentSong = 0;
        }else {
            currentSong -= 1;         
            selectSong( Number( currentSong ) );
        }
    }

    var handleRepeat = function(){
        if(isRepeat){
            isRepeat = false;
            this.classList.remove('active--button');
        }else{
            isRepeat = true;
            this.classList.add('active--button');
            alertify.notify('Repeticion activada', 'success', 3, function(){  console.log('Repeticion activada'); });                        
        }
    }

    var handleShuffle  = function (){
        if(isShuffle){
            isShuffle = false;
            this.classList.remove('active--button');
        }else{
            isShuffle = true;
            this.classList.add('active--button');
            console.log(" encendiendoo shuffle");
            alertify.notify('el modo aleatorio se ha activado', 'success', 3, function(){  console.log('Repeticion activada'); });    
        }
    }

    var handleVolume = function(){
        song.volume = this.value / 100;
    }

    /************************************
     * handdles current's audio durationn 
    *************************************/
    var handleDuration = function(){
        var minutes = Math.floor(song.currentTime / 60),
            seconds = Math.floor(song.currentTime - minutes * 60),
            x       = minutes < 10 ? "0" + minutes : minutes,
            y       = seconds < 10 ? "0" + seconds : seconds;

        point.style.width = Number(this.currentTime / this.duration * 100) + "%";
        progressTime.textContent = x + ':' + y;
    }

    /************************************
     * handles when audio is ending
    *************************************/
    var handleFinish = function(){
        if (isRepeat){
            selectSong(currentSong);
        } else {
            handleNext();                           
        }
    }

    var handleModal = function(){
        if(modal.modal.hasAttribute("class", "hideModal")){
            modal.launchModalFrom(); 
        }else{
            modal.closeModal();
        }
    }

    function randomId(){
        var min = 0,
            max = songs.length - 1;
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function isPlaying(audelem) { return !audelem.paused; }
    /************************************
     * render list
    *************************************/
    var renderList = function(songs){
        var fragment = document.createDocumentFragment();

        songs.forEach(function(song){
            var row = document.createElement('tr');
            var songObject = {
                _id    : song["id"],
                _image : song["cover"],
                _artist : song["artist"],
                _name  : song["name"],
                _album : song["album"],
                _time  : song["time"]
            };

            row.setAttribute('id',song.id);
            
            for(var detail in songObject){
                var td = document.createElement('td');
            
                if(detail == "_image") {
                    var image = document.createElement("img");
                    image.setAttribute("src", songObject[detail]);
                    image.setAttribute("width", "15%");
                    td.appendChild( image );   
                }else{
                    var text = document.createTextNode( songObject[detail] );
                    td.appendChild(text);   
                }
                                    
                row.appendChild(td);
            }  
            fragment.appendChild(row);
        });
    
        musicListTable.appendChild(fragment);

        musicListTable.addEventListener('click', function(e){
            
            if(song){
                musicDetails.setAttribute("class", "see");
                selectSong( e.target.parentNode.id );
                currentSong = e.target.parentNode.id;
                play.setAttribute("src", "img/pause.svg");            
            }else if ( isPlaying( song )) { // if song is current execting stop previous and play the newest
                song.pause();
                song.currentTime = 0;
            }
        })
        
    }
    
    /************************************
     * get songs from folder 'songs/song.mp3'
    *************************************/
    var getSongs = function(){
        getJSON('https://raw.githubusercontent.com/OrlandoJC/Musify/776dc90f915fc3a1808c735cb9bf9cc1a8f7010c/data/songs.json', function(response){
            renderList( response );
            songs = response;
        });
    }
    
    /************************************
     * xmlHtppRequest from local json array
    *************************************/
    function getJSON(url, callback){
        var request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
                console.log("eliminado");
                var data = JSON.parse(request.responseText);
                callback(data);
            }
        };

        request.onerror = function() {
        // There was a connection error of some sort
            console.error("there was an error")
        };

        request.send();
    }
    
    /************************************
     * public
    *************************************/
    return {
        init : function(){
            getSongs();
            play.addEventListener('click', handlePlay);
            next.addEventListener('click', handleNext);
            pre.addEventListener('click', handlePrev);
            song.addEventListener('ended', handleFinish);
            song.addEventListener('timeupdate', handleDuration);
            lirycs.addEventListener('click', handleModal);  
            buttonShuffle.addEventListener('click', handleShuffle);
            buttonRepeat.addEventListener('click', handleRepeat);
            rangeVolume.addEventListener('change', handleVolume);
        }
    }
})(likes, modal,alertify);

DomReady.ready(function() { 
    player.init();
});

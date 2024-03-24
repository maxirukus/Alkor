

const RADIO_NAME = 'Only Romantic';

// SELECT ARTWORK PROVIDER, ITUNES, DEEZER &amp; SPOTIFY  eg : spotify 
var API_SERVICE = 'spotify ';

// Change Stream URL Here, Supports, ICECAST, ZENO, SHOUTCAST, RADIOJAR and any other stream service.
const URL_STREAMING = 'http://stream.laut.fm/only-romantic-radio';



function $_get(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, Value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}
function getItunesUrl(artist,song) {
    return "https://itunes.apple.com/search?media=music&amp;term=" + encodeURIComponent(artist) + "+" + encodeURIComponent(song) + "&entity=album&entity=musicArtist&entity=musicTrack&limit=1";
}

function getImageUrl(url, width, height) {
    let imageUrl = url.substring(0, url.lastIndexOf('/')) + '/' + width + "x" + height + ".jpg";
    return imageUrl.replace(/^(http):\/\//gi, "https://")
}

function getLiveStatus(json_song) {
    if (json_song['live']) {
        if (live != json_song['live'].toString()) {
            if (json_song['live'] == true) {
                $('#live p i').removeClass('notLive').addClass('blink-2');
                $('#live p span').html('On Air');
            } else {
                $('#live p i').removeClass('blink-2').addClass('notLive');
                $('#live p span').html('Off Air');

            }
        }
    } else {
        if (live != false) {
            $('#live p i').removeClass('blink-2').addClass('notLive');
            $('#live p span').html('Off Air');
        }
    }
}

function coverLoop(song_url, station_img) {
    setTimeout(function () {

        getCover(song_url, station_img);
        coverLoop(song_url, station_img);
    }, 2000)
}

function getCover(song_url, station_img) {
    $.getJSON(song_url, function (current) {
        getLiveStatus(current);
        if (song_str != (current.title + " " + current.artist.name))  {
            song_str = current.title + " " + current.artist.name
            $.getJSON(getItunesUrl(current.title, current.artist.name), function (song) {
                let img_url;
                if (song.resultCount === 0) {
                 ;
                    if (song.resultCount === 0) {
                        img_url = station_img;
                    } else {
                        img_url = getImageUrl(song.results[0].artworkUrl100, width, height);
                    }
                } else {
                    img_url = getImageUrl(song.results[0].artworkUrl100, width, height);
                }
                $("#image").attr("src", img_url).attr("alt", current.title + ", " + current.artist.name).attr("width", width).attr("height", height)
                $("#image2").attr("src", img_url).attr("alt", current.title + ", " + current.artist.name).attr("width", width).attr("height", height)
                
            })
        }
    })
}





    
// Player control
const URL_STREAMING = 'http://stream.laut.fm/only-romantic-radio';

var audio = new Audio(URL_STREAMING);

function Player() {
    this.play = function () {
        audio.play();

        var defaultVolume = document.getElementById('volume').Value;

        if (typeof (Storage) !== 'undefined') {
            if (localStorage.getItem('volume') !== null) {
                audio.volume = intToDecimal(localStorage.getItem('volume'));
            } else {
                audio.volume = intToDecimal(defaultVolume);
            }
        } else {
            audio.volume = intToDecimal(defaultVolume);
        }
        document.getElementById('volIndicator').innerHTML = defaultVolume;
    };

    this.pause = function () {
        audio.pause();
    };
}

// On play, change the button to pause
audio.onplay = function () {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    if (botao.classname === 'fa fa-play') {
        botao.className = 'fa fa-pause';
        bplay.firstChild.data = 'PAUSE';
    }
}

// On pause, change the button to play
audio.onpause = function () {
    var botao = document.getElementById('playerButton');
    var bplay = document.getElementById('buttonPlay');
    if (botao.className === 'fa fa-pause') {
        botao.className = 'fa fa-play';
        bplay.firstChild.data = 'PLAY';
    }
}

// Unmute when volume changed
audio.onvolumechange = function () {
    if (audio.volume > 0) {
        audio.muted = false;
    }
}

audio.onerror = function () {
    var confirmacao = confirm('Stream Down / Network Error. \nClick OK to try again.');

    if (confirmacao) {
        window.location.reload();
    }
}

document.getElementById('volume').oninput = function () {
    audio.volume = intToDecimal(this.value);

    var page = new Page();
    page.changeVolumeIndicator(this.value);
}

function togglePlay() {
    if (!audio.paused) {
        audio.pause();
    } else {
        audio.load();
        audio.play();
    }
}

function volumeUp() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0 && audio.volume < 1) {
            audio.volume = (vol + .01).toFixed(2);
        }
    }
}

function volumeDown() {
    var vol = audio.volume;
    if(audio) {
        if(audio.volume >= 0.01 && audio.volume <= 1) {
            audio.volume = (vol - .01).toFixed(2);
        }
    }
}

function mute() {
    if (!audio.muted) {
        document.getElementById('volIndicator').innerHTML = 0;
        document.getElementById('volume').value = 0;
        audio.volume = 0;
        audio.muted = true;
    } else {
        var localVolume = localStorage.getItem('volume');
        document.getElementById('volIndicator').innerHTML = localVolume;
        document.getElementById('volume').value = localVolume;
        audio.volume = intToDecimal(localVolume);
        audio.muted = false;
    }
}

function getStreamingData() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            if (this.response.length === 0) {
                console.log('%cdebug', 'font-size: 22px');
            }

            var data = JSON.parse(this.responseText);
            console.log('Received data:', data); // Add this line for debugging

            var page = new Page();

            // Formating characters to UTF-8
            let song = data.song ? data.song.replace(/&apos;/g, '\'') : '';
            let artist = data.artist ? data.artist.replace(/&apos;/g, '\'') : '';

            // Change the title
            document.title = song + ' - ' + artist + ' | ' + RADIO_NAME;

            if (document.getElementById('currentSong').innerHTML !== song) {
                page.refreshCover(song, artist);
                page.refreshCurrentSong(song, artist);
                page.refreshLyric(song, artist);

                for (var i = 0; i < 2; i++) {
                    page.refreshHistoric(data.history[i], i);
                }
            }
        }
    };

    var d = new Date();

 
}

// Player control by keys
document.addEventListener('keydown', function (k) {
    var k = k || window.event;
    var key = k.keyCode || k.which;
    
    var slideVolume = document.getElementById('volume');

    var page = new Page();

    switch (key) {
        // Arrow up
        case 38:
            volumeUp();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Arrow down
        case 40:
            volumeDown();
            slideVolume.value = decimalToInt(audio.volume);
            page.changeVolumeIndicator(decimalToInt(audio.volume));
            break;
        // Spacebar
        case 32:
            togglePlay();
            break;
        // P
        case 80:
            togglePlay();
            break;
        // M
        case 77:
            mute();
            break;
        // 0
        case 48:
            audio.volume = 0;
            slideVolume.value = 0;
            page.changeVolumeIndicator(0);
            break;
        // 0 numeric keyboard
        case 96:
            audio.volume = 0;
            slideVolume.value = 0;
            page.changeVolumeIndicator(0);
            break;
        // 1
        case 49:
            audio.volume = .1;
            slideVolume.value = 10;
            page.changeVolumeIndicator(10);
            break;
        // 1 numeric key
        case 97:
            audio.volume = .1;
            slideVolume.value = 10;
            page.changeVolumeIndicator(10);
            break;
        // 2
        case 50:
            audio.volume = .2;
            slideVolume.value = 20;
            page.changeVolumeIndicator(20);
            break;
        // 2 numeric key
        case 98:
            audio.volume = .2;
            slideVolume.value = 20;
            page.changeVolumeIndicator(20);
            break;
        // 3
        case 51:
            audio.volume = .3;
            slideVolume.value = 30;
            page.changeVolumeIndicator(30);
            break;
        // 3 numeric key
        case 99:
            audio.volume = .3;
            slideVolume.value = 30;
            page.changeVolumeIndicator(30);
            break;
        // 4
        case 52:
            audio.volume = .4;
            slideVolume.value = 40;
            page.changeVolumeIndicator(40);
            break;
        // 4 numeric key
        case 100:
            audio.volume = .4;
            slideVolume.value = 40;
            page.changeVolumeIndicator(40);
            break;
        // 5
        case 53:
            audio.volume = .5;
            slideVolume.value = 50;
            page.changeVolumeIndicator(50);
            break;
        // 5 numeric key
        case 101:
            audio.volume = .5;
            slideVolume.value = 50;
            page.changeVolumeIndicator(50);
            break;
        // 6 
        case 54:
            audio.volume = .6;
            slideVolume.value = 60;
            page.changeVolumeIndicator(60);
            break;
        // 6 numeric key
        case 102:
            audio.volume = .6;
            slideVolume.value = 60;
            page.changeVolumeIndicator(60);
            break;
        // 7
        case 55:
            audio.volume = .7;
            slideVolume.value = 70;
            page.changeVolumeIndicator(70);
            break;
        // 7 numeric key
        case 103:
            audio.volume = .7;
            slideVolume.value = 70;
            page.changeVolumeIndicator(70);
            break;
        // 8
        case 56:
            audio.volume = .8;
            slideVolume.value = 80;
            page.changeVolumeIndicator(80);
            break;
        // 8 numeric key
        case 104:
            audio.volume = .8;
            slideVolume.value = 80;
            page.changeVolumeIndicator(80);
            break;
        // 9
        case 57:
            audio.volume = .9;
            slideVolume.Value = 90;
            page.changeVolumeIndicator(90);
            break;
        // 9 numeric key
        case 105:
            audio.volume = .9;
            slideVolume.Value = 90;
            page.changeVolumeIndicator(90);
            break;
    }
});

function intToDecimal(vol) {
    return vol / 100;
}

function decimalToInt(vol) {
    return vol * 100;
}


}

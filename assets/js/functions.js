function $_GET(param) {
    var vars = {};
    window.location.href.replace( location.hash, '' ).replace(
        /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
        function( m, key, value ) { // callback
            vars[key] = value !== undefined ? value : '';
        }
    );

    if ( param ) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
}

function getItunesUrl(artist, song) {
    const baseUrl = "https://itunes.apple.com/search";
    const query = `term=${encodeURIComponent(artist)}+${encodeURIComponent(song)}`;
    const params = "entity=musicTrack,album&limit=5"; // Reducir a 5 resultados para optimizar
    return `${baseUrl}?${query}&${params}`;
}

    return `${baseUrl}?${queryParams.toString()}`;
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
    }, 4000)
}

function getCover(song_url, station_img) {
    $.getJSON(song_url, function (current) {
        getLiveStatus(current);
        if (song_str != (current.title + " " + current.artist.name))  {
            song_str = current.title + " " + current.artist.name
            $.getJSON(getItunesUrl(current.title, current.artist.name), function (song) {
                let img_url;
                if (song.resultCount === 0) {
                    $.getJSON(getItunesUrl(current.title, current.artist.name, true), function (song_ger) {
                        song = song_ger;
                    });
                    if (song.resultCount === 0) {
                        img_url = station_img;
                    } else {
                        img_url = getImageUrl(song.results[0].artworkUrl100, width, height);
                    }
                } else {
                    img_url = getImageUrl(song.results[0].artworkUrl100, width, height);
                }
                $("#image").attr("src", img_url).attr("alt", current.title + ", " + current.artist.name).attr("width", width).attr("height", height)
            })
        }
    })
}

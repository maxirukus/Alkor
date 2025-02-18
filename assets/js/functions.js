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

async function getCover(song_url, station_img) {
    try {
        const current = await $.getJSON(song_url);
        getLiveStatus(current);

        const currentSongStr = `${current.title}${current.artist.name}`;
        if (song_str === currentSongStr) return; // Evitar búsquedas repetidas

        const img_url = await fetchCoverImage(current.title, current.artist.name, station_img);
        updateCoverImages(img_url, current.title, current.artist.name);
    } catch (error) {
        console.error("Error obteniendo información de la canción:", error);
    }
}

/**
 * Genera una URL para buscar en iTunes una canción, álbum o artista.
 * @param {string} artist - Nombre del artista.
 * @param {string} song - Nombre de la canción.
 * @returns {string} URL de búsqueda en iTunes.
 */
function getItunesUrl(artist, song) {
    const baseUrl = "https://itunes.apple.com/search";
    const query = `term=${encodeURIComponent(artist)}+${encodeURIComponent(song)}`;
    const params = "entity=musicTrack&limit=5"; 
    return `${baseUrl}?${query}&${params}`;
}

/**
 * Busca la imagen de portada en iTunes o devuelve una imagen por defecto.
 * @param {string} title - Título de la canción.
 * @param {string} artist - Nombre del artista.
 * @param {string} fallbackImg - Imagen por defecto.
 * @returns {Promise<string>} URL de la imagen de portada.
 */
async function fetchCoverImage(title, artist, fallbackImg) {
    try {
        if (!title || !artist) return fallbackImg;

        const response = await $.getJSON(getItunesUrl(artist, title));
        if (response.resultCount > 0) {
            // Buscar coincidencia más cercana por título y artista
            const closestMatch = response.results.find(item => {
                const trackMatch = item.trackName?.toLowerCase() === title.toLowerCase();
                const artistMatch = item.artistName?.toLowerCase() === artist.toLowerCase();
                return trackMatch && artistMatch;
            });

            if (closestMatch) {
                return getImageUrl(closestMatch.artworkUrl100, 320, 320);
            }

            // Si no hay coincidencia exacta, devolver el primer resultado como fallback
            return getImageUrl(response.results[0].artworkUrl100, 320, 320);
        }
    } catch (error) {
        console.error("Error buscando imagen en iTunes:", error);
    }

    return fallbackImg; // Usar imagen por defecto si no hay resultados
}

/**
 * Actualiza las imágenes de portada en los elementos especificados.
 * @param {string} img_url - URL de la imagen.
 * @param {string} title - Título de la canción.
 * @param {string} artist - Nombre del artista.
 */
function updateCoverImages(img_url, title, artist) {
    const altText = `${title}, ${artist}`;

    $("#cover-background, #cover")
        .attr("src", img_url)
        .attr("alt", altText)
        .attr("width", 320)
        .attr("height", 320);
}

/**
 * Ajusta la URL de la imagen a las dimensiones deseadas.
 * @param {string} artworkUrl - URL de la imagen original.
 * @param {number} width - Ancho deseado.
 * @param {number} height - Altura deseada.
 * @returns {string} URL ajustada.
 */
function getImageUrl(artworkUrl, width, height) {
    return artworkUrl.replace(/100x100/, `${width}x${height}`);
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

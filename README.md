
# HTML5 Icecast/Shoutcast/Zeno Reproductor de radio de página completa

# documentacion.

Abre el [script.js](https://github.com/joeyboli/html5-shoutcast-icecast-zeno-player/blob/main/js/script.js) siguientes archiva y edita las líneas.

```JavaScript
// NOMBRE DE LA RADIO
const RADIO_NAME = '¡Juego! Radio 1';

// SELECCIONE PROVEEDOR DE ARTE, ITUNES, DEEZER Y SPOTIFY. por ejemplo: spotify 
var API_SERVICE = 'DEEZER';

// Cambie la URL de transmisión aquí, admite ICECAST, ZENO, SHOUTCAST, RADIOJAR y cualquier otro servicio de transmisión.
const URL_STREAMING = 'https://stream-51.zeno.fm/cfhkm5fs1uhvv?zs=HOu6hxV1SG-7iGi9WGVTqQ';

//URL de API / si usa MEDIA CP, CAMBIE ESTO A: https://api.streamafrica.net/metadata/mediacp.php?url='+MEDIACP_JSON_URL
const API_URL = 'https://api.streamafrica.net/metadata/index?z='+URL_STREAMING


 ```

 ## cambiar logotipo.

 Abra la carpeta img y agregue su logotipo llamado "cover.png"





## Tipos de alojamiento admitidos
* Icecast / Gritar
* Radio Zenón
* radiojar
* Azuracast
* Elenco de Centova
* Elenco del Everest
* MediaCP
* Panel sónico
* [JoeyElenco](https://joeycast.com)

## API/fuentes de datos compatibles
* Música de Apple/Itunes
* Deezer
* Spotify
* API de reproducción en curso de Azuracast (Pro)
* MediCP Now Playing API (Pro)
* CentovaCast API de reproducción actual (Pro)




## Características
- Soporte iTunes, Spotify, Azuracast, MediaCP, Deezer.
- Panel de administración para estaciones múltiples.
- Soporte MP3, AAC.
- Estaciones de radio individuales o múltiples.
- API Premium de StreamAfrica.







## Comentario

Si tiene algún comentario, comuníquese conmigo a bankuboy@pm.me


## Licenciado

[MIT](https://github.com/gsavio/player-shoutcast-html5/blob/master/LICENSE)

## Créditos
* [gsavio/player-shoutcast-html5](https://github.com/gsavio/player-shoutcast-html5)
* [streamafrica Free API](https://api.streamafrica.net/)



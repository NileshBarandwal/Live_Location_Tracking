/**
 * Create google maps Map instance.
 * @param {number} lat
 * @param {number} lng
 * @return {Object}
 */
const createMap = ({ lat, lng }) => {
  return new google.maps.Map(document.getElementById('map'), {
    center: { lat, lng },
    zoom: 15
  });
};

/**
 * Device Orientation which help's to move marker to rotate.
 */
      
 window.addEventListener("deviceorientation", handleOrientation, true);

var glb = 0;

function handleOrientation(event) {
   glb = Math.round(event.alpha);
  var icon = {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor : '#3333FF',
              strokeWeight : 5,
              scale: 2.5,
              rotation:glb
            };

    if (marker) {
     marker.setIcon(icon);
  }else{
    console.log("marker not created yet");
  }
  console.log('glb',glb);
}

/**
 * Create google maps Marker instance.
 * @param {Object} map
 * @param {Object} position
 * @return {Object}
 */
     
const createMarker = ({ map, position }) => {
  
   myLocationMarker =  new google.maps.Marker({ map, position ,icon: {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              strokeColor : '#3333FF',
              strokeWeight : 5,
              scale: 2.5,
              rotation:glb
              //rotation:event.alpha,

            },
        shadow : null,
        zIndex : 999});

   

    return myLocationMarker;
};


/**
 * Track the user location.
 * @param {Object} onSuccess
 * @param {Object} [onError]
 * @return {number}
 */
const trackLocation = ({ onSuccess, onError = () => { } }) => {
  if ('geolocation' in navigator === false) {
    return onError(new Error('Geolocation is not supported by your browser.'));
  }

  return navigator.geolocation.watchPosition(onSuccess, onError, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  });
};

/**
 * Get position error message from the given error code.
 * @param {number} code
 * @return {String}
 */
const getPositionErrorMessage = code => {
  switch (code) {
    case 1:
      return 'Permission denied.';
    case 2:
      return 'Position unavailable.';
    case 3:
      return 'Timeout reached.';
  }
}

/**
 * Initialize the application.
 * Automatically called by the google maps API once it's loaded.
*/
// if(window.innerHeight > window.innerWidth){
//     alert("Please use Landscape!");
// }
// Listen for orientation changes

var marker;
function init() {
  const initialPosition = { lat: 59.32, lng: 17.84 };
  const map = createMap(initialPosition);
  marker = createMarker({ map, position: initialPosition });
  const $info = document.getElementById('info');

  let watchId = trackLocation({
    onSuccess: ({ coords: { latitude: lat, longitude: lng } }) => {
      marker.setPosition({ lat, lng });
      map.panTo({ lat, lng });
      $info.textContent = `Lat: ${lat.toFixed(5)} Lng: ${lng.toFixed(5)}`;
      $info.classList.remove('error');
    },
    onError: err => {
      console.log($info);
      $info.textContent = `Error: ${err.message || getPositionErrorMessage(err.code)}`;
      $info.classList.add('error');
    }
  });

// Store old reference
const appendChild = Element.prototype.appendChild;

// All services to catch
const urlCatchers = [
  "/AuthenticationService.Authenticate?",
  "/QuotaService.RecordEvent?"
];

// Google Map is using JSONP.
// So we only need to detect the services removing access and disabling them by not
// inserting them inside the DOM
Element.prototype.appendChild = function (element) {
  const isGMapScript = element.tagName === 'SCRIPT' && /maps\.googleapis\.com/i.test(element.src);
  const isGMapAccessScript = isGMapScript && urlCatchers.some(url => element.src.includes(url));

  if (!isGMapAccessScript) {
    return appendChild.call(this, element);
  }

  // Extract the callback to call it with success data
  // Only needed if you actually want to use Autocomplete/SearchBox API
  //const callback = element.src.split(/.*callback=([^\&]+)/, 2).pop();
  //const [a, b] = callback.split('.');
  //window[a][b]([1, null, 0, null, null, [1]]);

  // Returns the element to be compliant with the appendChild API
  return element;
};

}

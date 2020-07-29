import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import AbsMap from 'map/absmap';

let formatPopup = point => {
  return '<h3>' + point.properties.modeS + '</h3><p>' + point.properties.flightCode1 + '</p>';
};

let createPlane = point => {
  var plane = document.createElement('span');
  plane.className = 'arrow';
  plane.innerHTML = '<img src="img/plane.svg">';
  plane.style.transform = `rotate(${point.properties.trackAngle + 52}deg)`;

  return plane;
};

let createTitle = point => {
  let title = document.createElement('span');
  title.classList.add('alt');
  title.innerHTML = point.properties.flightCode1;

  return title;
};

export default class MapboxMap extends AbsMap {
  constructor(container, conf) {
    super(/*container, conf*/);
    mapboxgl.accessToken = conf.accessToken;

    this.map = new mapboxgl.Map({
      container,
      center: conf.center,
      zoom: conf.zoom,
      hash: true,
      style: 'mapbox://styles/mapbox/bright-v9', //style: 'mapbox://styles/mapbox/dark-v9'
      /*transformRequest: (url, resourceType) => {
          let x = 2;
          if (resourceType == 'Source' && url.includes('itoworld.com')) {
              return {
                  //url: url.replace('http', 'https'),
                  headers: {'Access-Control-Allow-Origin': '*'},
                  credentials: 'include'  // Include cookies for cross-origin requests
              }
          }
      }*/
    });
  }

  removeMarkers() {
    for (let marker of this.markers) {
      marker.remove();
    }
  }

  addMarker(point) {
    var el = document.createElement('div');
    el.className = 'marker';
    el.appendChild(createTitle(point));
    el.appendChild(createPlane(point));

    let popup = new mapboxgl.Popup({offset: 5})
      .setHTML(formatPopup(point));

    var m = new mapboxgl.Marker(el)
      .setLngLat(point.coordinates)
      .setPopup(popup)
      .addTo(this.map);

    this.markers.push(m);
  }

  addMarkers(points) {
    for (let point of points) {
      this.addMarker(point);
    }
  }

  addGeolocateControl(options = {}, position = 'top-right') {
    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      fitBoundsOptionsObject: 10,
      trackUserLocation: true,
      ...options
    }), position);
  }
}

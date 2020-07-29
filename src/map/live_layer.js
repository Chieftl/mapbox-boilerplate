/*
let layer = reloadableLayer(styles)
  // create source/layer
on_update(bounds) -> layer.update //spinner
  //get_data(options) -> source.update
  //bind popup/block */
import mapboxgl from 'mapbox-gl';

let createEmptyGeoJson = () => {
  return {
    'type': 'geojson',
    'data': {
      'type': 'FeatureCollection',
      'features': []
    }
  };
}

export default class liveLayer {
  constructor(options) { //TODO options validation
    this.config = options.config;
    //this.config.map = options.map;  // instanceof mapboxgl.Map
    this.layerId = options.layerId;  // string
    this.styles = options.styles;  // object (type/paint)
    this.stylesFunc = options.stylesFunc;  // function(properties)
    this.ajaxFunc = options.ajaxFunc;  // function(bounds)
    this.popupFunc = options.popupFunc;  // function(properties)

    //options.init();

    this.addEvents();
  }

  addEvents() {
    this.config.map.on('load', () => {
      this.createItems();
      this.ajaxUpdateItems();
    });

    this.config.map.on('moveend', () => {
      this.ajaxUpdateItems();
    });

    this.config.map.on('click', this.layerId, e => {
      var coordinates = e.features[0].geometry.coordinates.slice();

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      let html = this.popupFunc(e.features[0].properties);

      new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(html)
        .addTo(this.config.map);
    });

    this.config.map.on('mouseenter', this.layerId, () => {
      this.config.map.getCanvas().style.cursor = 'pointer';
    });

    // Change it back to a pointer when it leaves.
    this.config.map.on('mouseleave', this.layerId, () => {
      this.config.map.getCanvas().style.cursor = '';
    });
  }

  createItems() {
    //this.config.map.addSource('flickr-photos', {type: 'geojson', data: createEmptyGeoJson()});
    this.config.map.addSource(this.layerId, createEmptyGeoJson());
    this.config.map.addLayer({
      'id': this.layerId,
      'source': this.layerId,
      ...this.styles,
      'layout': {
        /*'icon-image': '{icon}-15',
        'text-field': '{title}',
        'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
        'text-offset': [0, 0.6],
        'text-anchor': 'top'*/
        //'circle-color': '{owner}',
      }
      //'filter': ['==', '$type', 'Point'],
      //'filter': ['==', 'server', '4499'],
      //'filter': ['==', 'owner', '151135260@N07'],
    });
    /*this.config.map.addLayer({
      'id': this.layerId,
      'type': 'circle',
      'source': this.layerId,
      'paint': {
        'circle-radius': 4,
        'circle-color': '#B42222'
      },
    });*/
  }

  updateItems(items) {
    if (this.stylesFunc) items.features = items.features.map(feature => {
      feature.properties = this.stylesFunc(feature.properties)
      return feature;
    });

    console.log('yay!', items);

    let source = this.config.map.getSource(this.layerId);
    if (source) {
      source.setData(items);
    } else {
      this.config.map.addSource(this.layerId, {
        'type': 'geojson',
        'data': items,
      });
    }
  }

  ajaxUpdateItems() {
    let bounds = this.config.map.getBounds();

    //TODO loader
    this.ajaxFunc(bounds).then(items => {
      this.updateItems(items);
    });
  }
}

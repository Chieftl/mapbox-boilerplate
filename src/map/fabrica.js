import MapboxMap from 'map/mapbox';

export default class MapFabrica {
  static createEngine(engineType, container, config) {
    if (engineType == 'mapbox') {
      let engine = new MapboxMap(container, config);

      engine.reload = (points) => {
        engine.removeMarkers();
        engine.addMarkers(points);
      };

      return engine;
    }
  }

}
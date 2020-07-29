export function arrayToObject(photos) {
  let res = {};

  photos.forEach(photo => {
    let key = photo.id;
    let val = photo;
    res[key] = val;
  });

  return res;
}

export function coordsToGeoJson(record) {
  return [record.longitude, record.latitude].map(parseFloat);
}

export function arrayToGeoJson(photos, coordsFunc = coordsToGeoJson) {
  let features = [];

  photos.forEach(photo => {
    let geometry = {
      'type': 'Point',
      'coordinates': coordsFunc(photo),
    };

    let properties = Object.assign({}, photo);
    delete properties.latitude;
    delete properties.longitude;

    let feature = {
      'type': 'Feature',
      geometry,
      properties,
    };

    features.push(feature);
  });

  return {
    'type': 'FeatureCollection',
    features,
  };
}
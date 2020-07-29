import FlickrSDK from 'flickr-sdk';
import {arrayToGeoJson} from 'flickrgeo/arrays';

function flickrError(err) {
  console.error('bonk', err);
}

export default class FlickrGeo extends FlickrSDK {
  /*constructor(api_key) {
    super(api_key);
  }*/

  search(options) {
    return this.photos.search(options).then(function (res) {
      //console.log('yay!', res.body);
      if (res.body.stat !== 'ok') flickrError(res.stat);

      let geoJson = arrayToGeoJson(res.body.photos.photo);

      return geoJson;
    }).catch(function (err) {
      flickrError(err);
    });

  }

}
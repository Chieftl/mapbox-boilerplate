import FlickrGeo from 'flickrgeo';

export default class FlickrSet {
  constructor() {
    //this.fl = new FlickrGeo(API_KEY);
    //debugger

    this.styles = {
      'type': 'circle',
      'paint': {
        'circle-radius': 7,
        //'circle-color': '#B42222'
        'circle-color': ['get', 'color']
      },
    };
  }

  bboxPhotos(bounds) {
    let boundsToBBox = bounds => {
      let corners = {
        southWest: bounds.getSouthWest(),
        northEast: bounds.getNorthEast(),
      }
      return [corners.southWest.lng, corners.southWest.lat, corners.northEast.lng, corners.northEast.lat].join(',');
    }

    let bbox = boundsToBBox(bounds);
    let fl = new FlickrGeo(this.config.API_KEY);
    return fl.search({
      //user_id: '151135260@N07',
      bbox: bbox,//'24.5997,48.8682,24.8937,49.0029',
      extras: 'geo,url_n,tags',
      per_page: 500,
    });
  }

  popupFunc(props) { return `<img src="${props.url_n}">` }

  stylesFunc(props) {
    let color = props => {
      if (props.tags === 'bikeparking') return '#0000ff';
      if (props.owner === '151135260@N07') return '#fba03b';
      return '#bbb';
    }
    return Object.assign(props, {'color': color(props)});
  }
}

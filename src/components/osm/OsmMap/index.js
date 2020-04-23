import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import 'leaflet/dist/leaflet.css'

import withStyles from 'material-ui/styles/withStyles';

const styles = {
  root: {
    // border: "1px solid",
    height: 600,
  },
  leafletContainer: {
    height: "100%",
    width: "100%",
  }
}

export class OsmMap extends PureComponent {

  static propTypes = {
    classes: PropTypes.object.isRequired,
    lat: PropTypes.number.isRequired,
    lon: PropTypes.number.isRequired,
    zoom: PropTypes.number.isRequired,
  }

  static defaultProps = {
    zoom: 6,
  }

  // constructor() {
  //   super()
  //   this.state = {
  //     lat: 49,
  //     lng: 6,
  //     zoom: 8
  //   }
  // }

  render() {

    const {
      window,
    } = global;

    if (!window) {
      return null;
    }

    const Leaflet = require('react-leaflet');

    const {
      Map,
      // Marker,
      // Popup,
      TileLayer,
    } = Leaflet;

    const {
      classes,
      lat,
      lon,
      zoom,
    } = this.props;

    if (!isFinite(lat) || !isFinite(lon)) {
      return null;
    }

    const position = [lat, lon];

    return (
      <Fragment>
        <div
          className={classes.root}
        >
          <Map
            center={position}
            zoom={zoom}
            className={classes.leafletContainer}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors"
            />
            {/* <Marker position={position}>
              <Popup>A pretty CSS3 popup.<br />Easily customizable.</Popup>
            </Marker> */}
          </Map>
        </div>
      </Fragment>
    );
  }
}

export default withStyles(styles)(props => <OsmMap
  {...props}
/>)
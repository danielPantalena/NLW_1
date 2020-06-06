import React from 'react';
import { Map, TileLayer, Marker } from 'react-leaflet';

const Mapa = () => {
  return (
    <Map center={[-27.6164849, -48.4821645]} zoom={10}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={[-27.6164849, -48.4821645]} />
    </Map>
  );
};

export default Mapa;

import * as L from 'leaflet';

export interface MapPin {
    name: string;
    latLng: L.LatLng;
    mapId: number;
    coords: number[];
}
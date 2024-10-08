import * as L from 'leaflet';

export interface MapPin<T> {
    name: string;
    mapId: number;
    coords: number[];
    marker: L.Marker;
    entity: T;
}
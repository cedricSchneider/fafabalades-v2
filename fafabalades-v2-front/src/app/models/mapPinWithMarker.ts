import * as L from 'leaflet';
import { MapPin } from './mapPin';

export interface MapPinWithMarker extends MapPin {
    marker: L.Marker;
}
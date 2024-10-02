import { User } from "./user";
import * as L from 'leaflet';

export interface UserMap extends User {
    marker: L.Marker;
}
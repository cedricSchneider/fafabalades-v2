import * as L from 'leaflet';

export interface PathSegment {
    segmentId: number;
    latLng: L.LatLng;
    mapId: number;
    userId: string;
    order: number;
    color: string;
}
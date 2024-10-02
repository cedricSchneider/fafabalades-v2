import * as L from 'leaflet';

export interface DrawSegmentElt {
    segmentId: number;
    line: L.Polyline;
    distance: number;
    mapId: number;
}
import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { MapPin } from '../models/mapPin';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public towers: MapPin[] = [
    {
      name: 'Tour de la prairie d\'Urban',
      latLng: new L.LatLng(-22.71336, 43.22893167),
      coords: [-2311, 3062],
      mapId: 2
    },
    {
      name: 'Tour du col de Térel',
      latLng: new L.LatLng(-31.10488, 27.18653),
      coords: [-3680, 2346],
      mapId: 2
    },
    {
      name: 'Tour du mont Labulat',
      latLng: new L.LatLng(-44.0086, 47.927983),
      coords: [-1910, 1245],
      mapId: 2
    },
    {
      name: 'Tour des hauteurs Gerudos',
      latLng: new L.LatLng(-73.90632, 23.89368167),
      coords: [-3961, -1306],
      mapId: 2
    },
    {
      name: 'Tour du canyon de Gerudo',
      latLng: new L.LatLng(-84.18476, 41.728985),
      coords: [-2439, -2183],
      mapId: 2
    },
    {
      name: 'Tour du fort de guet',
      latLng: new L.LatLng(-56.92404, 66.8062183),
      coords: [-299, 143],
      mapId: 2
    },
    {
      name: 'Tour de la plaine d\'Hyrule',
      latLng: new L.LatLng(-70.54268, 61.3923483),
      coords: [-761, -1019],
      mapId: 2
    },
    {
      name: 'Tour des ruines obscurcies',
      latLng: new L.LatLng(-21.77576, 74.3411067),
      coords: [344, 3142],
      mapId: 2
    },
    {
      name: 'Tour du ravin d\'Ordinn',
      latLng: new L.LatLng(-44.64148, 89.551503),
      coords: [1642, 1191],
      mapId: 2
    },
    {
      name: 'Tour de la plaine de Sahasla',
      latLng: new L.LatLng(-72.40616, 86.024285),
      coords: [1341, -1178],
      mapId: 2
    },
    {
      name: 'Tour des peuliers',
      latLng: new L.LatLng(-83.52844, 77.39959167),
      coords: [605, -2127],
      mapId: 2
    },
    {
      name: 'Tour du mont Ramol',
      latLng: new L.LatLng(-34.85528, 111.3124483),
      coords: [3499, 2026],
      mapId: 2
    },
    {
      name: 'Tour du plateau Zoran',
      latLng: new L.LatLng(-51.79068, 103.894743),
      coords: [2866, 581],
      mapId: 2
    },
    {
      name: 'Tour de la montagne de Lanelle',
      latLng: new L.LatLng(-74.0118, 115.4021467),
      coords: [3848, -1315],
      mapId: 2
    },
    {
      name: 'Tour de Rabelle',
      latLng: new L.LatLng(-90.8886, 98.668367),
      coords: [2420, -2755],
      mapId: 2
    },
  ];

  public skyAreas: MapPin[] = [
    {
      name: 'Temple du vent',
      coords: [-2860, 3191],
      latLng: new L.LatLng(-21.20148, 36.79557),
      mapId: 1
    },
    {
      name: 'Ciel du château d\'Edal - Nord',
      coords: [-970, 3535],
      latLng: new L.LatLng(-17.1698,58.9432167),
      mapId: 1
    },
    {
      name: 'Ciel de l\'île d\'Edal',
      coords: [4655, 3500],
      latLng: new L.LatLng(-17.58,124.85884167),
      mapId: 1
    },
    {
      name: 'Île Céleste du Prélude',
      coords: [454, -636],
      latLng: new L.LatLng(-66.05392,75.630123),
      mapId: 1
    },
    {
      name: 'Temple de l\'eau',
      coords: [3456, 504],
      latLng: new L.LatLng(-52.69312,110.80856),
      mapId: 1
    },
    {
      name: 'Îles du Tonnerre',
      coords: [1380, -3180],
      latLng: new L.LatLng(-95.8696,86.4813),
      mapId: 1
    },
    {
      name: 'Ciel du château d\'Edal - Sud',
      coords: [-1795, -3295],
      latLng: new L.LatLng(-97.2174,49.27559167),
      mapId: 1
    },
  ];

  public actionDistance: number = 15;

  constructor() { }

  public convertToLatLng(x: number, y: number): [number, number] {
    return [
      (-y + 5000) * (-117.2/10000), (x + 6000) * (140.62/12000)
    ];
  }

  public convertToXY(latLng: L.LatLng): [number, number] {
    return [
      Math.round(latLng.lng * (12000/140.62) -6000),
      Math.round(latLng.lat * (10000/-117.2) -5000) * -1
    ];
  }

  public getDistance(xA: number, yA: number, xB: number, yB: number): number {
    return Math.sqrt(Math.pow(xB - xA, 2) + Math.pow(yB - yA, 2));
  }

  public getDistanceFromLatlng(latlngA: L.LatLng, latlngB: L.LatLng): number {
    var ptA = this.convertToXY(latlngA);
    var ptB = this.convertToXY(latlngB);
    return this.getDistance(ptA[0], ptA[1], ptB[0], ptB[1]);
  }
}

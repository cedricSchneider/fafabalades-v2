import { Injectable } from '@angular/core';
import * as L from 'leaflet';
import { MapLocation } from '../models/mapLocation';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  public towers: MapLocation[] = [
    {
      name: 'Tour de la prairie d\'Urban',
      coords: [-2311, 3062],
      mapId: 2
    },
    {
      name: 'Tour du col de Térel',
      coords: [-3680, 2346],
      mapId: 2
    },
    {
      name: 'Tour du mont Labulat',
      coords: [-1910, 1245],
      mapId: 2
    },
    {
      name: 'Tour des hauteurs Gerudos',
      coords: [-3961, -1306],
      mapId: 2
    },
    {
      name: 'Tour du canyon de Gerudo',
      coords: [-2439, -2183],
      mapId: 2
    },
    {
      name: 'Tour du fort de guet',
      coords: [-299, 143],
      mapId: 2
    },
    {
      name: 'Tour de la plaine d\'Hyrule',
      coords: [-761, -1019],
      mapId: 2
    },
    {
      name: 'Tour des ruines obscurcies',
      coords: [344, 3142],
      mapId: 2
    },
    {
      name: 'Tour du ravin d\'Ordinn',
      coords: [1642, 1191],
      mapId: 2
    },
    {
      name: 'Tour de la plaine de Sahasla',
      coords: [1341, -1178],
      mapId: 2
    },
    {
      name: 'Tour des peuliers',
      coords: [605, -2127],
      mapId: 2
    },
    {
      name: 'Tour du mont Ramol',
      coords: [3499, 2026],
      mapId: 2
    },
    {
      name: 'Tour du plateau Zoran',
      coords: [2866, 581],
      mapId: 2
    },
    {
      name: 'Tour de la montagne de Lanelle',
      coords: [3848, -1315],
      mapId: 2
    },
    {
      name: 'Tour de Rabelle',
      coords: [2420, -2755],
      mapId: 2
    },
  ];

  public skyAreas: MapLocation[] = [
    {
      name: 'Temple du vent',
      coords: [-2860, 3191],
      mapId: 1
    },
    {
      name: 'Ciel du château d\'Edal - Nord',
      coords: [-970, 3535],
      mapId: 1
    },
    {
      name: 'Ciel de l\'île d\'Edal',
      coords: [4655, 3500],
      mapId: 1
    },
    {
      name: 'Île Céleste du Prélude',
      coords: [454, -636],
      mapId: 1
    },
    {
      name: 'Temple de l\'eau',
      coords: [3456, 504],
      mapId: 1
    },
    {
      name: 'Îles du Tonnerre',
      coords: [1380, -3180],
      mapId: 1
    },
    {
      name: 'Ciel du château d\'Edal - Sud',
      coords: [-1795, -3295],
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

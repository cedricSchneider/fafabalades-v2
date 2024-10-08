import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, OnInit, ViewContainerRef } from '@angular/core';
import * as L from 'leaflet';
import { DrawSegmentElt } from '../../models/drawSegment';
import { Profile } from '../../models/profile';
import { DistancePipe } from '../../pipes/distance.pipe';
import { PathSegment } from '../../models/pathSegment';
import { MapService } from '../../services/map.service';
import { UserMap } from '../../models/userMap';
import { PathRecordMap } from '../../models/pathRecordMap';
import { PathRecordBody } from '../../models/form/pathRecordBody';
import { PathRecord } from '../../models/pathRecord';
import { MapPin } from '../../models/mapPin';
import { MapPinActionComponent } from '../../components/map-pin-action/map-pin-action.component';
import { Npc } from '../../models/npc';
import { NpcDialogueComponent } from '../../components/npc-dialogue/npc-dialogue.component';

@Component({
  selector: 'app-demo',
  standalone: true,
  imports: [CommonModule,DistancePipe,NpcDialogueComponent],
  templateUrl: './demo.component.html',
  styleUrl: './demo.component.scss'
})
export class DemoComponent implements OnInit, AfterViewInit {

  private map!: L.Map;
  public currentMapId: number = 2;
  private maxBounds: L.LatLngBounds = new L.LatLngBounds([
    [0, 4],
    [-114, 140],
    // [10, -10],
    // [-130, 170],
  ]);
  private centerPosition: L.LatLng = new L.LatLng(-62.375, 67.26049260834347);
  private saveCoords: L.LatLng;
  private saveZoom: number;
  private towers: MapPin<void>[] = [];
  private skyAreas: MapPin<void>[] = [];

  private npcMarkers: MapPin<Npc>[] = [];
  private npcs: Npc[] = [];
  public dialogueNpc: Npc = null;

  public drawSegments: DrawSegmentElt[] = [];
  private currentSegmentId: number = null;

  public isDrawing: boolean = false;
  public drawingMode: boolean = false;
  public profile: Profile = {
    userId: '1',
    color: '#33ee99',
    credits: 10000,
    position: [0,0],
    mapId: 2,
  };

  public color: string = this.profile.color;

  public users: UserMap[] = [];
  public pathRecords: PathRecordMap[] = [];

  public displayMode: string = 'all';

  public loadingSubmitPath: boolean;

  constructor(
    public mapService: MapService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getNpcs();
    this.getRecords();    
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private getUsers() {
    this.users = [
      {
        userId: '1',
        color: '#33ee99',
        imageUrl: 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ead5c8b2-a4c9-4724-b1dd-9f00b46cbd3d-profile_image-300x300.png',
        marker: null,
        username: 'nimarzel',
        position: [0,0],
        mapId: 2
      },
      {
        userId: '2',
        color: '#0a4245',
        imageUrl: 'https://static-cdn.jtvnw.net/jtv_user_pictures/609de61e-b580-4e80-bef4-fa814f1b5bf9-profile_image-300x300.png',
        marker: null,
        username: 'farore',
        position: [1050,-330],
        mapId: 2
      },
    ];
  }

  private getNpcs() {
    this.npcs = [{
      id: 1,
      name: 'Babil',
      mapId: 2,
      position: [-3580, 1810],
      icon: 'https://www.zeldadungeon.net/wiki/images/thumb/4/4f/Tulin_-_TotK_key_art_nobg.png/400px-Tulin_-_TotK_key_art_nobg.png',
      picture: 'https://www.zeldadungeon.net/wiki/images/thumb/4/4f/Tulin_-_TotK_key_art_nobg.png/400px-Tulin_-_TotK_key_art_nobg.png',
      dialogueContent: 'Salut voyageur, je suis Babil du Village Piaf !\nJ\'aime faire tomber le loot dans le vide ouais ouais ouais !',
      dialogueSound: '',
    }]
  }

  private getRecords() {
    this.pathRecords = [
      {
        userId: '1',
        color: '#33ee99',
        mapId: 2,
        coords: [[100,-105], [34, -20], [0,0]],
        date: '2024-09-27T00:00:00Z',
        pathLine: null,
      },
      {
        userId: '2',
        color: '#0a4245',
        mapId: 2,
        coords: [[800,-120], [910, -240], [1050,-330]],
        date: '2024-09-28T00:00:00Z',
        pathLine: null,
      },
    ];
  }

  private initMap() {
    const tiles = L.tileLayer('https://totk.farore.fr/tiles/' + (this.currentMapId == 1 ? 'sky' : (this.currentMapId == 2 ? 'overworld' : 'underground')) + '/{z}_{x}_{y}.png', {
      maxZoom: 8,
      minZoom: 3
    });

    this.map = L.map('map-demo', {
      center: this.saveCoords ?? this.centerPosition,
      zoom: this.saveZoom ?? 3,
      maxBounds: this.maxBounds,
      crs: L.CRS.Simple,
      zoomControl: false,
      attributionControl: false
    });
    tiles.addTo(this.map);
    this.map.on("mousemove", this.moveOnMap(this));
    this.map.on("mousedown", this.mouseDownMap(this));
    this.map.on("mouseup", this.mouseUpMap(this));
    this.map.on("mouseout", this.mouseOutMap(this));

    this.towers = [];
    if (this.currentMapId == 2) {
      this.mapService.towers.forEach((tower) => {
        const latLng = L.latLng(this.mapService.convertToLatLng(tower.coords[0], tower.coords[1]));
        const marker = new L.Marker(latLng, { 
          icon: L.icon({ 
            iconUrl: 'icons/tower.png', 
            iconSize: [20, 28],
            iconAnchor: [10, 14],
          })
        }).bindTooltip(tower.name, { permanent: true, direction: 'bottom', className: 'tower-tooltip', opacity: 1 });
        this.map.addLayer(marker);
        this.towers.push({
          name: tower.name,
          coords: tower.coords,
          mapId: tower.mapId,
          marker: marker,
          entity: null
        });
      });
    }

    this.skyAreas = [];
    if (this.currentMapId == 1) {
      this.mapService.skyAreas.forEach((area) => {
        const latLng = L.latLng(this.mapService.convertToLatLng(area.coords[0], area.coords[1]));
        const marker = new L.Marker(latLng, {
          icon: L.icon({ 
            iconUrl: 'icons/arrowDown.png', 
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          })
        }).bindTooltip(area.name, { permanent: true, direction: 'bottom', className: 'tower-tooltip', opacity: 1 });
        this.map.addLayer(marker);
        this.skyAreas.push({
          name: area.name,
          coords: area.coords,
          mapId: area.mapId,
          marker: marker,
          entity: null
        });
      });
    }

    this.npcMarkers = [];
    this.npcs.forEach((npc) => {
      if (npc.mapId == this.currentMapId) {
        const latLng = L.latLng(this.mapService.convertToLatLng(npc.position[0], npc.position[1]));
        const marker = new L.Marker(latLng, { 
          icon: L.icon({ 
            iconUrl: npc.icon, 
            iconSize: [64, 64],
            iconAnchor: [32, 32],
          })
        }).bindTooltip(npc.name, { permanent: true, direction: 'bottom', className: 'npc-tooltip', opacity: 1 });
        this.map.addLayer(marker);
        this.npcMarkers.push({
          name: npc.name,
          coords: npc.position,
          mapId: npc.mapId,
          marker: marker,
          entity: npc
        });        
      }
    });    

    this.drawLines();
    this.drawUsers();

    this.drawSegments.forEach((s) => {
      if (s.mapId == this.currentMapId) {
        s.line.addTo(this.map);
      }
    });
  }

  public clickSelectMap(mapId: number) {
    if (!this.drawingMode) {
      this.selectMap(mapId);
    }
  }

  public selectMap(mapId: number) {
    if (this.currentMapId !== mapId) {
      this.currentMapId = mapId;
      this.saveCoords = this.map.getCenter();
      this.saveZoom = this.map.getZoom();
      this.map.remove();
      this.initMap();
    }
  }

  private drawLines() {
    this.pathRecords.forEach((r) => {
      r.pathLine = null;
      if (r.mapId == this.currentMapId) {
        r.pathLine = L.polyline(r.coords.map((c) => L.latLng(this.mapService.convertToLatLng(c[0], c[1]))),{color: r.color, smoothFactor: 1});
        if (this.displayMode == 'all' || this.displayMode == 'path') {
          r.pathLine.addTo(this.map);
        }
      }
    });
  }

  private drawUsers() {
    this.users.forEach((u) => {
      u.marker = null;
      if (u.mapId == this.currentMapId || (u.userId == this.profile.userId && this.profile.mapId == this.currentMapId)) {
        u.marker = new L.Marker(
          u.userId == this.profile.userId ? this.mapService.convertToLatLng(this.profile.position[0], this.profile.position[1]) : this.mapService.convertToLatLng(u.position[0], u.position[1])
          , {
          icon: L.icon({
            iconUrl: u.imageUrl, 
            iconSize: [30, 30],
            iconAnchor: [15, 15],
            className: 'user-marker user-' + u.userId + (u.userId == this.profile.userId ? ' logged-marker' : '')
          }),
        }).bindTooltip(u.username, { permanent: true, direction: 'bottom', className: 'user-tooltip', opacity: 1 });
        if (this.displayMode == 'all' || this.displayMode == 'path') {
          u.marker.addTo(this.map);
        }
        const elt = document.getElementsByClassName('user-' + u.userId)[0] as HTMLElement;
        elt.style.border = '2px solid ' + u.color;
        elt.setAttribute('draggable', 'false');  
      }
    });
  }

  public startDrawing() {
    if (this.displayMode != 'all') {
      this.displayMode = 'all';
      this.changeDisplayMode();
    }

    this.drawingMode = true;
    const latLng = L.latLng(this.mapService.convertToLatLng(this.profile.position[0], this.profile.position[1]));
    if (this.profile.mapId != this.currentMapId) {
      this.selectMap(this.profile.mapId)
    }

    this.map.flyTo(latLng, this.map.getMaxZoom() - 1);
    this.checkMapActions();
  }

  public getMapPinDistance(pin: MapPin<any>): number {
    return this.mapService.getDistance(this.profile.position[0], this.profile.position[1], pin.coords[0], pin.coords[1]);
  }

  public checkMapActions() {
    if (this.currentMapId == 2) {
      this.checkTowers();
    } else if (this.currentMapId == 1) {
      this.checkSkyAreas();
    }
    this.checkNpcs();
  }

  public checkTowers() {
    for (let i = 0; i < this.towers.length; i++) {
      const tower = this.towers[i];
      if (this.getMapPinDistance(tower) <= this.mapService.actionDistance) {
        if (!tower.marker.isPopupOpen()) {
          const component = this.viewContainerRef.createComponent(MapPinActionComponent);
          component.instance.action = () => { this.goToMap(1) };
          component.instance.buttonContent = 'Activer la tour';
          tower.marker.bindPopup(L.popup({
            content: component.location.nativeElement,
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            closeOnEscapeKey: false,
            className: 'action-popup'
          })).openPopup();
        }
      } else {
        if (tower.marker.isPopupOpen()) {
          tower.marker.closePopup();
        }
        tower.marker.unbindPopup();
      }
    }
  }

  public checkSkyAreas() {
    for (let i = 0; i < this.skyAreas.length; i++) {
      const area = this.skyAreas[i];
      if (this.getMapPinDistance(area) <= this.mapService.actionDistance) {
        if (!area.marker.isPopupOpen()) {
          const component = this.viewContainerRef.createComponent(MapPinActionComponent);
          component.instance.action = () => { this.goToMap(2) };
          component.instance.buttonContent = 'Retour à la surface';
          area.marker.bindPopup(L.popup({
            content: component.location.nativeElement,
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            closeOnEscapeKey: false,
            className: 'action-popup'
          })).openPopup();
        }
      } else {
        if (area.marker.isPopupOpen()) {
          area.marker.closePopup();
        }
        area.marker.unbindPopup();
      }
    }
  }

  public checkNpcs() {
    for (let i = 0; i < this.npcMarkers.length; i++) {
      const npc = this.npcMarkers[i];
      if (this.getMapPinDistance(npc) <= this.mapService.actionDistance) {
        if (!npc.marker.isPopupOpen()) {
          const component = this.viewContainerRef.createComponent(MapPinActionComponent);
          component.instance.action = () => { this.talkToNpc(npc.entity) };
          component.instance.buttonContent = 'Parler';
          npc.marker.bindPopup(L.popup({
            content: component.location.nativeElement,
            closeButton: false,
            autoClose: false,
            closeOnClick: false,
            closeOnEscapeKey: false,
            className: 'action-popup'
          })).openPopup();
        }
      } else {
        if (npc.marker.isPopupOpen()) {
          npc.marker.closePopup();
        }
        npc.marker.unbindPopup();
      }
    }
  }

  public talkToNpc(npc: Npc) {
    this.dialogueNpc = Object.assign({}, npc);
  }

  public goToMap(mapId: number) {
    this.profile.mapId = mapId;
    this.selectMap(mapId);
  }

  private computeLatLngFromCredits(destination: L.LatLng): { destination: L.LatLng, distance: number } {
    const previousLatLng = L.latLng(this.mapService.convertToLatLng(this.profile.position[0], this.profile.position[1]));
    let distance = this.mapService.getDistanceFromLatlng(destination, previousLatLng);
    if (distance > this.profile.credits) {
      const prevXY = this.profile.position;
      const currXY = this.mapService.convertToXY(destination);

      let a = (currXY[1] - prevXY[1]) / (currXY[0] - prevXY[0]);
      let b = currXY[1] - a * (currXY[0]);
      
      let aPol = Math.pow(a, 2) + 1;
      let bPol = -2*prevXY[0] + 2*a*b - 2*a*prevXY[1];
      let cPol = Math.pow(prevXY[0], 2) + Math.pow(b, 2) - 2*b*prevXY[1] + Math.pow(prevXY[1], 2) - Math.pow(this.profile.credits, 2);

      let xSol1 = (Math.sqrt(Math.pow(bPol, 2) - 4*aPol*cPol) - bPol) / (2*aPol);
      let xSol2 = (-Math.sqrt(Math.pow(bPol, 2) - 4*aPol*cPol) - bPol) / (2*aPol);
      let ySol1 = a * xSol1 + b;
      let ySol2 = a * xSol2 + b;

      let distSol1 = this.mapService.getDistance(currXY[0], currXY[1], xSol1, ySol1);
      let distSol2 = this.mapService.getDistance(currXY[0], currXY[1], xSol2, ySol2);
      if (distSol1 < distSol2) {
        return { destination: L.latLng(this.mapService.convertToLatLng(xSol1, ySol1)), distance: this.profile.credits };
      } else {
        return { destination: L.latLng(this.mapService.convertToLatLng(xSol2, ySol2)), distance: this.profile.credits };
      }
    } else {
      return { destination: destination, distance: distance };
    }
  }

  private moveOnMap(that: DemoComponent) {
    return (e: L.LeafletMouseEvent) => {
      if (that.isDrawing && that.profile.credits > 0) {
        const destinationCheck = that.computeLatLngFromCredits(e.latlng);
        that.drawSegments.push({
          segmentId: that.currentSegmentId,
          line: L.polyline([L.latLng(that.mapService.convertToLatLng(that.profile.position[0], that.profile.position[1])), destinationCheck.destination],{color: that.profile.color, smoothFactor: 1}),
          distance: destinationCheck.distance,
          mapId: that.currentMapId
        });
        that.drawSegments[that.drawSegments.length - 1].line.addTo(that.map);

        that.profile.credits -= destinationCheck.distance;
        that.profile.position = that.mapService.convertToXY(destinationCheck.destination);
        that.moveMarker(that.profile.userId, e.latlng);

        that.checkMapActions();
      }
    }
  }

  private mouseDownMap(that: DemoComponent) {
    return (e: L.LeafletMouseEvent) => {
      if (that.drawingMode && e.originalEvent.button == 0 && !that.isDrawing && that.profile.credits > 0) {
        that.isDrawing = true;
        that.currentSegmentId = new Date().getTime();
        const destinationCheck = that.computeLatLngFromCredits(e.latlng);
        that.drawSegments.push({
          segmentId: that.currentSegmentId,
          line: L.polyline([L.latLng(that.mapService.convertToLatLng(that.profile.position[0], that.profile.position[1])), destinationCheck.destination],{color: that.profile.color, smoothFactor: 1}),
          distance: destinationCheck.distance,
          mapId: that.currentMapId
        });
        that.profile.credits -= destinationCheck.distance;
        that.drawSegments[that.drawSegments.length - 1].line.addTo(that.map);
        that.moveMarker(that.profile.userId, destinationCheck.destination);
        that.profile.position = that.mapService.convertToXY(destinationCheck.destination);
        that.checkMapActions();
        that.map.dragging.disable();
      }
    }
  }

  private mouseUpMap(that: DemoComponent) {
    return (e: L.LeafletMouseEvent) => {
      if (that.drawingMode && that.isDrawing && e.originalEvent.button == 0) {
        that.isDrawing = false;
        that.map.dragging.enable();
        that.checkMapActions();
      }
    }
  }

  private mouseOutMap(that: DemoComponent) {
    return (e: L.LeafletMouseEvent) => {
      if (that.drawingMode && that.isDrawing)
      that.isDrawing = false;
      that.map.dragging.enable();
    }
  }

  public cancelSegment() {
    if (this.drawSegments.length > 0) {
      const toRemoveId = this.drawSegments[this.drawSegments.length - 1].segmentId;
      this.drawSegments.forEach((segment) => {
        if (segment.segmentId == toRemoveId) {
          this.map.removeLayer(segment.line);
          this.profile.credits += segment.distance;
        }
      });
      this.drawSegments = this.drawSegments.filter((x) => x.segmentId != toRemoveId);
      let newLatLng: L.LatLng;
      let newMapId: number;
      if (this.drawSegments.length > 0) {
        const latLngs = this.drawSegments[this.drawSegments.length - 1].line.getLatLngs() as L.LatLng[];
        newLatLng = latLngs[latLngs.length - 1];
        newMapId = this.drawSegments[this.drawSegments.length - 1].mapId;
      } else {
        const user = this.users.filter((x) => x.userId == this.profile.userId)[0];
        newLatLng = L.latLng(this.mapService.convertToLatLng(user.position[0], user.position[1]));
        newMapId = user.mapId;
      }

      this.profile.position = this.mapService.convertToXY(newLatLng);
      this.profile.mapId = newMapId;
      if (this.currentMapId != newMapId) {
        this.selectMap(newMapId);
      } else {
        this.moveMarker(this.profile.userId, newLatLng);
      }
      this.checkMapActions();
    }
  }

  public changeDisplayMode() {

  }

  public moveMarker(userId: string, latLng: L.LatLng) {
    this.users.filter((u) => u.userId == userId)[0].marker.setLatLng(latLng);
  }

  public cleanDrawSegments(redeemCredits: boolean = false) {
    this.drawSegments.forEach((s) => {
      this.map.removeLayer(s.line);
      if (redeemCredits) {
        this.profile.credits += s.distance;
      }
    });
    this.drawSegments = [];
  }

  public disableAllPopups() {
    this.towers.forEach((x) => {
      if (x.marker.isPopupOpen()) {
        x.marker.closePopup();
      }
      x.marker.unbindPopup();
    });
    this.skyAreas.forEach((x) => {
      if (x.marker.isPopupOpen()) {
        x.marker.closePopup();
      }
      x.marker.unbindPopup();
    });
    this.npcMarkers.forEach((x) => {
      if (x.marker.isPopupOpen()) {
        x.marker.closePopup();
      }
      x.marker.unbindPopup();
    });
  }

  public submitDrawing() {
    const pathToSend: PathRecordBody[] = []; 
    if (this.drawSegments.length > 0) {
      const now = new Date().toISOString();
  
      let currentRecord: PathRecordBody = null;
      let orderSurface: number = 1;
      let orderSky: number = 1;
  
      this.drawSegments.forEach((s) => {
        const latlngs: L.LatLng[] = s.line.getLatLngs() as L.LatLng[];
        if (currentRecord == null || currentRecord.mapId != s.mapId) {
          if (currentRecord != null) {
            pathToSend.push(currentRecord);
          }
          currentRecord = {
            date: now,
            coords: [this.mapService.convertToXY((s.line.getLatLngs() as L.LatLng[])[0])],
            mapId: s.mapId,
            order: s.mapId == 1 ? orderSky : orderSurface
          };
          if (s.mapId == 1) {
            orderSky++;
          } else {
            orderSurface++;
          }
        }
        currentRecord.coords.push(this.mapService.convertToXY((s.line.getLatLngs() as L.LatLng[])[1]));
      });
      if (currentRecord != null) {
        pathToSend.push(currentRecord);
      }
  
      pathToSend.forEach((record) => {
        const pathRecord: PathRecordMap = {
          userId: this.profile.userId,
          color: this.profile.color,
          coords: record.coords,
          mapId: record.mapId,
          date: now,
          pathLine: null
        };
        if (pathRecord.mapId == this.currentMapId) {
          pathRecord.pathLine = L.polyline(pathRecord.coords.map((c) => L.latLng(this.mapService.convertToLatLng(c[0], c[1]))),{color: pathRecord.color, smoothFactor: 1});
          if (this.displayMode == 'all' || this.displayMode == 'path') {
            pathRecord.pathLine.addTo(this.map);
          }
        }
        this.pathRecords.push(pathRecord);
      });
    
      this.cleanDrawSegments();
    }

    const user = this.users.filter((u) => u.userId == this.profile.userId)[0];
    if (this.profile.mapId != user.mapId || pathToSend.length > 0) {
      this.loadingSubmitPath = true;
      // TODO send pathToSend & mapId to server
      this.loadingSubmitPath = false;
    }

    user.mapId = this.profile.mapId;
    user.position = this.profile.position;
    this.disableAllPopups();
    this.drawingMode = false;
  }
}

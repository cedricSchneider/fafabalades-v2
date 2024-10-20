export interface Npc {
    id: number;
    name: string;
    position: number[];
    mapId: number;
    icon: string;
    picture: string;
    // TODO remove this, handled by api
    alreadyTalked: boolean;
}
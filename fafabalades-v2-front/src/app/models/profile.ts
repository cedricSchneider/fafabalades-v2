import { PathRecord } from "./pathRecord";

export interface Profile {
    userId: string;
    credits: number;
    color: string;
    position: number[];
    mapId: number;
}
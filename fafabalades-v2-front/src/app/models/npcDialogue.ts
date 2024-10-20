import { Item } from "./item";

export interface NpcDialogue {
    content: string;
    sound: string;
    rewards: Item[];
}
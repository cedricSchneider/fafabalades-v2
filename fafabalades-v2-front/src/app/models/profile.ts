import { GiftedItem } from "./giftedItem";
import { Item } from "./item";

export interface Profile {
    userId: string;
    credits: number;
    color: string;
    position: number[];
    mapId: number;
    inventory: Item[];
    giftedItems: GiftedItem[];
}
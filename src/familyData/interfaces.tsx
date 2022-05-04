import { EventBdData } from "../firebaseCustom";

export type EventData = EventBdData & {
   id: string;
   creatorName: string | null;
   creatorId: string | null;
   signedByName: string | null;
   signedById: string | null;
};

export interface FamilyMember {
   name: string; 
   email: string; 
   id: string;
}

export interface Day {
   year: number;
   month: string;
   day: number;
}


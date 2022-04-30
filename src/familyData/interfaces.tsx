import { DocumentReference } from "firebase/firestore";

export interface EventBdData {
   familyId: string;
   title: string;
   timeStart: string;
   timeEnd: string;
   creator: DocumentReference | null;
   signedBy: DocumentReference | null;
   year: number;
   month: string;
   day: number;
}

export type EventData = EventBdData & {
   id: string;
   creatorName: string | null;
   creatorId: string | null;
   signedByName: string | null;
   signedById: string | null;
};

export interface FamilyData {
   name: string;
   admin: DocumentReference; 
   users: DocumentReference[];
}

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
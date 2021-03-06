import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { DocumentReference, getFirestore } from "firebase/firestore";
import { collection } from "firebase/firestore";

const firebaseConfig = {
   apiKey: "AIzaSyCFbz_TgnDkYpgyjMAOoCGPiLh4Hd-YuKY",
   authDomain: "babywatch-132c8.firebaseapp.com",
   projectId: "babywatch-132c8",
   storageBucket: "babywatch-132c8.appspot.com",
   messagingSenderId: "932290272763",
   appId: "1:932290272763:web:7644b425ddb290a3d2bf5e"
};
   
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
const db = getFirestore(app);

export const events = collection(db, 'events');
export const families = collection(db, 'families');
export const users = collection(db, 'users');

export interface DocData<T = any> {
   id: string;
   data: T;
}

export interface User {
   name: string;
   email: string;
}

export interface FamilyData {
   name: string;
   admin: DocumentReference; 
   users: DocumentReference[];
   invited: DocumentReference[];
}

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
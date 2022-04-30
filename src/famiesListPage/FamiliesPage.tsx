import { addDoc, arrayRemove, arrayUnion, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { DocData, families, users } from '../firebaseCustom';
import CreateFamily from "./CreateFamily";
import FamiliesList from "./FamiliesList";
import FamiliesPendingInvite from "./FamiliesPendingInvite";
import './families.css';
import { useSelector } from "react-redux";
import { RootState } from "../store/store";

export default function FamiliesPage() {
   const user = useSelector((state: RootState) => state.user);

   const [familiesUserIsIn, setFamiliesUserIsIn] = useState<DocData[]>([]);
   const [familierUserInvitedTo, setFamilierUserInvitedTo] = useState<DocData[]>([]);
   
   useEffect(() => {
      getFamilies();
      getInvites();   
   }, [user]);
   
   async function getFamilies() {
      if (user) {
         const q = query(families, where('users', 'array-contains', doc(users, user.id)));
         const querySnapshot = await getDocs(q);
         
         setFamiliesUserIsIn(querySnapshot.docs.map(doc => {
            return {id: doc.id, data: doc.data()}
         }));  
      }           
   }

   async function getInvites() {
      if (user) {
         const q = query(families, where('invited', 'array-contains', doc(users, user.id)));
         const querySnapshot = await getDocs(q);
         
         setFamilierUserInvitedTo(querySnapshot.docs.map(doc => {
            return {id: doc.id, data: doc.data()}
         }));
      }
   }

   async function createFamily(name: string = 'no name') {
      try {  
         if (user) {
            await addDoc(families, {name: name, admin: doc(users, user.id), users: [doc(users, user.id)]});
            await getFamilies();
         }
      } catch (e) {
         console.error("Error making family: ", e);
      }
   }

   async function deleteFamily(id: string) {
      try {
         await deleteDoc(doc(families, id));
      } catch (e) {
         console.error("Error deleting family: ", e);
      }
      await getFamilies();
   }

   async function inviteReaction(id: string, answer: boolean) {
      const ref = doc(families, id);
      try {
         if (user) {
            await updateDoc(ref, {invited: arrayRemove(doc(users, user.id))});
            if (answer) {
               await updateDoc(ref, {users: arrayUnion(doc(users, user.id))});
               getFamilies();
            }
            getInvites();
         }
      } catch (e) {
         console.log('error accepting invite ', e);
      }   
   }

   return <>
      {!!familiesUserIsIn.length && 
      <h2>Your families:</h2>}
      <FamiliesList 
         familiesUserIsIn={familiesUserIsIn}
         deleteFamily={deleteFamily}
      />

      {!!familierUserInvitedTo.length && 
      <h2>You are invited:</h2>}
      <FamiliesPendingInvite 
         familierUserInvitedTo={familierUserInvitedTo}
         inviteReaction={inviteReaction}
      />
      
      <CreateFamily
         createFamily={createFamily}
      />
   </>;
}
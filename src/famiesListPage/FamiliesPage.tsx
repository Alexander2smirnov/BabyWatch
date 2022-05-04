import { addDoc, arrayRemove, arrayUnion, deleteDoc, doc, DocumentReference, getDocs, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { DocData, families, FamilyData, users } from '../firebaseCustom';
import CreateFamily from "./CreateFamily";
import FamiliesList from "./FamiliesList";
import FamiliesPendingInvite from "./FamiliesPendingInvite";
import './families.css';
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store/store";


export default function FamiliesPage() {
   const user = useSelector((state: RootState) => state.user);
   const dispatch: AppDispatch = useDispatch();
   
   const [familiesUserIsIn, setFamiliesUserIsIn] = useState<DocData<FamilyData>[]>([]);
   const [familiesUserInvitedTo, setFamiliesUserInvitedTo] = useState<DocData<FamilyData>[]>([]);

   useEffect(() => {
      getFamilies();
      getInvites();   
   }, [user]);
   
   async function getFamilies() {
      if (user) {
         const q = query(families, where('users', 'array-contains', doc(users, user.id)));
         try {
         const querySnapshot = await getDocs(q);
         const familiesRefs: DocumentReference[] = [];
         
         setFamiliesUserIsIn(querySnapshot.docs.map(doc => {
            familiesRefs.push(doc.ref);
            return {id: doc.id, data: doc.data() as FamilyData}
         }));  
         dispatch({type: 'setFamilies', payload: familiesRefs});
         } catch (e) {
            console.log('Error getting families list');
         }
      }           
   }

   async function getInvites() {
      if (user) {
         try {
            const q = query(families, where('invited', 'array-contains', doc(users, user.id)));
            const querySnapshot = await getDocs(q);
            
            setFamiliesUserInvitedTo(querySnapshot.docs.map(doc => {
               return {id: doc.id, data: doc.data() as FamilyData}
            }));
         } catch (e) {
            console.log('Error getting invites');
         }
      }
   }

   async function createFamily(name: string = 'no name') {
      try {  
         if (user) {
            await addDoc(families, {
               name: name, 
               admin: doc(users, user.id), 
               users: [doc(users, user.id)],
            });
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

      {!!familiesUserInvitedTo.length && 
      <h2>You are invited:</h2>}
      <FamiliesPendingInvite 
         familiesUserInvitedTo={familiesUserInvitedTo}
         inviteReaction={inviteReaction}
      />
      
      <CreateFamily
         createFamily={createFamily}
      />
   </>;
}
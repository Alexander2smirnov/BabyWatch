import { async } from "@firebase/util";
import { addDoc, arrayRemove, arrayUnion, deleteDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { families, users } from './firebaseCustom';
import UserContext from './userContext';
import CreateFamily from "./CreateFamily";
import FamiliesList from "./FamiliesList";
import FamiliesPendingInvite from "./FamiliesPendingInvite";


export default function FamiliesPage () {
    const user = useContext (UserContext);

    const [familiesUserIsIn, setFamiliesUserIsIn] = useState([]);
    const [familierUserInvitedTo, setFamilierUserInvitedTo] = useState([]);
    
    useEffect(() => {
        getFamilies();
        getInvites();    
    }, [user])
    
    async function getFamilies() {
        const q = query(families, where('users', 'array-contains', doc(users, user.uid)));
        const querySnapshot = await getDocs(q);
        setFamiliesUserIsIn(querySnapshot.docs.map(doc => {
            console.log(doc.data())
            return {id: doc.id, data: doc.data()}
        }));                 
    }

    async function getInvites () {
        const q = query(families, where('invited', 'array-contains', doc(users, user.uid)));
        const querySnapshot = await getDocs(q);
        console.log(querySnapshot);
        
        setFamilierUserInvitedTo(querySnapshot.docs.map(doc => {
            return {id: doc.id, data: doc.data()}
        }));
    }
    

    async function createFamily (name='no name') {
        try {
            
            await addDoc (families, {name: name, admin: doc(users, user.uid), users:[doc(users, user.uid)]});
            await getFamilies();

        } catch (e) {
            console.error("Error making family: ", e);
        }
    }

    async function deleteFamily (id) {
        try {
            await deleteDoc(doc(families, id));
        } catch (e) {
            console.error("Error deleting family: ", e);
        }
        await getFamilies();
    }

    async function inviteReaction(id, answer) {
        const ref = doc(families, id);
        try {
            await updateDoc(ref, {invited: arrayRemove(doc(users,user.uid))});
            if (answer) {
                await updateDoc(ref, {users: arrayUnion(doc(users, user.uid))});
                getFamilies();
            }
            getInvites();
        } catch (e) {
            console.log('error accepting invite ', e)
        }   
    }


    return <div>
        <FamiliesList 
            familiesUserIsIn={familiesUserIsIn}
            deleteFamily={deleteFamily}
        />

        <FamiliesPendingInvite 
            familierUserInvitedTo={familierUserInvitedTo}
            inviteReaction={inviteReaction}
        />
        
        <CreateFamily
            createFamily={createFamily}
        />
    </div>

}
import { addDoc, doc } from "firebase/firestore";
import React, { useContext } from "react";
import { families, users } from './firebaseCustom';
import UserContext from './userContext';




export default function FamiliesList () {

    const user = useContext (UserContext);
    

    async function createFamily (name='no name') {
        try {
            await addDoc (families, {name: name, admin: doc(users, user.uid), users:[doc(users, user.uid)]});

        } catch (e) {
            console.error("Error making family: ", e);
        }

    }

    return <div>
        <button
        onClick={createFamily}>
            New Family
        </button>
    </div>

}
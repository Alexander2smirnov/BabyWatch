import { addDoc, deleteDoc, doc, getDocs, query, where } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { families, users } from './firebaseCustom';
import UserContext from './userContext';




export default function FamiliesList () {

    const user = useContext (UserContext);
    const [familiesData, setFamiliesData] = useState([]);

    useEffect(() => {
        getFamilies();
        
    }, [user])
    
    async function getFamilies() {
        const q = query (families, where('users', 'array-contains', doc(users, user.uid)))
        const querySnapshot = await getDocs(q);
        setFamiliesData(querySnapshot.docs.map(doc => {
            console.log(doc.data())
            return {id: doc.id, data: doc.data()}}));             
        
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

    return <div>
        <ul>
            {familiesData.map(family => 
            <li 
                key={family.id}
            >
                <Link to={`/family/${family.id}`}>{family.data.name}</Link>
                {family.data.admin.id !== user.uid ? null : 
                <button
                    onClick={() => deleteFamily(family.id)}
                >Delete</button>}
            </li>)}
        </ul>
        <button
        onClick={() => createFamily()}>
            New Family
        </button>
    </div>

}
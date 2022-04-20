import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from './userContext';


export default function FamiliesList({familiesUserIsIn, deleteFamily}) {
    const [tryDeleteFamily, setTryDeleteFamily] = useState();
    const user = useContext(UserContext);

    return <ul>
        {familiesUserIsIn.map(family => 
            <li 
                key={family.id}
            >
                <Link to={`/family/${family.id}`}>{family.data.name}</Link>
                {family.data.admin.id === user.uid && 
                tryDeleteFamily !== family.id && 
                <button
                    onClick={() => setTryDeleteFamily(family.id)}
                >Delete</button>}

                {family.data.admin.id === user.uid && 
                tryDeleteFamily === family.id && 
                <>
                    Are you sure?
                    <button
                        onClick={() => deleteFamily(family.id)}
                    >   
                        Yes
                    </button>
                </>}
            </li>)}
        </ul>

}
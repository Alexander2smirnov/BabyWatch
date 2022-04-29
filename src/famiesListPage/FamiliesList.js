import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import UserContext from '../userContext';


export default function FamiliesList({familiesUserIsIn, deleteFamily}) {
   const [tryDeleteFamily, setTryDeleteFamily] = useState();
   const user = useContext(UserContext);

   return <div className="families-list">
      <ul>
         {familiesUserIsIn.map(family => 
         <li 
            key={family.id}
         >   
            <div className="families-list__families">
               <Link to={`/family/${family.id}`}>{family.data.name}</Link>

               {family.data.admin.id === user.uid && 
               tryDeleteFamily !== family.id && 
               <button
                  className="families-list__delete-button"
                  onClick={() => setTryDeleteFamily(family.id)}
               >
                  Delete
               </button>}

               {family.data.admin.id === user.uid && 
               tryDeleteFamily === family.id && 
               <span className="families-list__delete-confirmation">
                  Are you sure?
                  <button
                     className="families-list__delete-button"
                     onClick={() => deleteFamily(family.id)}
                  >   
                     Yes
                  </button>
               </span>
               }
            </div>
         </li>)}
      </ul>
   </div>
}
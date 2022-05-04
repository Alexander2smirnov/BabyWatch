import  { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DocData, FamilyData } from "../firebaseCustom";
import { RootState } from "../store/store";

interface FamiliesListProps {
   familiesUserIsIn: DocData<FamilyData>[];
   deleteFamily: (id: string) => void;
}

export default function FamiliesList({familiesUserIsIn, deleteFamily}: FamiliesListProps) {
   const [tryDeleteFamily, setTryDeleteFamily] = useState('');
   const user = useSelector((state: RootState) => state.user);

   return <div className="families-list">
      <ul>
         {familiesUserIsIn.map(family => 
         <li 
            key={family.id}
         >   
            <div className="families-list__families">
               <Link to={`/family/${family.id}`}>{family.data.name}</Link>

               {family.data.admin.id === user?.id && 
               tryDeleteFamily !== family.id && 
               <button
                  className="families-list__delete-button"
                  onClick={() => setTryDeleteFamily(family.id)}
               >
                  Delete
               </button>}

               {family.data.admin.id === user?.id && 
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
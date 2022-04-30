import React from "react";
import { DocData } from "../firebaseCustom";

interface FamiliesPending {
   familierUserInvitedTo: DocData[];
   inviteReaction: (id: string, answer: boolean) => void;
}

export default function FamiliesPendingInvite({familierUserInvitedTo, inviteReaction}: FamiliesPending) {
   return <div>
      <ul>
         {familierUserInvitedTo.map(family => 
         <li key={family.id}>
            <div className="families-list__families">
               {family.data.name}
               <span>
                  <button
                     onClick={() => inviteReaction(family.id, true)}
                  >
                     Accept
                  </button>

                  <button style={{marginLeft:"0.2rem"}} 
                     onClick={() => inviteReaction(family.id, false)}
                  >
                     Decline
                  </button>
               </span>
            </div>   
         </li>)}
      </ul>
   </div>
}
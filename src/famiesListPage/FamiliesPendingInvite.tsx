import { DocData, FamilyData } from "../firebaseCustom";

interface FamiliesPending {
   familiesUserInvitedTo: DocData<FamilyData>[];
   inviteReaction: (id: string, answer: boolean) => void;
}

export default function FamiliesPendingInvite({familiesUserInvitedTo, inviteReaction}: FamiliesPending) {
   return <div>
      <ul>
         {familiesUserInvitedTo.map(family => 
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
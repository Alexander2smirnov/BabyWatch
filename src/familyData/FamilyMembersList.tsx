import React, { FormEvent, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { FamilyMember } from "./interfaces";

interface FamilyMembersListProps {
   familyName: string;
   familyAdminId: string;
   familyMembers: FamilyMember[];
   addNewFamilyMember: (email: string) => void
   removeFamilyMember: (familyMember: FamilyMember) => void;
   inputNewMemberError: string;
}

export default function FamilyMembersList
   ({familyName, familyAdminId, familyMembers, addNewFamilyMember, removeFamilyMember, inputNewMemberError}: FamilyMembersListProps) 
{
   const user = useSelector((state: RootState) => state.user);
   const [inputNewMember, setInputNewMember] = useState('');
   
   function submitHandler(event: FormEvent) {
      event.preventDefault();
      addNewFamilyMember(inputNewMember);
      setInputNewMember('');
   }
   
   return <>
      <div>
         <h2>Family: {familyName}</h2>
         <h4>Members:</h4>
         <ul className="calendar-page__members-list"> 
            {familyMembers.map(member => 
               <li 
                  key={'li ' + member.id}
               >
                  {member.name}, {member.email}
                  {user?.id === familyAdminId && 
                  member.id !== familyAdminId && 
                  <button 
                     className='calendar-page__kick-member-button'
                     onClick={() => removeFamilyMember(member)}
                  >
                     Kick
                  </button>}
                  {user?.id !== familyAdminId && 
                  user?.id === member.id && 
                  <button
                     className='calendar-page__kick-member-button'
                     key={'leave ' + member.id}
                     onClick={() => removeFamilyMember(member)}
                  >
                     Leave family
                  </button>}
               </li> 
            )}
         </ul>
      </div>
      <form onSubmit={submitHandler}>
         <input 
            type='text'
            placeholder={'Add family member'}
            onChange={(event) => {setInputNewMember(event.target.value)}}
            value={inputNewMember}
         />
         <button type="submit">Send request</button>
      </form>
      <p>{inputNewMemberError}</p>
   </>

}
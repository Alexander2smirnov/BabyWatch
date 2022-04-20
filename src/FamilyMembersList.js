import React, { useContext, useState } from "react";
import UserContext from "./userContext";

export default function FamilyMembersList
({familyName, familyAdminId, familyMembers, addNewFamilyMember, removeFamilyMember}) {
    const user = useContext(UserContext);
    
    const [inputNewMember, setInputNewMember] = useState('');
    const [inputNewMemberError, setInputNewMemberError] = useState();

    function keyUpHandler (event) {
        if (event.key === 'Enter') {
            addNewFamilyMember(inputNewMember);
            setInputNewMember('');
        }
    }
    
    return <>
        <div>Family: {familyName}
            <ul>
                {familyMembers.map(member => 
                    <li 
                        key={'li ' + member.id}
                    >
                        {member.name}, {member.email}
                        {user.uid === familyAdminId && 
                        member.id !== familyAdminId && 
                        <button
                            onClick={() => removeFamilyMember(member)}
                        >
                            Kick
                        </button>}
                        {user.uid !== familyAdminId && 
                        user.uid === member.id && 
                        <button
                            key={'leave ' + member.id}
                            onClick={() => removeFamilyMember(member)}
                        >
                            Leave family
                        </button>}
                    </li> 
                )}
            </ul>
        </div>
        <input 
            type='text'
            placeholder={'Add family member'}
            onChange={(event) => {setInputNewMember(event.target.value)}}
            onKeyUp={keyUpHandler}
            value={inputNewMember}
        />
        {inputNewMemberError}
    </>

}
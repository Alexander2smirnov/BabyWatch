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
        <div>
            <h2>Family: {familyName}</h2>
            <h4>Members:</h4>
            <ul className="calendar-page__members-list"> 
                {familyMembers.map(member => 
                    <li 
                        key={'li ' + member.id}
                    >
                        {member.name}, {member.email}
                        {user.uid === familyAdminId && 
                        member.id !== familyAdminId && 
                        <button 
                            className='calendar-page__kick-member-button'
                            onClick={() => removeFamilyMember(member)}
                        >
                            Kick
                        </button>}
                        {user.uid !== familyAdminId && 
                        user.uid === member.id && 
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
        <form>
        <input 
            type='text'
            placeholder={'Add family member'}
            onChange={(event) => {setInputNewMember(event.target.value)}}
            onKeyUp={keyUpHandler}
            value={inputNewMember}
        />
        <button type="submit">Send request</button>
        </form>
        {inputNewMemberError}
    </>

}
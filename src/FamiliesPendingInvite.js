import React from "react";

export default function FamiliesPendingInvite({familierUserInvitedTo, inviteReaction}) {
    return <ul>
        {familierUserInvitedTo.map(family => 
        <li key={family.id}>
            {family.data.name}
            <button
                onClick={() => inviteReaction(family.id, true)}
            >
                Accept
            </button>
            <button 
                onClick={() => inviteReaction(family.id, false)}
            >
                Decline
            </button>

        </li>)}
    </ul>
}
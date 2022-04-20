import React, { useContext, useEffect, useState } from "react";
import UserContext from "./userContext";

export default function CurrentDayEvents({data, deleteEvent, changeEvent, signForEvent, unsignForEvent}) {
    const user = useContext(UserContext);
    
    const [changeTitle, setChangeTitle] = useState('');
    const [changeTimeStart, setChangeTimeStart] = useState('');
    const [changeTimeEnd, setChangeTimeEnd] = useState('');
    
    const [eventToChange, setEventToChange] = useState();

    useEffect(() => setEventToChange(), [data]);    

    function changeEventHandler(event, obj, setFn) {
        if (event.key === 'Enter' || event.key === undefined) {
            changeEvent(obj.id, changeTimeStart, changeTimeEnd, changeTitle);
            setChangeTitle('');
            setChangeTimeStart('');
            setChangeTimeEnd('');
            setEventToChange(null);
        }
        if (event.key === 'Escape') setFn('');
    }

    return <div>
        {data.map(event => 
        <div 
            key={event.title}
        >   
            {event.title} starts {event.timeStart} ends {event.timeEnd}, {'created by ' + event.creatorName}  
            {user.uid === event.creatorId && 
            <>
                {event === eventToChange ? 
                <>  
                    <br/>
                    <input
                        placeholder={'new title'}
                        onChange={(e) => setChangeTitle(e.target.value)}
                        onKeyUp={(e) => changeEventHandler(e, event, setChangeTitle)}
                        value={changeTitle}
                    />

                    <input
                        placeholder={'time start'}
                        onChange={(e) => setChangeTimeStart(e.target.value)}
                        onKeyUp={(e) => changeEventHandler(e, event, setChangeTimeStart)}
                        value={changeTimeStart}
                    /> 
                    <input
                        placeholder={'time end'}
                        onChange={(e) => setChangeTimeEnd(e.target.value)}
                        onKeyUp={(e) => changeEventHandler(e, event, setChangeTimeEnd)}
                        value={changeTimeEnd}
                    /> 
                    <button
                        onClick={(e) => changeEventHandler(e, event)}
                    >
                        Submit
                    </button>
                </>
                :
                <button
                    onClick={() => {
                        setEventToChange(event);
                        setChangeTitle(event.title);
                        setChangeTimeStart(event.timeStart);
                        setChangeTimeEnd(event.timeEnd);
                    }}
                >
                Change
                </button>}

                <button
                    onClick={() => deleteEvent(event.id)}
                >
                    Delete
                </button>
            </>}
            
            
            {event.signedBy ? <>
                <span> signed by {event.signedByName}</span> 
                {event.signedById === user.uid && 
                <button
                onClick={() => unsignForEvent(event.id)}>
                Unsign    
                </button>}
            </>
            : 
            user.uid !== event.creatorId && 
            <button
                onClick={() => signForEvent(event.id)}
            >
                Sign for the event
            </button>}
        </div>)}
    </div>
}

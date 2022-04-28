import React, { useContext, useEffect, useState } from "react";
import UserContext from "./userContext";
import SelectHours from "./SelectHours";
import SelectMinutes from "./SelectMinutes";

export default function CurrentDayEvents({data, deleteEvent, changeEvent, signForEvent, unsignForEvent}) {
    const user = useContext(UserContext);
    
    const [changeTitle, setChangeTitle] = useState('');
    const [changeHourStart, setChangeHourStart] = useState('');
    const [changeHourEnd, setChangeHourEnd] = useState('');
    const [changeMinuteStart, setChangeMinuteStart] = useState('');
    const [changeMinuteEnd, setChangeMinuteEnd] = useState('');
    
    const [eventToChange, setEventToChange] = useState();

    useEffect(() => setEventToChange(), [data]);    

    function changeEventHandler(event, obj, setFn) {
        if (event.key === 'Enter' || event.key === undefined) {
            const timeStart = changeHourStart + ':' + changeMinuteStart;
            const timeEnd = changeHourEnd + ':' + changeMinuteEnd;
            
            changeEvent(obj.id, timeStart, timeEnd, changeTitle);
            setChangeTitle('');
            setChangeHourStart('7');
            setChangeMinuteStart('00');
            setChangeHourEnd('10');
            setChangeMinuteEnd('00')
            setEventToChange(null);
        }
        if (event.key === 'Escape') setFn('');
    }

    return <div>
        {data.map(event => 
        <div 
            className='calendar-page__event'
            key={event.title}
        >   
            <span>
                {event.title}, {event.timeStart} - {event.timeEnd}, {'created by ' + event.creatorName}  
            </span>
            {user.uid === event.creatorId && 
            <span>
                {event === eventToChange && 
                <span>  
                    <input
                        placeholder={'New title'}
                        onChange={(e) => setChangeTitle(e.target.value)}
                        onKeyUp={(e) => changeEventHandler(e, event, setChangeTitle)}
                        value={changeTitle}
                    />
                    <SelectHours
                        value={changeHourStart}
                        setFn={setChangeHourStart}
                    />
                    <SelectMinutes
                        value={changeMinuteStart}
                        setFn={setChangeMinuteStart}
                    />
                    <SelectHours
                        value={changeHourEnd}
                        setFn={setChangeHourEnd}
                    />
                    <SelectMinutes
                        value={changeMinuteEnd}
                        setFn={setChangeMinuteEnd}
                    />
                    <button
                        className="calendar-page__event-button"
                        onClick={(e) => changeEventHandler(e, event)}
                    >
                        Submit
                    </button>
                </span>}
                {event !== eventToChange &&
                <span>
                    <button
                        className="calendar-page__event-button"
                        onClick={(e) => {
                            setEventToChange(event);
                            setChangeTitle(event.title);
                            const [hourStart, minuteStart] = event.timeStart.split(":");
                            const [hourEnd, minuteEnd] = event.timeEnd.split(":");
                            setChangeHourStart(hourStart || '7');
                            setChangeHourEnd(hourEnd || '10');
                            setChangeMinuteStart(minuteStart || '00');
                            setChangeMinuteEnd(minuteEnd || '00');
                        }}
                    >
                    Change
                    </button>
                    <button
                        className="calendar-page__event-button"
                        onClick={() => deleteEvent(event.id)}
                    >
                        Delete
                    </button>
                </span>}
            </span>}
            
            {event.signedBy ? 
            <>
                <span> signed by {event.signedByName}</span> 
                {event.signedById === user.uid && 
                <button
                    className="calendar-page__event-button"
                    onClick={() => unsignForEvent(event.id)}
                >
                    Unsign    
                </button>}
            </>
            : 
            user.uid !== event.creatorId && 
            <button
                className="calendar-page__event-button"
                onClick={() => signForEvent(event.id)}
            >
                Sign for the event
            </button>}
        </div>)}
    </div>
}

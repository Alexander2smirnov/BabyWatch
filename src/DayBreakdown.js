import React, { useContext, useMemo, useState }  from 'react';
import CreateNewEvent from './CreateNewEvent.js';
import CurrentDayEvents from './CurrentDayEvents.js';
import UserContext from './userContext';


export default function DayBreakdown 
({data, year, month, day, addEvent, deleteEvent, changeEvent, signForEvent, unsignForEvent}) {
    const user = useContext(UserContext);
     
    const current = useMemo(() => {
        return data.filter(obj => obj.month === month && obj.day === day && obj.year == year)
    }, [data, year, month, day]);
   
    return <div>
        <h2>{year} {month} {day}</h2>
        Enter new event:
        <br/>
        <CreateNewEvent
            addEvent={addEvent}
            year={year}
            month={month}
            day={day}
        />
        {!!current.length && <h4>Current events:</h4>}
        <CurrentDayEvents 
            data={current}
            deleteEvent={deleteEvent}
            changeEvent={changeEvent}
            signForEvent={signForEvent}
            unsignForEvent={unsignForEvent}
        />   
    </div>
}




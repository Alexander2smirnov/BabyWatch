import React, { useContext, useState }  from 'react';
import UserContext from './userContext';


export default function DayBreakdown ({data, year, month, day, addEvent, deleteEvent}) {
    const [inputTitle, setInputTitle] = useState('');
    const user = useContext(UserContext);
    

    function keyUp(event) {
        // console.log(event.key);
        if (event.key === 'Enter') {
            addEvent(year, month, day, '12:00', '14:00', inputTitle); 

            setInputTitle('');
        }
        

    }
    const current = data.filter(obj => obj.month === month && obj.day === day && obj.year == year);
    
    
    return <div>
        <h2>{year} {month} {day} </h2>
        <input
            placeholder='Enter task'
            type='text'
            onChange={event => setInputTitle(event.target.value)}
            value={inputTitle}
            onKeyUp={keyUp}
        >
        </input>
       {!!current.length && <h4>Current tasks:</h4>}
        {current.map(obj => 
        <div key={obj.title}>   
            {obj.timeStart}, {obj.timeEnd}, {obj.title} {'created by ' + obj.creatorName} 
            {user.uid === obj.creatorId && 
            <button
                onClick={() => deleteEvent(obj.id)}
            >Delete</button>}
        </div>)}
    </div>

}




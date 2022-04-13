import React, { useState }  from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'


export default function DayBreakdown ({calendar, week, weekDay, addEvent}) {
    const [inputTitle, setInputTitle] = useState('');

    function keyUp(event) {
        console.log(event.key);
        if (event.key === 'Enter') {
            addEvent(week, weekDay, '12:00', '14:00', inputTitle); 

            setInputTitle('');
        }
        

    }

    
    return <div>
        {calendar[week][weekDay].timetable.map((obj) => 
        <div key={obj.title}>   
            {obj.timeStart}, {obj.timeEnd}, {obj.title}
        </div>)}

        <input
            type='text'
            onChange={event => setInputTitle(event.target.value)}
            value={inputTitle}
            onKeyUp={keyUp}
        >
        </input>
    </div>

}
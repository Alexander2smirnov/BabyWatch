import React, { useState }  from 'react';


export default function DayBreakdown ({data, year, month, day, addEvent}) {
    const [inputTitle, setInputTitle] = useState('');

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
            {obj.timeStart}, {obj.timeEnd}, {obj.title}
        </div>)}
    </div>

}
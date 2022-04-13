import React from 'react';

import DayBreakdown from './DayBreakdown';
import EventDisplay from './EventDisplay';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { useEffect , useState} from 'react';
import initialCalendar from './initialCalender';

import './Calendar.css'


export default function CalendarPage () {
    const [calendar, setCalendar] = useState([[{day: null, timetable: [], events: 0}]]);
    const [showDay, setShowDay] = useState(null);
    
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    
    useEffect (() => {
        console.log(date.getMonth());
        const days = daysInMonth(date.getMonth()+1, date.getFullYear())
        setCalendar(initialCalendar(date, days));
        setShowDay(null);
    }, []);
     
    function daysInMonth (month, year) {
        const date = new Date(year, month, 0);
        return date.getDate();
    } 

    function clickHandler (week, weekDay) {
        const current = calendar [week][weekDay];
        if (current.day) setShowDay({week, weekDay})
    }    

    function addEvent (week, day, timeStart, timeEnd, title) {
        const newCalendar = [...calendar];
        newCalendar[week][day].timetable.push({timeStart, timeEnd, title});
        newCalendar[week][day].events++;
        setCalendar(newCalendar);
    }

    

   
    
    return <div>
             
        <table>
        <tbody>
        {calendar.map((tr, w) => { return (
            <tr key={w}>
                {tr.map((td, d) => 
                    <td className={`calendar-cell calendar-cell-${!!calendar[w][d].events}`} 
                        key={w + ' ' + d}
                        onClick={() => clickHandler(w, d)}
                    >
                        {td.day}
                    </td>
                )}
            </tr>)})}
        </tbody>

        </table>
   
        {showDay ? <DayBreakdown 
            calendar={calendar}
            week={showDay.week}
            weekDay={showDay.weekDay} 
            addEvent={addEvent}
             /> : null}

        

        

    </div>


        


   
}
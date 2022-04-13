import React from 'react';

import DayBreakdown from './DayBreakdown';
import EventDisplay from './EventDisplay';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { useEffect , useState} from 'react';
import CalendarDraw from './CalendarDraw';
import './Calendar.css'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export default function CalendarPage () {
    const [data, setData] = useState([]);
    const [showDay, setShowDay] = useState(null);
    const [date, setDate] = useState(new Date());

    const monthNum = date.getMonth();
    const month = months[monthNum];
    const year = date.getFullYear();

    function monthChange (num) {
        const newDate = new Date(date.getTime());
        newDate.setMonth(newDate.getMonth() + num);
        setDate(newDate);
        setShowDay(null);
    }
        
    function cellClickHandler (year, month, day) {
        
        setShowDay({year, month, day})
    }    

    function addEvent (year, month, day, timeStart, timeEnd, title) {
        const newData = [...data];
        newData.push({
            year,
            month,
            day,
            timeStart,
            timeEnd,
            title,
        })
        setData(newData);
        //console.log(newData);
    }


  
 
    return <div>
        <button
            onClick={() => monthChange (-1)}>
            {'<<'}Prev
        </button>
        <button
            onClick={() => monthChange (1)}>
            Next{'>>'}
        </button>
        <h1> {year} {month} </h1>
        
             
        <CalendarDraw
        data={data}
        clickHandler={cellClickHandler}
        shiftDate={date}
        showDay={showDay?.day}
        />
   
        {showDay ? <DayBreakdown 
        data={data}
        day={showDay.day}
        month={month}
        year={year}
        addEvent={addEvent}
             /> : null}

    </div>


        


   
}
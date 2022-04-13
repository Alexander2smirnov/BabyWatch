import React from 'react';

import DayBreakdown from './DayBreakdown';
import EventDisplay from './EventDisplay';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { useEffect , useState} from 'react';
import initialCalendar from './initialCalender';

import './Calendar.css'


export default function CalendarDraw ({data, clickHandler}) {

    const calendar = data;

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
    </div>

}
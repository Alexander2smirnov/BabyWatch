import React, { useMemo } from 'react';
import initialCalendar, { weekShift } from './initialCalender';
import './Calendar.css'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarDraw({data, clickHandler, shiftDate, showDay}) {
   const date = shiftDate;
   const month = months[date.getMonth()];
   const year = date.getFullYear();
   
   const shift = weekShift(date);

   const calendar = useMemo(()=> {
      const days = daysInMonth(date.getMonth()+1, date.getFullYear())
      const newCalendar = initialCalendar(date, days);
   
      for (let obj of data) {
         const week = getWeek(obj.day);
         const weekDay = getWeekDay(obj.day);

         if (obj.month === month) { 
            newCalendar[week][weekDay].timetable.push({
               timeStart: obj.timeStart, 
               timeEnd: obj.timeEnd, 
               title: obj.title
            })
            newCalendar[week][weekDay].events ++;
         }
      }
      return newCalendar;
     
   }, [data, shiftDate]);

   function getWeek (num) {
      return Math.floor((num-1 + shift) / 7);
   }

   function getWeekDay (num) {
      return (num-1 + shift)%7;
   }

   function getDay (week, weekDay) {
      return  week*7 + weekDay - shift + 1;
   }
    
   function daysInMonth (month, year) {
      const date = new Date(year, month, 0);
      return date.getDate();
   } 

   function ifShowDay (w, d) {
      return (getDay(w, d) === showDay);
   } 

   return <div>    
      <table>
         <tbody>
         {calendar.map((tr, w) => { return (
            <tr key={w}>
               {tr.map((td, d) => 
                  <td 
                     className={
                        `calendar-cell 
                        calendar-cell-has-events-${!!calendar[w][d].events}
                        calendar-selected-${ifShowDay(w,d)}
                        calendar-cell-filled-${!!calendar[w][d].day}`} 
                     key={w + ' ' + d}
                     onClick={() => {
                        if (calendar[w][d].day) clickHandler(year, month, getDay(w, d));
                     }}
                  >
                     {td.day}
                  </td>
               )}
            </tr>)})}
         </tbody>
      </table>
   </div>
}
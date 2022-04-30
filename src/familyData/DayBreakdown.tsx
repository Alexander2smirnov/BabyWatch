import React, { useContext, useMemo, useState }  from 'react';
import CreateNewEvent from './CreateNewEvent';
import CurrentDayEvents from './CurrentDayEvents';
// import UserContext from '../userContext';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { EventData } from './interfaces';

interface DayBreakdownProps {
   data: EventData[]; 
   year: number;
   month: string;
   day: number; 
   addEvent: (year: number, month: string, day: number, timeStart: string, timeEnd: string, title: string) => void;
   deleteEvent: (id: string) => void; 
   changeEvent: (id: string, timeStart: string, timeEnd: string, title: string) => void;
   signForEvent: (id: string) => void;
   unsignForEvent: (id: string) => void;
}


export default function DayBreakdown(
   {data, year, month, day, addEvent, deleteEvent, changeEvent, signForEvent, unsignForEvent}: DayBreakdownProps
) {
   // const user = useContext(UserContext);
   const user = useSelector((state: RootState) => state.user);

   const currentDayData = useMemo(() => {
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
      {!!currentDayData.length && <h4>Current events:</h4>}
      <CurrentDayEvents 
         data={currentDayData}
         deleteEvent={deleteEvent}
         changeEvent={changeEvent}
         signForEvent={signForEvent}
         unsignForEvent={unsignForEvent}
      />   
   </div>
}




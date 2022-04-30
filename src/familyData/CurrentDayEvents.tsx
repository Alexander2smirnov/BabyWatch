import React, { Dispatch, KeyboardEvent, SetStateAction, useContext, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { EventData } from "./interfaces";
// import UserContext from "../userContext";
import SelectHours from "./SelectHours";
import SelectMinutes from "./SelectMinutes";

interface CurrentDayEventsProps {
   data: EventData[];
   deleteEvent: (id: string) => void; 
   changeEvent: (id: string, timeStart: string, timeEnd: string, title: string) => void;
   signForEvent: (id: string) => void;
   unsignForEvent: (id: string) => void;
}

export default function CurrentDayEvents(
   {data, deleteEvent, changeEvent, signForEvent, unsignForEvent}: CurrentDayEventsProps
) {
   // const user = useContext(UserContext);
   const user = useSelector((state: RootState) => state.user);

   const [changeTitle, setChangeTitle] = useState('');
   const [changeHourStart, setChangeHourStart] = useState('');
   const [changeHourEnd, setChangeHourEnd] = useState('');
   const [changeMinuteStart, setChangeMinuteStart] = useState('');
   const [changeMinuteEnd, setChangeMinuteEnd] = useState('');
   
   const [eventToChange, setEventToChange] = useState<EventData | null>(null);

   useEffect(() => setEventToChange(null), [data]);   

   function keyUpHandler(e: KeyboardEvent, event: EventData, setFn: Dispatch<SetStateAction<string>>) {
      if (e.key === 'Enter') {
         submitChanges(event);         
      }
      if (e.key === 'Escape') setFn('');
   }

   function submitChanges(event: EventData) {
      if (changeTitle.trim()) {
         const timeStart = changeHourStart + ':' + changeMinuteStart;
         const timeEnd = changeHourEnd + ':' + changeMinuteEnd;
         changeEvent(event.id, timeStart, timeEnd, changeTitle);
         resetChangeStates();
      }

   }

   function resetChangeStates() {
      setChangeTitle('');
      setChangeHourStart('7');
      setChangeMinuteStart('00');
      setChangeHourEnd('10');
      setChangeMinuteEnd('00')
      setEventToChange(null);
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
         {user?.id === event.creatorId && 
         <span>
            {event === eventToChange && 
            <span>  
               <input
                  placeholder={'New title'}
                  onChange={(e) => setChangeTitle(e.target.value)}
                  onKeyUp={(e) => keyUpHandler(e, event, setChangeTitle)}
                  value={changeTitle}
               />
               <SelectHours
                  initialValue={changeHourStart}
                  setFn={setChangeHourStart}
               />
               <SelectMinutes
                  initialValue={changeMinuteStart}
                  setFn={setChangeMinuteStart}
               />
               <SelectHours
                  initialValue={changeHourEnd}
                  setFn={setChangeHourEnd}
               />
               <SelectMinutes
                  initialValue={changeMinuteEnd}
                  setFn={setChangeMinuteEnd}
               />
               <button
                  className="calendar-page__event-button"
                  onClick={(e) => submitChanges(event)}
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
            {event.signedById === user?.id && 
            <button
               className="calendar-page__event-button"
               onClick={() => unsignForEvent(event.id)}
            >
               Unsign   
            </button>}
         </>
         : 
         user?.id !== event.creatorId && 
         <button
            className="calendar-page__event-button"
            onClick={() => signForEvent(event.id)}
         >
            Sign for the event
         </button>}
      </div>)}
   </div>
}

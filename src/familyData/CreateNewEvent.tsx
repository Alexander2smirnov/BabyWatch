import React, { Dispatch, KeyboardEvent, SetStateAction, useEffect, useState } from "react";
import SelectMinutes from "./SelectMinutes";
import SelectHours from "./SelectHours";

interface createEventProps {
   year: number;
   month: string;
   day: number;
   addEvent: (year: number, month: string, day: number, timeStart: string, timeEnd: string, title: string) => void;
}

export default function CreateNewEvent({year, month, day, addEvent}: createEventProps) {
   const [inputTitle, setInputTitle] = useState('');
   const [inputHourStart, setInputHourStart] = useState('');
   const [inputMinuteStart, setInputMinuteStart] = useState('');
   const [inputHourEnd, setInputHourEnd] = useState('');
   const [inputMinuteEnd, setInputMinuteEnd] = useState('');

   function reset() {
      setInputTitle('');
      setInputHourStart('7');
      setInputMinuteStart('00');
      setInputHourEnd('10');
      setInputMinuteEnd('00')
   }

   useEffect(() => reset(), [year, month, day]);

   function submitChanges() {
      if (inputTitle.trim()) {
         const timeStart = inputHourStart + ":" + inputMinuteStart;
         const timeEnd = inputHourEnd + ":" + inputMinuteEnd;
         addEvent(year, month, day, timeStart, timeEnd, inputTitle); 
         reset();
      }
   }

   function keyUpHandler(event: KeyboardEvent, setFn: Dispatch<SetStateAction<string>>) {
      if (event.key === 'Escape') setFn('');
      if (event.key === 'Enter') submitChanges();
   }

   return <div
      className="calendar-page__event-wrap"
   >
      <div
      className="calendar-page__event-inputs-wrap"
      >
         <input
            className="calendar-page__input-event-title"
            placeholder='Enter event title'
            type='text'
            onChange={event => setInputTitle(event.target.value)}
            value={inputTitle}
            onKeyUp={(event) => keyUpHandler(event, setInputTitle)}
         />
         <div
            className='calendar-page__selects-wrap'
         >
            <SelectHours 
               initialValue={inputHourStart}
               setFn={setInputHourStart}
            />
            <SelectMinutes 
               initialValue={inputMinuteStart}
               setFn={setInputMinuteStart}
            />   
            {' : '}
            <SelectHours 
               initialValue={inputHourEnd}
               setFn={setInputHourEnd}
            />
            <SelectMinutes 
               initialValue={inputMinuteEnd}
               setFn={setInputMinuteEnd}
            />
         </div>
      </div>
      <button
         onClick={(event) => submitChanges()}
      >
         Submit
      </button>
   </div>
}

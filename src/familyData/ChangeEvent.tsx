import { KeyboardEvent, useState } from "react";
import { EventData } from "./interfaces";
import SelectHours from "./SelectHours";
import SelectMinutes from "./SelectMinutes";

interface ChangeEventProps {
   event: EventData;
   submitChanges: (event: EventData, timeStart: string, timeEnd: string, title: string) => void;
   discardChanges: () => void;
}

export default function ChangeEvent({event, submitChanges, discardChanges}: ChangeEventProps) {
   const [hourStart, minuteStart] = event.timeStart.split(":");
   const [hourEnd, minuteEnd] = event.timeEnd.split(":");

   const [changeTitle, setChangeTitle] = useState(event.title);
   const [changeHourStart, setChangeHourStart] = useState(hourStart || '7');
   const [changeHourEnd, setChangeHourEnd] = useState(hourEnd || '10');
   const [changeMinuteStart, setChangeMinuteStart] = useState(minuteStart || '00');
   const [changeMinuteEnd, setChangeMinuteEnd] = useState(minuteEnd || '00');
   
   const changeTimeStart = changeHourStart + ':' + changeMinuteStart;
   const changeTimeEnd = changeHourEnd + ':' + changeMinuteEnd;

   function keyUpHandler(e: KeyboardEvent, event: EventData) {
      if (e.key === 'Enter') {
         submitChanges(event, changeTimeStart, changeTimeEnd, changeTitle);         
      }
      if (e.key === 'Escape') setChangeTitle('');
   }

   return (
      <div
      className="calendar-page__event-wrap"
      >  
         <div
            className="calendar-page__event-inputs-wrap"
         >
            <input
               className='calendar-page__input-event-title'
               placeholder={'New title'}
               onChange={(e) => setChangeTitle(e.target.value)}
               onKeyUp={(e) => keyUpHandler(e, event)}
               value={changeTitle}
            />
            <div
            className='calendar-page__selects-wrap'
            >
               <SelectHours
                  initialValue={changeHourStart}
                  setFn={setChangeHourStart}
               />
               <SelectMinutes
                  initialValue={changeMinuteStart}
                  setFn={setChangeMinuteStart}
               />
               {' : '}
               <SelectHours
                  initialValue={changeHourEnd}
                  setFn={setChangeHourEnd}
               />
               <SelectMinutes
                  initialValue={changeMinuteEnd}
                  setFn={setChangeMinuteEnd}
               />
            </div>
         </div>
         <div>
            <button
               className="calendar-page__event-button"
               onClick={(e) => discardChanges()}
            >
               Discard
            </button>

            <button
               className="calendar-page__event-button"
               onClick={(e) => submitChanges(event, changeTimeStart, changeTimeEnd, changeTitle)}
            >
               Submit
            </button>
         </div>

      </div>)
}
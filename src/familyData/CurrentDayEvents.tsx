import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import ChangeEvent from "./ChangeEvent";
import { EventData } from "./interfaces";

interface CurrentDayEventsProps {
   data: EventData[];
   deleteEvent: (id: string) => void; 
   changeEvent: (id: string, timeStart: string, timeEnd: string, title: string) => void;
   signForEvent: (id: string) => void;
   unsignForEvent: (id: string) => void;
}

export default function CurrentDayEvents
({data, deleteEvent, changeEvent, signForEvent, unsignForEvent}: CurrentDayEventsProps) {
   const user = useSelector((state: RootState) => state.user);
   
   const [eventToChange, setEventToChange] = useState<EventData | null>(null);

   useEffect(() => setEventToChange(null), [data]);   

   function submitChanges(event: EventData, timeStart: string, timeEnd: string, title: string) {
      if (title.trim()) changeEvent(event.id, timeStart, timeEnd, title);
   }

   function discardChanges() {
      setEventToChange(null);
   }

   return <ul>
      {data.map(event => 
      <li 
         className='calendar-page__event'
         key={event.title}
      >  
         <div
            className="calendar-page__event-info-and-buttons"
         > 
            <div
               className='calendar-page__event-info'
               onClick={() => {if (user?.id === event.creatorId) setEventToChange(event)}}
            >
               {event !== eventToChange && 
               <>{event.title + ', ' + event.timeStart + ' - ' + event.timeEnd + ', by ' + event.creatorName} 
               {event.signedBy && <> signed by {event.signedByName}</>}</>}
            </div>

            {event.signedById === user?.id && 
            <button
               className="calendar-page__event-button"
               onClick={() => unsignForEvent(event.id)}
            >
               Unsign   
            </button>}
             
            {!event.signedBy && user?.id !== event.creatorId && 
            <button
               className="calendar-page__event-button"
               onClick={() => signForEvent(event.id)}
            >
               Sign for the event
            </button>}

            {user?.id === event.creatorId && event !== eventToChange &&
            <div 
            className="calendar-page__event-edit-buttons-wrap">
               <button
                  className="calendar-page__event-button"
                  onClick={(e) => setEventToChange(event)}
               >
               Change
               </button>

               <button
                  className="calendar-page__event-button"
                  onClick={(e) => deleteEvent(event.id)}
               >
                  Delete
               </button>
            </div>}
         </div>
         <div>
            {event === eventToChange && 
            <ChangeEvent
               submitChanges={submitChanges}
               discardChanges={discardChanges}
               event={event}
            />}
         </div>
      </li>)}
   </ul>
}

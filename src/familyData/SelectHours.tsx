import React, { Dispatch, SetStateAction } from "react";

interface SelectHoursProps {
   initialValue: string;
   setFn: Dispatch<SetStateAction<string>>;
}

export default function SelectHours ({initialValue, setFn}: SelectHoursProps) {
   const hoursArray = [];
   for (let i = 0; i < 24; i++) {
      hoursArray[i] = ((i + 7)%24).toString();
   }   

   return <select 
      value={initialValue} 
      onChange={(event) => setFn(event.target.value)}
   >
      {hoursArray.map(hour => <option key={hour} value={hour}>{hour}</option>)}
   </select>     
}
import React from "react";

export default function SelectHours ({value, setFn}) {
   const hoursArray = [];
   for (let i=0; i < 24; i++) {
      hoursArray[i] = ((i + 7)%24).toString();
   }   

   return <select 
      value={value} 
      onChange={(event) => setFn(event.target.value)}
   >
      {hoursArray.map(hour => <option key={hour} value={hour}>{hour}</option>)}
   </select>     
}
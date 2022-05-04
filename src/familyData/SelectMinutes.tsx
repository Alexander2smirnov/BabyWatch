import React, { Dispatch, SetStateAction } from "react";

interface SelectMinutesProps {
   initialValue: string;
   setFn: Dispatch<SetStateAction<string>>;
}

export default function SelectMinutes({initialValue, setFn}: SelectMinutesProps) {
   return <select 
      value={initialValue} 
      onChange={(event) => setFn(event.target.value)}
   >
      <option value='00'>00</option>
      <option value='10'>10</option>
      <option value='20'>20</option>
      <option value='30'>30</option>
      <option value='40'>40</option>
      <option value='50'>50</option>
   </select>     
}
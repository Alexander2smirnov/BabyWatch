import React from "react";

export default function SelectMinutes ({value, setFn}) {

   return <select 
      value={value} 
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
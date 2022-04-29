import React, { useState } from "react";

export default function CreateFamily({createFamily}) {
   const [inputFamilyName, setInputFamilyName] = useState('');
   const [creatingFamily, setCreatingFamily] = useState(false);

   function keyUpHandler(event) {
      if (!inputFamilyName.trim()) return;
      
      if (event.key === 'Enter' || event.key === undefined) {
         createFamily(inputFamilyName); 
         setInputFamilyName('');
         setCreatingFamily(false);
      }
      if (event.key === 'Escape') {
         setInputFamilyName('');
         setCreatingFamily(false);
      }
   }
   
   return <div className="create-family">
      {!creatingFamily && 
      <button
         onClick={() => setCreatingFamily(true)}
      >
         Create new family
      </button>}

      {creatingFamily && 
      <>
         <input
            placeholder={'Enter family name'}
            onChange={(event) => setInputFamilyName(event.target.value)}
            onKeyUp={(event) => keyUpHandler(event)}
            value={inputFamilyName}
         />
         <button
            onClick={event => keyUpHandler(event)}
         >
            Create family   
         </button>
      </>}
   </div>
}
import { KeyboardEvent, useState } from "react";

interface CreateFamilyProps {
   createFamily: (name: string) => void;
}

export default function CreateFamily({createFamily}: CreateFamilyProps) {
   const [inputFamilyName, setInputFamilyName] = useState('');
   const [creatingFamily, setCreatingFamily] = useState(false);

   function keyUpHandler(event: KeyboardEvent) {
      if (event.key === 'Escape') {
         setInputFamilyName('');
         setCreatingFamily(false);
      }
   }

   function onSubmit() {
      if (!inputFamilyName.trim()) return;
   
      createFamily(inputFamilyName); 
      setInputFamilyName('');
      setCreatingFamily(false);
   }
   
   return <div className="create-family">
      {!creatingFamily && 
      <button
         onClick={() => setCreatingFamily(true)}
      >
         Create new family
      </button>}

      {creatingFamily && 
      <form
         onSubmit={(event) => {
            event.preventDefault();
            onSubmit();
         }}
      >
         <input
            placeholder={'Enter family name'}
            onChange={(event) => setInputFamilyName(event.target.value)}
            onKeyUp={(event) => keyUpHandler(event)}
            value={inputFamilyName}
         />
         <button
            type="submit"
         >
            Create family   
         </button>
      </form>}
   </div>
}

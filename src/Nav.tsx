import { signOut } from 'firebase/auth';
import React from 'react';
import {useNavigate} from 'react-router-dom'
import {auth} from './firebaseCustom';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';
import { RootState } from './store/store';

export default function Nav () {
   const navigate = useNavigate();
   const user = useSelector((state: RootState) => state.user);

   async function logOut () {
      await signOut(auth);
      navigate('/');
   }

   return <div className='header-wrap'>
      <nav>
         <Link to="/">Families</Link>
      </nav>
      <div className='logout-button-wrap'>
         {user?.id && 
         <button
            onClick={logOut}
         >
            LogOut   
         </button>}
      </div>
   </div> 
}


import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import {useNavigate} from 'react-router-dom'
// import UserContext from './userContext';
import {auth} from './firebaseCustom.js';
import { Link } from "react-router-dom";
import { useSelector } from 'react-redux';


export default function Nav () {
   const navigate = useNavigate();
   // const user = useContext(UserContext);
   const user = {id: useSelector(state => state.user.userId)};

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


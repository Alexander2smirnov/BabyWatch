import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserContext from './userContext';
import {auth} from './firebaseCustom.js';




export default function Nav () {
    const user = useContext(UserContext);
    function logout () {
        signOut(auth);
        //console.log(user);
    }

    return <div>Nav
        {user && 
        <button
        onClick={logout}>
            LogOut    
        </button>}
    </div>
}


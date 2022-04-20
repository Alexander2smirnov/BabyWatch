import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import {BrowserRouter as Router, Routes, Route, useNavigate} from 'react-router-dom'
import UserContext from './userContext';
import {auth} from './firebaseCustom.js';




export default function Nav () {
    const navigate = useNavigate();

    const user = useContext(UserContext);
    async function logout () {
        await signOut(auth);
        navigate('/');
        
    }

    return <div>Nav
        {user && 
        <button
        onClick={logout}>
            LogOut    
        </button>}
    </div>
}


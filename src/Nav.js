import { signOut } from 'firebase/auth';
import React, { useContext } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import UserContext from './userContext';
import {auth} from './firebaseCustom.js';




export default function Nav () {
    const user = useContext(UserContext);
    async function logout () {
        await signOut(auth);
        // await fetch('https://oauth2.googleapis.com/revoke=ya29.A0ARrdaM-6YDpeIcDz5MVAOM-xBlc8JJ8PvdjuTUJyLKDDtlagBwGUX84s3kCSqCv05vqgQ59bwCzVtcv1eOmhV3aTR3kAZwJV2Pq7NTnnIO8s8s8HqMe_-EoAeXA3KEWpQqGvLRC4f75-DOM1FlNvZ1pxqf45Wg',
        // {method:'POST',
        // 'content-type': 'application/x-www-form-urlencoded'});
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


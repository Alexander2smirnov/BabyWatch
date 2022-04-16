import './App.css';
import React, { useState, useEffect, useInsertionEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Nav from './Nav';
import CalendarPage from './CalendarPage';
import Welcome from './Welcome';
import FamiliesList from './FamiliesList'
import {auth} from './firebaseCustom.js';
import {onAuthStateChanged} from "firebase/auth";
import UserContext from './userContext';
import { doc, setDoc } from 'firebase/firestore';
import { users } from './firebaseCustom.js';




function App() {
  const [user, setUser] = useState(null);
   
  useEffect(() => {
   
    const authState = onAuthStateChanged(auth, (usr) => {
      console.log('usr', usr);
      setUser(usr || null);  
      if (usr) setDoc(doc(users, usr.uid), {name: usr.displayName, email: usr.email});
    });

    return () => {authState()}
  }, [])

  return (
    <div className="App">
      <UserContext.Provider value={user}>
      <header className="App-header">

        <Nav/>
      </header>
      {user ? <CalendarPage /> : <Welcome />}
     

      </UserContext.Provider>   
      <footer>
      </footer>
    </div>
  );
}

export default App;

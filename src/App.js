import React, { useState, useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Nav from './Nav';
import CalendarPage from './CalendarPage';
import Welcome from './Welcome';
import FamiliesPage from './FamiliesPage'
import { auth } from './firebaseCustom.js';
import { onAuthStateChanged } from "firebase/auth";
import UserContext from './userContext';
import { doc, setDoc } from 'firebase/firestore';
import { users } from './firebaseCustom.js';
import './App.css';


function App() {
  const [user, setUser] = useState(null);
   
  useEffect(() => {
    const authState = onAuthStateChanged(auth, (usr) => {
      setUser(usr || null);  
      if (usr) setDoc(doc(users, usr.uid), {name: usr.displayName, email: usr.email});
    });

    return () => {authState()}
  }, [])

  return (
    <div className="App">
      <Router>
        <UserContext.Provider value={user}>
          <header className="header">
            <Nav/>
          </header>
          <main className="main">
            <div className='main-container'>
              {!user ? <Welcome /> : 
              <Routes>
                <Route path='/' element={<FamiliesPage/>}/>
                <Route path='/family/:familyId' element={<CalendarPage />}/>
              </Routes>}
            </div>
          </main>
        </UserContext.Provider>   
        <footer className='footer'>
        </footer>
      </Router>
    </div>
  );
}

export default App;

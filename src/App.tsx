import { useEffect } from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Nav from './Nav';
import CalendarPage from './familyData/CalendarPage';
import Welcome from './Welcome';
import FamiliesPage from './famiesListPage/FamiliesPage'
import { auth, User, users} from './firebaseCustom';
import { onAuthStateChanged } from "firebase/auth";
import { doc, setDoc } from 'firebase/firestore';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from './store/store'


function App() {
   const dispatch: AppDispatch = useDispatch();
   const user = useSelector((state: RootState) => state.user);

   useEffect(() => {
      const authState = onAuthStateChanged(auth, (usr) => {
         if (!usr) dispatch({type: 'logOut', payload: null});
         else {
            dispatch({type: 'logIn', payload: {id: usr.uid}});
            const userInfo: User = {name: usr.displayName as string, email: usr.email as string};
            setDoc(doc(users, usr.uid), userInfo);
         }
      });
      return () => {authState()};
   }, []);

   return (
      <div className="App">
         <Router>
            <header className="header">
               <Nav/>
            </header>
            <main className="main">
               <div className='main-container'>
                  {!user?.id ? 
                  <Welcome /> : 
                  <Routes>
                     <Route path='/' element={<FamiliesPage/>}/>
                     <Route path='/family/:familyId' element={<CalendarPage />}/>
                  </Routes>}
               </div>
            </main>
            <footer className='footer'>
            </footer>
         </Router>
      </div>
   );
}

export default App;

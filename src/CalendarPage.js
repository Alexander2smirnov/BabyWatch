import React from 'react';
import DayBreakdown from './DayBreakdown';
import EventDisplay from './EventDisplay';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom'
import { useEffect , useState, useContext} from 'react';
import CalendarDraw from './CalendarDraw';
import './Calendar.css'
import { addDoc, getDocs, where, query, deleteDoc, doc} from "firebase/firestore";
import { events } from './firebaseCustom';
import { families, users } from './firebaseCustom';
import UserContext from './userContext';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export default function CalendarPage () {
    const user = useContext (UserContext);
    const [data, setData] = useState([]);
    const [showDay, setShowDay] = useState(null);
    const [date, setDate] = useState(new Date());
    
    const monthNum = date.getMonth();
    const month = months[monthNum];
    const year = date.getFullYear();


    useEffect (() => { getEvents(); },[month])

    
    async function getEvents() {
    
        const q = query (events, where('userId', '==', user.uid), where ('month', '==', month), where('year', '==', year))
        const querySnapshot = await getDocs(q);       
        setData (querySnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})));
    }

    async function getFamilies() {
        const q = query (families, where('user', '==', user.uid))
        const querySnapshot = await getDocs(q);       
        
    }

    function monthChange (num) {
        const newDate = new Date(date.getTime());
        newDate.setMonth(newDate.getMonth() + num);
        setDate(newDate);
        setShowDay(null);
    }
        
    function cellClickHandler (year, month, day) {
        
        setShowDay({year, month, day})
    }    



    async function addEvent (year, month, day, timeStart, timeEnd, title) {
        
        const newEvent = {
            userId:user.uid,
            year,
            month,
            day,
            timeStart,
            timeEnd,
            title,
        };
        
        try {
            await addDoc (events, newEvent);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        getEvents();

        //setData(newData);
    }

    async function deleteEvent (id) {
        try {
            await deleteDoc(doc(events, id));
        } catch (e) {
            console.error("Error deleting document: ", e);
        }
        //console.log(doc(events, id));
        getEvents();
    }




  
 
    return <div>
        <button
            onClick={() => monthChange (-1)}>
            {'<<'}Prev
        </button>
        <button
            onClick={() => monthChange (1)}>
            Next{'>>'}
        </button>
        <br/>
        
        <button 
            
        >
            To families
        </button>

        <h1> {year} {month} </h1>
               
             
        <CalendarDraw
        data={data}
        clickHandler={cellClickHandler}
        shiftDate={date}
        showDay={showDay?.day}
        />
   
        {showDay ? <DayBreakdown 
        data={data}
        day={showDay.day}
        month={month}
        year={year}
        addEvent={addEvent}
        deleteEvent={deleteEvent}
             /> : null}

    </div>


        


   
}
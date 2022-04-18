import React from 'react';
import DayBreakdown from './DayBreakdown';
import EventDisplay from './EventDisplay';
import {BrowserRouter as Router, Routes, Route, Link, useNavigate} from 'react-router-dom'
import { useEffect , useState, useContext} from 'react';
import CalendarDraw from './CalendarDraw';
import './Calendar.css'
import { addDoc, getDocs, where, query, deleteDoc, doc, getDoc, updateDoc, arrayUnion, setDoc, arrayRemove} from "firebase/firestore";
import { events } from './firebaseCustom';
import { families, users } from './firebaseCustom';
import UserContext from './userContext';
import { useParams } from 'react-router-dom';
import { async } from '@firebase/util';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export default function CalendarPage() {
    const params = useParams();
    const navigate = useNavigate();

    const user = useContext(UserContext);
    
    const [familyMembers, setFamilyMembers] = useState([]);
    const [familyAdminId, setFamilyAdminId] = useState();
    const [familyName, setFamilyName] = useState('');
    const [inputNewMember, setInputNewMember] = useState ('');
    const [inputNewMemberError, setInputNewMemberError] = useState(null);
    
    const [data, setData] = useState([]);
    const [showDay, setShowDay] = useState(null);
    const [date, setDate] = useState(new Date());
    
    const monthNum = date.getMonth();
    const month = months[monthNum];
    const year = date.getFullYear();


    useEffect (() => { 
        getEvents(); 
        getFamily();
    },[month, year, params.familyId])


    
    async function getEvents() {
        const q = query (events, 
            where('familyId', '==', params.familyId), 
            where('month', '==', month), 
            where('year', '==', year))
        const querySnapshot = await getDocs(q);       
        setData(await Promise.all(querySnapshot.docs.map(async (docSnapshot) => {
            const eventData = docSnapshot.data();
            return {
                id: docSnapshot.id, 
                ...eventData, 
                creatorName: !eventData.creator ? null : (await getDoc(eventData.creator)).data().name,
                creatorId: eventData.creator?.id,
                signedByName: !eventData.signedBy ? null : (await getDoc(eventData.signedBy)).data().name,
                signedById: eventData.signedBy?.id,
                
                
            }
        })));
    }

    async function getFamily() {
        const querySnapshot = await getDoc(doc(families, params.familyId));
        setFamilyName(querySnapshot.data().name);
        setFamilyAdminId(querySnapshot.data().admin.id);
        const familyRefs = querySnapshot.data().users;
        setFamilyMembers(await Promise.all(familyRefs.map(async (userRef) => {
            const userData = (await getDoc(userRef)).data();
            return {name: userData.name, email: userData.email, id: userRef.id};

        })));

        
    }


    function monthChange (num) {
        const newDate = new Date(date.getTime());
        newDate.setMonth(newDate.getMonth() + num);
        setDate(newDate);
        setShowDay(null);
    }
        
    function cellClickHandler (year, month, day) {
        
        setShowDay({year, month, day});
    }    



    async function addEvent (year, month, day, timeStart, timeEnd, title) {
        
        const newEvent = {
            familyId: params.familyId,
            creator: doc(users, user.uid),
            year,
            month,
            day,
            timeStart,
            timeEnd,
            title,
            signedBy: null,
        };
        
        try {
            await addDoc (events, newEvent);
        } catch (e) {
            console.error("Error adding document: ", e);
        }
        
        getEvents();
    }

    async function changeEvent (id, timeStart, timeEnd, title) {
        try { 
            if (title) await setDoc(doc(events, id), {title}, {merge:true});  //ПЕРЕПИСАТЬ
            if (timeStart) await setDoc(doc(events, id), {timeStart}, {merge:true});
            if (timeEnd) await setDoc(doc(events, id), {timeEnd}, {merge:true});
        } catch (e) {
            console.error("Error changing event: ", e);
        }
       
        getEvents();
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

    function keyUpHandler (event) {
        if (event.key === 'Enter') {
            addNewFamilyMember(inputNewMember);
            setInputNewMember('');
        }
    }

    async function addNewFamilyMember (str) {
        const email = str.trim();
        const q = query (users, where('email', '==', email)); 
           
        const userSnapshot = await getDocs(q);
        if (!userSnapshot.docs.length) setInputNewMemberError('E-mail not found, try again pls');
        else {
            setInputNewMemberError(null);
            const newMemberRef = userSnapshot.docs[0].ref;

            console.log(newMemberRef);

            try {
                await updateDoc(doc(families, params.familyId), {users: arrayUnion(newMemberRef)});
                getFamily();
            }catch {
                console.log('error updating family')
            }

        }


    }

    async function removeFamilyMember (member) {
      
        const memberRef = (await getDoc(doc(users, member.id))).ref;
        await updateDoc(doc(families, params.familyId), {users: arrayRemove(memberRef)});
        if (member.id === user.uid) navigate('/');
        else getFamily();

    }

    async function signForEvent (eventId) {
        await setDoc(doc(events, eventId), {signedBy: doc(users, user.uid)}, {merge:true});
        getEvents();

    }

  
 
    return <div>
        
        <br/>
        <button 
            onClick={() => navigate('/')}
               
        >
            To families
        </button>
        <div>Family: {familyName}
            <ul>
                {familyMembers.map(member => 
                
                    <li 
                        key={'li ' + member.id}
                    >
                        {member.name}, {member.email}
                        {user.uid === familyAdminId && 
                        member.id !== familyAdminId && 
                        <button
                            key={'kick ' + member.id}
                            onClick={() => removeFamilyMember(member)}
                        >
                            Kick
                        </button>}
                        {user.uid !== familyAdminId && 
                        user.uid === member.id && 
                        <button
                            key={'leave ' + member.id}
                            onClick={() => removeFamilyMember(member)}
                        >
                            Leave family
                        </button>}

                    </li>
                    
               
                
                )}

            </ul>
        </div>
        <input 
            type='text'
            placeholder={'Add family member'}
            onChange={(event) => {setInputNewMember(event.target.value)}}
            onKeyUp={keyUpHandler}
            value={inputNewMember}
        >

        </input>
        {inputNewMemberError}
        <br/>
       
        
        <h1> {year} {month} </h1>
        <button
            onClick={() => monthChange (-1)}>
            {'<<'}Prev
        </button>
        <button
            onClick={() => monthChange (1)}>
            Next{'>>'}
        </button>
        <br/>
        <br/>
        
               
             
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
            changeEvent={changeEvent}
            signForEvent={signForEvent}
        /> : null}

    </div>


        


   
}
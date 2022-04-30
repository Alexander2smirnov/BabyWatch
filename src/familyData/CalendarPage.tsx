import React from 'react';
import {useParams, useNavigate} from 'react-router-dom'
import {useEffect , useState, useContext} from 'react';
import {addDoc, getDocs, where, query, deleteDoc, doc, getDoc, updateDoc, arrayUnion, setDoc, arrayRemove} from "firebase/firestore";
import {events, families, users } from '../firebaseCustom';
// import UserContext from '../userContext';
import CalendarDraw from './CalendarDraw';
import FamilyMembersList from './FamilyMembersList';
import DayBreakdown from './DayBreakdown';
import './Calendar.css'
import './calendarPage.css'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarPage() {
   const params = useParams();
   const navigate = useNavigate();

   // const user = useContext(UserContext);
   const user = useSelector((state: RootState) => state.user);

   const [familyMembers, setFamilyMembers] = useState([]);
   const [familyAdminId, setFamilyAdminId] = useState();
   const [familyName, setFamilyName] = useState('');
   const [inputNewMemberError, setInputNewMemberError] = useState();
   
   const [data, setData] = useState([]);
   const [showDay, setShowDay] = useState();
   const [date, setDate] = useState(new Date());
   
   const monthNum = date.getMonth();
   const month = months[monthNum];
   const year = date.getFullYear();

   useEffect (() => { 
      getEvents(); 
      getFamily();
   }, [month, year, params.familyId]);
   
   async function getEvents() {
      const q = query (events, 
         where('familyId', '==', params.familyId), 
         where('month', '==', month), 
         where('year', '==', year));

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
         };
      })));
   }

   async function getFamily() {
      const querySnapshot = await getDoc(doc(families, params.familyId));
      const familyRefs = querySnapshot.data().users;
      
      setFamilyName(querySnapshot.data().name);
      setFamilyAdminId(querySnapshot.data().admin.id);
      setFamilyMembers(await Promise.all(familyRefs.map(async (userRef) => {
         const userData = (await getDoc(userRef)).data();
         return {name: userData.name, email: userData.email, id: userRef.id};
      })));
   }

   function monthChange(num) {
      const newDate = new Date(date.getTime());
      newDate.setMonth(newDate.getMonth() + num);
      setDate(newDate);
      setShowDay(null);
   }
      
   function cellClickHandler(year, month, day) {
      setShowDay({year, month, day});
   }   

   async function addEvent(year, month, day, timeStart, timeEnd, title) {
      const newEvent = {
         familyId: params.familyId,
         creator: doc(users, user.id),
         year,
         month,
         day,
         timeStart,
         timeEnd,
         title,
         signedBy: null,
      };
      
      try {
         await addDoc(events, newEvent);
      } catch (e) {
         console.error("Error adding document: ", e);
      }
      getEvents();
   }

   async function changeEvent(id, timeStart, timeEnd, title) {
      const newObj = {};
      if (title) newObj.title = title;
      if (timeStart) newObj.timeStart = timeStart;
      if (timeEnd) newObj.timeEnd = timeEnd;
      try { 
         await setDoc(doc(events, id), newObj, {merge:true});
      } catch (e) {
         console.error("Error changing event: ", e);
      }  
      getEvents();
   }

   async function deleteEvent(id) {
      try {
         await deleteDoc(doc(events, id));
      } catch (e) {
         console.error("Error deleting document: ", e);
      }
      getEvents();
   }

   async function addNewFamilyMember(str) {
      const email = str.trim();
      const q = query(users, where('email', '==', email)); 
         
      const userSnapshot = await getDocs(q);
      if (!userSnapshot.docs.length) setInputNewMemberError('E-mail not found, try again pls');
      else {
         setInputNewMemberError("Request succesfully sent");
         const newMemberRef = userSnapshot.docs[0].ref;
         try {
            await updateDoc(doc(families, params.familyId), {invited: arrayUnion(newMemberRef)});
            getFamily();
         } catch (e) {
            console.log('error updating family', e);
         }
      }
   }

   async function removeFamilyMember(member) {
      const memberRef = doc(users, member.id);
      await updateDoc(doc(families, params.familyId), {users: arrayRemove(memberRef)});
      if (member.id === user.id) navigate('/');
      else getFamily();
   }

   async function signForEvent(eventId) {
      await setDoc(doc(events, eventId), {signedBy: doc(users, user.id)}, {merge:true});
      getEvents();
   }
   
   async function unsignForEvent(eventId) {
      await setDoc(doc(events, eventId), {signedBy: null}, {merge:true});
      getEvents();
   }
 
   return <div className='calendar-page'>
      <FamilyMembersList 
         familyName={familyName}
         familyAdminId={familyAdminId}
         familyMembers={familyMembers}
         addNewFamilyMember={addNewFamilyMember}
         removeFamilyMember={removeFamilyMember}
         inputNewMemberError={inputNewMemberError}
      />
      <div className='calendar-layout'>
         <h1> {year} {month} </h1>
         <div className='calendar-page__month-switches'>
            <button
               onClick={() => monthChange (-1)}
            >
               {'<< '}Prev
            </button>
            <button
               onClick={() => monthChange (1)}
            >
               Next{' >>'}
            </button>
         </div>   
         <CalendarDraw
            data={data}
            clickHandler={cellClickHandler}
            shiftDate={date}
            showDay={showDay?.day}
         />
      </div>
      {showDay ? <DayBreakdown 
         data={data}
         day={showDay.day}
         month={month}
         year={year}
         addEvent={addEvent}
         deleteEvent={deleteEvent}
         changeEvent={changeEvent}
         signForEvent={signForEvent}
         unsignForEvent={unsignForEvent}
      /> : null}
   </div>  
}
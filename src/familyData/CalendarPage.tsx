import {useParams, useNavigate} from 'react-router-dom'
import {useEffect , useState} from 'react';
import {addDoc, getDocs, where, query, deleteDoc, doc, getDoc, updateDoc, arrayUnion, setDoc, arrayRemove, DocumentReference} from "firebase/firestore";
import {EventBdData, events, families, FamilyData, User, users } from '../firebaseCustom';
import CalendarDraw from './CalendarDraw';
import FamilyMembersList from './FamilyMembersList';
import DayBreakdown from './DayBreakdown';
import './Calendar.css'
import './calendarPage.css'
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { Day, EventData, FamilyMember } from './interfaces';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function CalendarPage() {
   const params = useParams();
   const navigate = useNavigate();

   const user = useSelector((state: RootState) => state.user);

   const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
   const [familyAdminId, setFamilyAdminId] = useState('');
   const [familyName, setFamilyName] = useState('');
   const [inputNewMemberError, setInputNewMemberError] = useState('');
   
   const [data, setData] = useState<EventData[]>([]);
   const [showDay, setShowDay] = useState<Day | null>(null);
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
         const eventData = docSnapshot.data() as EventBdData;
         const dataCreatorPromise = eventData.creator ? getDoc(eventData.creator) : null;
         const dataSignedByPromise = eventData.signedBy ? getDoc(eventData.signedBy) : null;
         return {
            id: docSnapshot.id, 
            ...eventData, 
            creatorName: dataCreatorPromise ? ((await dataCreatorPromise).data() as User).name : null,
            creatorId: eventData.creator ? eventData.creator.id : null,
            signedByName: dataSignedByPromise ? ((await dataSignedByPromise).data() as User).name : null,
            signedById: eventData.signedBy ? eventData.signedBy.id : null,
         };
      })));
   }

   async function getFamily() {
      const querySnapshot = await getDoc(doc(families, params.familyId));
      const familyData = querySnapshot.data() as FamilyData;
      const familyRefs = familyData.users;
      
      setFamilyName(familyData.name);
      setFamilyAdminId(familyData.admin.id);
      setFamilyMembers(await Promise.all(familyRefs.map(async (userRef) => {
         const userData = (await getDoc(userRef)).data() as FamilyMember;
         return {name: userData.name, email: userData.email, id: userRef.id};
      })));
   }

   function monthChange(num: number) {
      const newDate = new Date(date.getTime());
      newDate.setMonth(newDate.getMonth() + num);
      setDate(newDate);
      setShowDay(null);
   }
      
   function cellClickHandler(year: number, month: string, day: number) {
      setShowDay({year, month, day});
   }   

   async function addEvent
      (year: number, month: string, day: number, timeStart: string, timeEnd: string, title: string) 
   {
      const newEvent = {
         familyId: params.familyId,
         creator: doc(users, user?.id),
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

   async function changeEvent(id: string, timeStart: string, timeEnd: string, title: string) {
      const newEventData: {[key: string]: string} = {};
      
      if (title) newEventData.title = title;
      if (timeStart) newEventData.timeStart = timeStart;
      if (timeEnd) newEventData.timeEnd = timeEnd;
      try { 
         await setDoc(doc(events, id), newEventData, {merge:true});
      } catch (e) {
         console.error("Error changing event: ", e);
      }  
      getEvents();
   }

   async function deleteEvent(id: string) {
      try {
         await deleteDoc(doc(events, id));
      } catch (e) {
         console.error("Error deleting document: ", e);
      }
      getEvents();
   }

   async function addNewFamilyMember(str: string) {
      const email = str.trim();
      const q = query(users, where('email', '==', email)); 
         
      const userSnapshot = await getDocs(q);
      if (!userSnapshot.docs.length) setInputNewMemberError('E-mail not found, try again please');
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

   async function removeFamilyMember(member: FamilyMember) {
      const memberRef = doc(users, member.id);
      await updateDoc(doc(families, params.familyId), {users: arrayRemove(memberRef)});
      if (member.id === user?.id) navigate('/');
      else getFamily();
   }

   async function signForEvent(eventId: string) {
      await setDoc(doc(events, eventId), {signedBy: doc(users, user?.id)}, {merge:true});
      getEvents();
   }
   
   async function unsignForEvent(eventId: string) {
      await setDoc(doc(events, eventId), {signedBy: null}, {merge:true});
      getEvents();
   }
 
   return <div className='calendar-page'>
      <div 
         className='calendar-page__container'
      >
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
               showDay={showDay?.day || null}
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
      <div
         className='calendar-page__chat-wrap'>

      </div>
   </div>  
}
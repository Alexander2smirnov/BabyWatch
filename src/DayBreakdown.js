import React, { useContext, useEffect, useState }  from 'react';
import UserContext from './userContext';


export default function DayBreakdown ({data, year, month, day, addEvent, deleteEvent, changeEvent, signForEvent}) {
    const [inputTitle, setInputTitle] = useState('');
    const [inputTimeStart, setInputTimeStart] = useState('');
    const [inputTimeEnd, setInputTimeEnd] = useState('');

    const [changeTitle, setChangeTitle] = useState('');
    const [changeTimeStart, setChangeTimeStart] = useState('');
    const [changeTimeEnd, setChangeTimeEnd] = useState('');
    
    const [eventToChange, setEventToChange] = useState();
    const user = useContext(UserContext);
    const current = data.filter(obj => obj.month === month && obj.day === day && obj.year == year);

    useEffect (() => {
        setChangeTitle('');
        setChangeTimeEnd('');
        setChangeTimeStart('');
    }, [eventToChange])

    useEffect(() => {
        setEventToChange();
        setInputTitle('');
        setInputTimeStart('');
        setInputTimeEnd('');

    }, [year, month, day])
    

    function changeInputHandler(event, setFn) {
        if (event.key === 'Enter' || event.key === undefined) {
            addEvent(year, month, day, inputTimeStart, inputTimeEnd, inputTitle); 
            setInputTitle('');
            setInputTimeEnd('');
            setInputTimeStart('');

        }
        console.log(event.key === 'Escape');

        if (event.key === 'Escape') setFn('');
        
    }

    function changeEventHandler(event, obj, setFn) {
        if (event.key === 'Enter' || event.key === undefined) {
            //changeEvent ();
            console.log(obj);
            changeEvent(obj.id, changeTimeStart, changeTimeEnd, changeTitle);
            setChangeTimeStart('');
            setChangeTimeEnd('');
            setChangeTitle('');
            setEventToChange(null);
        }

        if (event.key === 'Escape') setFn('');
        
        
    }
    
    return <div>
        <h2>{year} {month} {day} </h2>
        Enter new task:
        <br/>
        <input
            placeholder='Enter task'
            type='text'
            onChange={event => setInputTitle(event.target.value)}
            value={inputTitle}
            onKeyUp={(event) => changeInputHandler(event, setInputTitle)}
        />
         <input
            placeholder='Enter time start'
            type='text'
            onChange={event => setInputTimeStart(event.target.value)}
            value={inputTimeStart}
            onKeyUp={(event) => changeInputHandler(event, setInputTimeStart)}
        />
        
        
         <input
            placeholder='Enter time end'
            type='text'
            onChange={event => setInputTimeEnd(event.target.value)}
            value={inputTimeEnd}
            onKeyUp={(event) => changeInputHandler(event, setInputTimeEnd)}
        />
        <button
            onClick={(event) => changeInputHandler(event)}
        >
            Submit
        </button>
        
       
       {!!current.length && <h4>Current tasks:</h4>}
        {current.map(obj => 
        <div key={obj.title}>   
            {obj.timeStart}, {obj.timeEnd}, {obj.title} {'created by ' + obj.creatorName} 
            {user.uid === obj.creatorId ? 
            <>
                {obj === eventToChange ? 
                <>  
                    <br/>
                    <input
                        placeholder={'new title'}
                        onChange={(event) => setChangeTitle(event.target.value)}
                        onKeyUp={(event) => changeEventHandler(event, obj, setChangeTitle)}
                        value={changeTitle}
                    />

                    <input
                        placeholder={'time start'}
                        onChange={(event) => setChangeTimeStart(event.target.value)}
                        onKeyUp={(event) => changeEventHandler(event, obj, setChangeTimeStart)}
                        value={changeTimeStart}
                    /> 
                    <input
                        placeholder={'time end'}
                        onChange={(event) => setChangeTimeEnd(event.target.value)}
                        onKeyUp={(event) => changeEventHandler(event, obj, setChangeTimeEnd)}
                        value={changeTimeEnd}
                    /> 
                    <button
                        onClick={(event) => changeEventHandler(event, obj)}
                    >
                        Submit
                    </button>
                </>
                :
                <button
                    onClick={() => setEventToChange(obj)}
                >
                Change
                </button>}
                <button
                    onClick={() => deleteEvent(obj.id)}
                >Delete</button>
                {obj.signedBy &&
                <span>signed by {obj.signedByName} </span> 
                }
            </>
            :
            <>
            {obj.signedBy ?
            <span>signed by {obj.signedByName} </span> :
            <button
                onClick={() => signForEvent(obj.id)}
            >
                Sign for the event
            </button>}
            
            </>}
        </div>)}
    </div>

}




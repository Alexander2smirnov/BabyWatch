import React, { useContext, useEffect, useState } from "react";

export default function CreateNewEvent ({year, month, day, addEvent}) {
    const [inputTitle, setInputTitle] = useState('');
    const [inputTimeStart, setInputTimeStart] = useState('');
    const [inputTimeEnd, setInputTimeEnd] = useState('');

    useEffect(() => {
        setInputTitle('');
        setInputTimeStart('');
        setInputTimeEnd('');
    }, [year, month, day])

    function changeInputHandler(event, setFn) {
        if ((event.key === 'Enter' || event.key === undefined) && inputTitle) {
            addEvent(year, month, day, inputTimeStart, inputTimeEnd, inputTitle); 
            setInputTitle('');
            setInputTimeEnd('');
            setInputTimeStart('');
        }
        if (event.key === 'Escape') setFn('');
    }

    return <div>
        <input
            placeholder='Enter event title'
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
    </div>
}

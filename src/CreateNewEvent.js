import React, { useContext, useEffect, useState } from "react";
import SelectMinutes from "./SelectMinutes";
import SelectHours from "./SelectHours";

export default function CreateNewEvent ({year, month, day, addEvent}) {
    const [inputTitle, setInputTitle] = useState('');
    const [inputHourStart, setInputHourStart] = useState('');
    const [inputMinuteStart, setInputMinuteStart] = useState('');
    const [inputHourEnd, setInputHourEnd] = useState('');
    const [inputMinuteEnd, setInputMinuteEnd] = useState('');

    useEffect(() => {
        setInputTitle('');
        setInputHourStart('7');
        setInputMinuteStart('00');
        setInputHourEnd('10');
        setInputMinuteEnd('00')
    }, [year, month, day])

    function changeInputHandler(event, setFn) {
        if ((event.key === 'Enter' || event.key === undefined) && inputTitle.trim()) {
            const timeStart = inputHourStart + ":" + inputMinuteStart;
            const timeEnd = inputHourEnd + ":" + inputMinuteEnd;
            addEvent(year, month, day, timeStart, timeEnd, inputTitle); 
            
            setInputTitle('');
            setInputHourStart('7');
            setInputMinuteStart('00');
            setInputHourEnd('10');
            setInputMinuteEnd('00')
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
        <SelectHours 
            value={inputHourStart}
            setFn={setInputHourStart}
        />
        <SelectMinutes 
            value={inputMinuteStart}
            setFn={setInputMinuteStart}
        />    
        <SelectHours 
            value={inputHourEnd}
            setFn={setInputHourEnd}
        />
        <SelectMinutes 
            value={inputMinuteEnd}
            setFn={setInputMinuteEnd}
        />
        <button
            onClick={(event) => changeInputHandler(event)}
        >
            Submit
        </button>
    </div>
}

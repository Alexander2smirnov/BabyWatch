
export function weekShift (date) {
    const monthStart = new Date (date.getFullYear(), date.getMonth(), 1);
    return (monthStart.getDay() + 6)%7;
} 

export default function initialCalendar (date, days) {
    const shift = weekShift(date);
    const rest = (7 - (shift + days)%7)%7;
    const weekQty = (days + shift + rest)/7;

    const initialCalendar = [];
    let day = 1;
    for (let week = 0; week < weekQty; week++) {      
        initialCalendar [week] = [];      
        for (let weekDay = 0; weekDay < 7; weekDay++)
        {
            if (week === 0 && weekDay < shift || week === weekQty-1  && weekDay > 6 - rest) 
                initialCalendar[week][weekDay] = {day: null, timetable: [], events: 0};
            else {
                initialCalendar[week][weekDay] = {day, timetable: [], events: 0};
                day++;
            }
        }
    }           
    return initialCalendar;
}

import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import {enUS} from "date-fns/locale/en-US"; 
import "react-big-calendar/lib/css/react-big-calendar.css";

// Localizer configuration
const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

// Example events
const myEventsList = [
    {
        start: new Date(2024, 10, 15, 10, 0), 
        end: new Date(2024, 10, 15, 12, 0),
        title: "Special Event",
    },
    {
        start: new Date(2024, 10, 16, 14, 0),
        end: new Date(2024, 10, 16, 15, 30),
        title: "Another Event",
    },
];

export default function MyCalendar() {
    return (
        <div className="App">
            <Calendar
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100vh", padding: "20px" }}
            />
        </div>
    );
}

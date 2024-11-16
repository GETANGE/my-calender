/* eslint-disable @typescript-eslint/no-explicit-any */

import  { useState } from "react";
import { Calendar } from 'primereact/calendar';

export default function InlineDemo() {
    const [date, setDate] = useState(null);

    return (
        <div className="col-span-2  h-screen ">
            <Calendar value={date} onChange={(e:any) => setDate(e.value)} inline showWeek />
        </div>

    )
}
        
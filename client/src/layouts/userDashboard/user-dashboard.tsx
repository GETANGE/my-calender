import Calendar from './../../components/user-dashboard/calender'
import MyCalendar from '@/components/user-dashboard/mainBody'
export default function UserDashboard(){
    return (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-full">
            {/* Left Sidebar */}
            <div className="col-span-12 md:col-span-3  h-screen p-4">
                <Calendar />
            </div>

            {/* Main Content */}
            <div className="col-span-12 md:col-span-6  h-screen p-4">
                    <MyCalendar/>
            </div>

            {/* Right Sidebar */}
            <div className="col-span-12 md:col-span-3 h-screen p-4">
                <h2 className="text-center text-white text-xl"></h2>
            </div>
        </div>
    )
}
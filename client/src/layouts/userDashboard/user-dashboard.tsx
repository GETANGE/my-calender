import Calendar from './../../components/user-dashboard/calender'
import MyCalendar from '@/components/user-dashboard/mainBody'

export default function UserDashboard() {
    return (
        <div className="h-screen w-screen bg-gray-50 flex overflow-hidden">
            {/* Left Sidebar */}
            <div className="w-[550px] bg-white shadow-sm">
                <div className="h-full">
                    <Calendar />
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 bg-white">
                <div className="h-full">
                    <MyCalendar />
                </div>
            </div>
        </div>
    )
}
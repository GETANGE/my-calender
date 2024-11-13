import { Search, CheckCircle, Calendar as CalendarIcon, Bell, Users, Shield, Cloud } from 'lucide-react';
import { SetStateAction, useState } from 'react';
import { Calendar } from 'primereact/calendar';

const HeroSection = () => {
    const [date, setDate] = useState(null);

    return (
        <div className="min-h-screen bg-slate-50 rounded-md">
            {/* Header Section */}
            <header className="flex lg:flex-row flex-col gap-12 lg:gap-10 items-center p-8">
                <div className="w-full lg:w-3/5">
                    <h1 className="text-4xl sm:text-6xl font-semibold leading-tight sm:leading-[70px]">
                        Schedule Your <span className="text-blue-600">Time</span> Wisely
                    </h1>
                    <p className="text-lg text-gray-600 mt-4">
                        Take control of your schedule with our intuitive calendar app. Plan meetings, set reminders, and collaborate with team members - all in one place.
                    </p>
                    <div className="relative my-6">
                        <input 
                            placeholder="Search events and meetings"
                            className="py-3 px-4 w-full outline-none rounded-md border border-gray-200 focus:border-blue-500 transition-colors"
                        />
                        <button className="h-full absolute top-0 right-0 bg-blue-600 px-4 text-white rounded-r-md hover:bg-blue-700 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full sm:w-4/5">
                        <p className="flex items-center gap-2 text-gray-600">
                            <CheckCircle className="text-green-500 w-5 h-5" />
                            Smart Scheduling
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <Shield className="text-green-500 w-5 h-5" />
                            End-to-End Encryption
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <Bell className="text-green-500 w-5 h-5" />
                            Smart Notifications
                        </p>
                        <p className="flex items-center gap-2 text-gray-600">
                            <Cloud className="text-green-500 w-5 h-5" />
                            Cloud Sync
                        </p>
                    </div>
                </div>
                <div>
                    <Calendar value={date} onChange={(e: { value: SetStateAction<null>; }) => setDate(e.value)} inline showWeek style={{width: '458px'}}/>
                </div>
            </header>

            {/* Features Section */}
            <section className="p-8 mt-8 grid sm:grid-cols-2 grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="p-4 rounded-lg hover:bg-white hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <CalendarIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-lg font-medium">Smart Calendar</h4>
                    <p className="text-sm leading-relaxed text-gray-600">
                        Intelligent scheduling with conflict detection and timezone support.
                    </p>
                </div>

                <div className="p-4 rounded-lg hover:bg-white hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <h4 className="text-lg font-medium">Team Collaboration</h4>
                    <p className="text-sm leading-relaxed text-gray-600">
                        Share calendars and coordinate meetings with team members effortlessly.
                    </p>
                </div>

                <div className="p-4 rounded-lg hover:bg-white hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <Bell className="w-6 h-6 text-green-600" />
                    </div>
                    <h4 className="text-lg font-medium">Smart Reminders</h4>
                    <p className="text-sm leading-relaxed text-gray-600">
                        Customizable notifications to keep you on schedule.
                    </p>
                </div>

                <div className="p-4 rounded-lg hover:bg-white hover:shadow-md transition-all">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                        <Cloud className="w-6 h-6 text-orange-600" />
                    </div>
                    <h4 className="text-lg font-medium">Cloud Sync</h4>
                    <p className="text-sm leading-relaxed text-gray-600">
                        Access your calendar from any device with real-time synchronization.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HeroSection;

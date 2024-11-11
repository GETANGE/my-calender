import { FaCalendarAlt, FaListAlt, FaBell, FaMousePointer, FaCalendarCheck } from 'react-icons/fa';

export default function HeroSection() {
    return (
            <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Unlock Your Productivity with Calendery
                </h1>
                <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                    Effortlessly manage your schedule, tasks, and events with our robust calendar features.
                </p>
                </div>
                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
                <div className="flex flex-col items-center">
                    <FaCalendarAlt className="text-gray-500 h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Event Management</h3>
                    <p className="mt-2 text-gray-500">Keep track of all your important events.</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaListAlt className="text-gray-500 h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Task Management</h3>
                    <p className="mt-2 text-gray-500">Stay on top of your to-dos and deadlines.</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaBell className="text-gray-500 h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Reminder Notifications</h3>
                    <p className="mt-2 text-gray-500">Never miss a beat with our smart reminders.</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaMousePointer className="text-gray-500 h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Drag and Drop Events</h3>
                    <p className="mt-2 text-gray-500">Easily organize your schedule with intuitive controls.</p>
                </div>
                <div className="flex flex-col items-center">
                    <FaCalendarCheck className="text-gray-500 h-12 w-12 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900">Customizable Calendars</h3>
                    <p className="mt-2 text-gray-500">Personalize your calendar to fit your needs.</p>
                </div>
                </div>
            </div>
            </div>
    );
}
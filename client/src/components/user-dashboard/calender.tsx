import { useState } from "react";
import { Calendar } from "primereact/calendar";

export default function InlineDemo() {
  const [date, setDate] = useState(null);
  const [selectedCalendar, setSelectedCalendar] = useState(null);

  // Sample events data - to replaced with my actual data.
  const calendarEvents = {
    Birthday: [
      { title: "John's Birthday", date: "2024-11-20", time: "All Day" },
      { title: "Team Celebration", date: "2024-11-25", time: "3:00 PM" },
    ],
    "Daily Sync": [
      { title: "Morning Standup", date: "2024-11-19", time: "9:00 AM" },
      { title: "Project Sync", date: "2024-11-19", time: "2:00 PM" },
    ],
    Events: [
      { title: "Tech Conference", date: "2024-11-22", time: "10:00 AM" },
      { title: "Team Building", date: "2024-11-24", time: "1:00 PM" },
    ],
  };

  const categories = [
    { name: "Personal", color: "bg-blue-100 text-blue-800" },
    { name: "Work", color: "bg-green-100 text-green-800" },
    { name: "Education", color: "bg-purple-100 text-purple-800" },
  ];

  const calendars = [
    { name: "Birthday", color: "bg-pink-100 text-pink-800" },
    { name: "Daily Sync", color: "bg-orange-100 text-orange-800" },
    { name: "Events", color: "bg-teal-100 text-teal-800" },
  ];

  const handleCalendarClick = (calendar) => {
    setSelectedCalendar({
      ...calendar,
      events: calendarEvents[calendar.name] || [],
    });
  };

  return (
    <div className="col-span-1 min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <Calendar
          value={date}
          onChange={(e) => setDate(e.value)}
          inline
          showWeek
          className="w-full"
        />
      </div>

      {/* Categories Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
        <ul className="space-y-3">
          {categories.map((category) => (
            <li key={category.name} className="flex items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${category.color}`}>
                {category.name}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* My Calendar Section */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Calendar</h3>
        <ul className="space-y-3">
          {calendars.map((calendar) => (
            <li key={calendar.name} className="flex items-center">
              <button
                onClick={() => handleCalendarClick(calendar)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${calendar.color} hover:opacity-80 transition-opacity`}
              >
                {calendar.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Events Modal */}
      {selectedCalendar && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              {selectedCalendar.name} Events
            </h2>
            <div className="space-y-4">
              {selectedCalendar.events.map((event, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium">{event.title}</h4>
                  <p className="text-sm text-gray-600">
                    {event.date} at {event.time}
                  </p>
                </div>
              ))}
              {selectedCalendar.events.length === 0 && (
                <p className="text-gray-500 text-center py-2">
                  No events scheduled
                </p>
              )}
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedCalendar(null)}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-200 hover:text-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

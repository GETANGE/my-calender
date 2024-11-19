/* eslint-disable @typescript-eslint/no-explicit-any */
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "primereact/calendar";
import { PiSpinnerBold } from "react-icons/pi";
import { getUserEvents } from "../api";

export default function InlineDemo() {
  const [date, setDate] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fetch events using React Query
  const { data: eventsData, isLoading, isError, error } = useQuery({
    queryKey: ["events"],
    queryFn: getUserEvents,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <PiSpinnerBold className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return <div className="text-red-600">Error: {error.message}</div>;
  }

  // Map events data for the calendar view
  const mappedEvents = eventsData?.data?.events?.map((event:any) => ({
    id: event.id,
    title: event.title,
    description: event.description || "No description provided.",
    startTime: new Date(event.startTime),
    endTime: event.endTime ? new Date(event.endTime) : null,
    colorCode: event.colorCode || "#cccccc", 
    createdBy: event.createdBy,
    imageUrl: event.imageUrl
  }));

  const handleEventClick = (event:any) => {
    setSelectedEvent(event);
  };

  return (
    <div className="col-span-1 min-h-screen bg-gray-50 p-6">
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <Calendar
          value={date}
          onChange={(e:any) => setDate(e.value)}
          inline
          showWeek
          className="w-full"
        />
      </div>

      {/* Event List */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Events</h3>
        <ul className="space-y-3">
          {mappedEvents.map((event: { id: Key | null | undefined; colorCode: any; title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; startTime: { toLocaleDateString: () => string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; toLocaleTimeString: () => string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }; }) => (
            <li
              key={event.id}
              onClick={() => handleEventClick(event)}
              className="flex items-center cursor-pointer hover:bg-gray-100 p-2 rounded-md transition-colors"
            >
              <div
                className="w-4 h-4 rounded-full mr-3"
                style={{ backgroundColor: event.colorCode }}
              ></div>
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-sm text-gray-600">
                  {event.startTime.toLocaleDateString()} -{" "}
                  {event.startTime.toLocaleTimeString()}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Event Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
            <strong>Title :</strong> {selectedEvent.title}
            </h2>
            <p className="text-gray-600 mb-4">
            <strong>Description :</strong> {selectedEvent.description}
            </p>
            <div className="text-sm text-gray-600 mb-4">
              <p>
                <strong>Start Time:</strong>{" "}
                {selectedEvent.startTime.toLocaleString()}
              </p>
              {selectedEvent.endTime && (
                <p>
                  <strong>End Time:</strong>{" "}
                  {selectedEvent.endTime.toLocaleString()}
                </p>
              )}
            </div>
            <div className="text-sm text-gray-600">
              <p>
                <strong>Created By:</strong>
              </p>
              <div className="flex items-center mt-2">
                <img
                  src={selectedEvent.createdBy.imageUrl}
                  alt={selectedEvent.createdBy.name}
                  className="w-10 h-10 rounded-full mr-3"
                />
                <div >
                  <span>{selectedEvent.createdBy.name}</span> <br/>
                  <span>{selectedEvent.createdBy.email}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedEvent(null)}
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
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Calendar } from "primereact/calendar";
import { PiSpinnerBold } from "react-icons/pi";
import UserProfile from "./userProfile";
import { getSingleUser, updateEvent } from "../api";

interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date | null;
  colorCode: string;
  createdBy: string;
  imageUrl?: string;
}

export default function InlineDemo() {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<Event | null>(null);
  const queryClient = useQueryClient();

  // Fetch events
  const { data: eventsData, isLoading, isError } = useQuery({
    queryKey: ["events"],
    queryFn: getSingleUser,
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: updateEvent,
    onSuccess: () => {
      queryClient.invalidateQueries(["events"]);
      setIsEditing(false);
      setEditedEvent(null);
      setSelectedEvent(null);
    },
    onError: (error: any) => {
      console.error("Failed to update event", error);
      setIsEditing(false);
    },
  });

  // Handlers
  const handleInputChange = (field: string, value: any) => {
    setEditedEvent((prev) => prev ? ({ ...prev, [field]: value }) : null);
  };

  const handleSaveChanges = async () => {
    if (!editedEvent || !selectedEvent?.id) return;
    
    // Validate required fields
    if (!editedEvent.title || !editedEvent.startTime) {
      alert('Title and Start Time are required fields');
      return;
    }
  
    try {
      // Format dates for API
      const formattedEvent = {
        ...editedEvent,
        startTime: editedEvent.startTime.toISOString(),
        endTime: editedEvent.endTime?.toISOString() || null,
      };
  
      console.log('Submitting event data:', {
        id: selectedEvent.id,
        eventData: formattedEvent,
      });
  
      await updateEventMutation.mutateAsync({
        id: selectedEvent.id,
        eventData: formattedEvent,
      });
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleCancelEditing = () => {
    const hasChanges = JSON.stringify(editedEvent) !== JSON.stringify(selectedEvent);
    
    if (hasChanges) {
      const confirm = window.confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirm) return;
    }
    
    setIsEditing(false);
    setEditedEvent(null);
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setEditedEvent(event);
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <PiSpinnerBold className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 flex justify-center items-center min-h-screen">
        Error loading events. Please try again later.
      </div>
    );
  }

  const mappedEvents = eventsData?.data.events?.map((event: any) => ({
    id: event.id,
    title: event.title,
    description: event.description || "No description provided.",
    startTime: new Date(event.startTime),
    endTime: event.endTime ? new Date(event.endTime) : null,
    colorCode: event.colorCode || "#cccccc",
    createdBy: event.createdBy,
    imageUrl: event.imageUrl,
  }));

  return (
    <div className="col-span-1 min-h-screen bg-gray-50 p-6">
      {/* Calendar Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <Calendar
          value={date}
          onChange={(e: any) => setDate(e.value)}
          inline
          showWeek
          className="w-full"
        />
      </div>

      {/* Event List */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Events</h3>
        <ul className="space-y-3">
          {mappedEvents?.slice(0, 4).map((event: Event) => (
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
          <div className="bg-white rounded-lg shadow-lg w-1/3 p-6 max-h-[90vh] overflow-y-auto">
            {!isEditing ? (
              // View Mode
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  {selectedEvent.title}
                </h2>
                <p className="text-gray-600 mb-4">
                  {selectedEvent.description}
                </p>
                <div className="text-sm text-gray-600 mb-4">
                  <p className="mb-2">
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
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-300 hover:text-black"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setSelectedEvent(null)}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 ml-2"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              // Edit Mode
              <>
                <h2 className="text-lg font-bold text-gray-800 mb-4">
                  Edit Event
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      value={editedEvent?.title || ""}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Description
                    </label>
                    <textarea
                      value={editedEvent?.description || ""}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      className="w-full border rounded-lg p-2 min-h-[100px]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      Start Time *
                    </label>
                    <input
                      type="datetime-local"
                      value={editedEvent?.startTime?.toISOString().slice(0, -1) || ""}
                      onChange={(e) => handleInputChange("startTime", new Date(e.target.value))}
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">
                      End Time
                    </label>
                    <input
                      type="datetime-local"
                      value={editedEvent?.endTime?.toISOString().slice(0, -1) || ""}
                      onChange={(e) => handleInputChange("endTime", new Date(e.target.value))}
                      className="w-full border rounded-lg p-2"
                    />
                  </div>
                </div>

                {updateEventMutation.isError && (
                  <div className="mt-4 text-red-600">
                    Failed to save changes. Please try again.
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    disabled={updateEventMutation.isPending}
                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-300 hover:text-black disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {updateEventMutation.isPending ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    onClick={handleCancelEditing}
                    disabled={updateEventMutation.isPending}
                    className="px-4 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 ml-2 disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <UserProfile />
    </div>
  );
}
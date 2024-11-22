/* eslint-disable @typescript-eslint/no-explicit-any */
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createEvent } from "../api";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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

// this should come from the database.
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
  const [formVisible, setFormVisible] = useState(false);
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: null,
    endTime: null,
    collaborators: [],
    editSessions: [],
  });

  const create_Event = useMutation(createEvent, {
    onSuccess: () => {
      setFormVisible(false);
      setFormData({
        title: "",
        description: "",
        startTime: null,
        endTime: null,
        collaborators: [],
        editSessions: [],
      });
      toast.success(`Event created successfully`);
      setError("");
    },
    onError: (error: any) => {
      console.error("Error creating an event", error);
      toast.error(error.data.message)
      setError(
        error?.response?.data?.message ||
          "Event creation failed. Please try again."
      );
    },
  });

  const handleSlotClick = (slotInfo: any) => {
    if (slotInfo.start && slotInfo.end) {
      setFormData({
        ...formData,
        startTime: slotInfo.start,
        endTime: slotInfo.end,
      });
      setFormVisible(true);
    } else {
      console.error("Invalid slot selection");
    }
  };
  

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        [name]: value,
      };
      return updatedData;
    });
  };

  // const handleArrayChange = (
  //   field: "collaborators" | "editSessions",
  //   value: string
  // ) => {
  //   setFormData((prevData) => ({
  //     ...prevData,
  //     [field]: [...prevData[field], value],
  //   }));
  // };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!formData.title || !formData.startTime || !formData.endTime) {
      setError("Title, start time, and end time are required.");
      return;
    }
  
    const formattedStartTime = new Date(formData.startTime).toISOString();
    const formattedEndTime = new Date(formData.endTime).toISOString();
  
    create_Event.mutate(
      {
        title: formData.title,
        description: formData.description,
        startTime: formattedStartTime,
        endTime: formattedEndTime,
        collaborators: formData.collaborators.map((id) => ({ id })),
        editSessions: formData.editSessions.map((id) => ({ id })),
      },{
        onSuccess:()=>{
          queryClient.invalidateQueries({
            queryKey: ['events']
          })
        }
      }
    );
  };

  return (
    <div className="relative">
      <Calendar
        className="h-full bg-white rounded-lg shadow-sm overflow-hidden"
        localizer={localizer}
        events={myEventsList}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSlotClick}
        style={{ height: "100vh", padding: "20px" }}
      />

      {/* Modal for creating an event */}
      {formVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Create Event</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block font-medium text-gray-700"
                >
                  Title:
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label
                  htmlFor="description"
                  className="block font-medium text-gray-700"
                >
                  Description:
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  Start Time:
                </label>
                <input
                  type="text"
                  value={formData.startTime ? formData.startTime : ""}
                  disabled
                  className="w-full border bg-gray-100 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  End Time:
                </label>
                <input
                  type="text"
                  value={formData.endTime ? formData.endTime.toString() : ""}
                  disabled
                  className="w-full border bg-gray-100 rounded-lg px-3 py-2"
                />
              </div>
              {/* <div>
                <label
                  htmlFor="collaborators"
                  className="block font-medium text-gray-700"
                >
                  Collaborators:
                </label>
                <input
                  type="text"
                  id="collaborators"
                  name="collaborators"
                  placeholder="Add collaborator and press Enter"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      e.preventDefault();
                      handleArrayChange("collaborators", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                />
                <ul className="list-disc list-inside mt-2">
                  {formData.collaborators.map((collab, index) => (
                    <li key={index}>{collab}</li>
                  ))}
                </ul>
              </div>
              <div>
                <label
                  htmlFor="editSessions"
                  className="block font-medium text-gray-700"
                >
                  Edit Sessions:
                </label>
                <input
                  type="text"
                  id="editSessions"
                  name="editSessions"
                  placeholder="Add edit session and press Enter"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && e.currentTarget.value) {
                      e.preventDefault();
                      handleArrayChange("editSessions", e.currentTarget.value);
                      e.currentTarget.value = "";
                    }
                  }}
                  className="w-full border rounded-lg px-3 py-2 focus:ring focus:ring-blue-300"
                />
                <ul className="list-disc list-inside mt-2">
                  {formData.editSessions.map((session, index) => (
                    <li key={index}>{session}</li>
                  ))}
                </ul>
              </div> */}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setFormVisible(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-black hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-300 hover:text-black"
                >
                  Create Event
                </button>
              </div>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
}

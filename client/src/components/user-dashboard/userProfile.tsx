import { useQuery } from "@tanstack/react-query";
import { getSingleUser } from "../api";
import { PiSpinnerBold } from "react-icons/pi";
import { BsBell } from "react-icons/bs";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { LuUser } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Notifee from "./notifications";

export default function UserProfile() {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    // Get user data via query keys
    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getSingleUser,
    });

    // Return a loading spinner if data is still loading
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <PiSpinnerBold className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    // Return an error message if there's an error
    if (isError) {
        return (
            <div className="text-red-600 flex justify-center items-center">
                No data available for rendering
            </div>
        );
    }

    // Get full userProfile data safely
    const userProfile = userData?.data;

    // Ensure userProfile is properly populated
    if (!userProfile || !userProfile.name) {
        return (
            <div className="text-red-600 flex justify-center items-center">
                User profile data is missing or incomplete.
            </div>
        );
    }

    // Function to implement logout
    const logOut = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    // Toggle profile modal
    const toggleProfileModal = () => {
        setIsProfileModalOpen(!isProfileModalOpen);
    };

    // handling the notifications modal
    const openModal = ()=>{
        setIsModalOpen(true)
    }

    const closeModal = ()=>{
        setIsModalOpen(false)
    }

    return (
        <div>
            <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 mt-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={userProfile.imageUrl}
                        alt={userProfile.name}
                        className="h-14 w-14 rounded-full"
                    />
                    <p className="text-lg text-gray-500">
                        {userProfile.name}
                    </p>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <BsBell 
                        size={30} 
                        className="cursor-pointer" 
                        onClick={openModal}
                    />

                    { isModalOpen && <Notifee visible={isModalOpen} onClose={closeModal}/>}
                    
                    {/* Settings/Profile Modal Trigger */}
                    <HiOutlineCog6Tooth
                        size={30}
                        onClick={toggleProfileModal}
                        className="hover:cursor-pointer hover:text-gray-700"
                    />

                    {/* Logout */}
                    <MdLogout
                        size={30}
                        onClick={logOut}
                        className="hover:cursor-pointer hover:text-red-600"
                    />
                </div>
            </div>

            {/* Profile Modal */}
            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
                            <button 
                                onClick={toggleProfileModal}
                                className="text-gray-600 hover:text-gray-900"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-6">
                            <img
                                src={userProfile.imageUrl}
                                alt={userProfile.name}
                                className="h-24 w-24 rounded-full mb-4 object-cover"
                            />
                            <h3 className="text-xl font-semibold flex"><LuUser className="m-1"/>{userProfile.name}</h3>
                            <p className="text-green-500">{userProfile.role}</p>
                        </div>

                        <div className="space-y-4">
                            <div className="border-b pb-2">
                                <p className="text-sm text-gray-600"> Email</p>
                                <p className="font-medium">{userProfile.email}</p>
                            </div>
                            <div className="border-b pb-2">
                                <p className="text-sm text-gray-600">Phone Number</p>
                                <p className="font-medium">{userProfile.phoneNumber}</p>
                            </div>
                            <div className="border-b pb-2">
                                <p className="text-sm text-gray-600">Account Status</p>
                                <p className="font-medium text-green-500">
                                    {userProfile.active }
                                </p>
                            </div>
                            <div className="pb-2">
                                <p className="text-sm text-gray-600">Last Modified</p>
                                <p className="font-medium">
                                    {new Date(userProfile.updatedAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

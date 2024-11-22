import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSingleUser, updateUserAPI, deleteUserAPI } from "../api";
import { PiSpinnerBold } from "react-icons/pi";
import { BsBell } from "react-icons/bs";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { User, Edit2, Trash2, Save } from "lucide-react";
import { LuX } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import Notifee from "./notifications";

export default function UserProfile() {
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState<Record<string, string | undefined> | null>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ["userProfile"],
        queryFn: getSingleUser,
    });

    const updateUserMutation = useMutation({
        mutationFn: updateUserAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["userProfile"]);
            setIsEditing(false);
            setEditedProfile(null);
        },
    });

    const deactivateUserMutation = useMutation({
        mutationFn: deleteUserAPI,
        onSuccess: () => {
            queryClient.invalidateQueries(["userProfile"]);
            setIsEditing(false);
            setEditedProfile(null);
            localStorage.removeItem("token");
            navigate("/login");
        },
        onError: (error) => {
            console.error("Failed to deactivate user:", error);
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center">
                <PiSpinnerBold className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-red-600 flex justify-center items-center">
                No data available for rendering
            </div>
        );
    }

    const userProfile = userData?.data;

    if (!userProfile || !userProfile.name) {
        return (
            <div className="text-red-600 flex justify-center items-center">
                User profile data is missing or incomplete.
            </div>
        );
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const toggleProfileModal = () => {
        setIsProfileModalOpen(!isProfileModalOpen);
        setIsEditing(false);
        setEditedProfile(null);
    };

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleEdit = () => {
        setIsEditing(true);
        setEditedProfile({
            name: userProfile.name,
            email: userProfile.email,
            phoneNumber: userProfile.phoneNumber,
            imageUrl: userProfile.imageUrl,
        });
    };

    const handleSave = async () => {
        if (!editedProfile) return;

        try {
            await updateUserMutation.mutateAsync(editedProfile);
        } catch (error) {
            console.error("Failed to update profile:", error);
        }
    };

    const handleInputChange = (field: string, value: string) => {
        setEditedProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const renderProfileField = (label: string, field: string, value: string) => {
        if (isEditing) {
            return (
                <div className="border-b pb-2">
                    <p className="text-sm text-gray-600">{label}</p>
                    <input
                        type="text"
                        value={editedProfile?.[field] || ""}
                        onChange={(e) => handleInputChange(field, e.target.value)}
                        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            );
        }
        return (
            <div className="border-b pb-2">
                <p className="text-sm text-gray-600">{label}</p>
                <p className="font-medium">{value}</p>
            </div>
        );
    };

    return (
        <div>
            <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 mt-6">
                <div className="flex items-center space-x-4">
                    <img
                        src={userProfile.imageUrl}
                        alt={userProfile.name}
                        className="h-14 w-14 rounded-full"
                    />
                    <p className="text-lg text-gray-500">{userProfile.name}</p>
                </div>
                <div className="flex items-center space-x-4">
                    <BsBell size={30} className="cursor-pointer" onClick={openModal} />

                    {isModalOpen && <Notifee visible={isModalOpen} onClose={closeModal} />}

                    <HiOutlineCog6Tooth
                        size={30}
                        onClick={toggleProfileModal}
                        className="hover:cursor-pointer hover:text-gray-700"
                    />

                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <MdLogout size={30} className="hover:cursor-pointer hover:text-red-600" />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to logout? You'll need to sign in again to access your
                                    account.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleLogout}
                                    className="bg-black hover:bg-gray-100 hover:text-black"
                                >
                                    Logout
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>

            {isProfileModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Profile Details</h2>
                            <button
                                onClick={toggleProfileModal}
                                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100"
                            >
                                <LuX size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col items-center mb-6 relative">
                            <img
                                src={isEditing ? editedProfile?.imageUrl : userProfile.imageUrl}
                                alt={userProfile.name}
                                className="h-24 w-24 rounded-full mb-4 object-cover"
                            />
                            <button
                                onClick={isEditing ? handleSave : handleEdit}
                                className="absolute top-0 right-24 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
                                aria-label={isEditing ? "Save profile" : "Edit profile"}
                            >
                                {isEditing ? (
                                    <Save size={16} className="text-green-600" />
                                ) : (
                                    <Edit2 size={16} className="text-blue-600" />
                                )}
                            </button>
                            <h3 className="text-xl font-semibold flex items-center gap-2">
                                <User className="inline" />
                                {isEditing ? editedProfile?.name : userProfile.name}
                            </h3>
                            <p className="text-green-500">{userProfile.role}</p>
                        </div>

                        <div className="space-y-4">
                            {renderProfileField("Name", "name", userProfile.name)}
                            {renderProfileField("Email", "email", userProfile.email)}
                            {renderProfileField("Phone Number", "phoneNumber", userProfile.phoneNumber)}
                        </div>

                        <div className="flex justify-between items-center mt-8">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <button className="text-red-600 border border-red-600 hover:bg-red-600 hover:text-white rounded-lg px-4 py-2">
                                        <Trash2 size={16} className="inline" /> Deactivate
                                    </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirm Account Deactivation</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Are you sure you want to deactivate your account? This action is
                                            irreversible.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction
                                            onClick={() =>
                                                deactivateUserMutation.mutate(userProfile.id)
                                            }
                                            className="bg-red-600 hover:bg-red-700 hover:text-white"
                                        >
                                            Deactivate
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                            <button
                                onClick={toggleProfileModal}
                                className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

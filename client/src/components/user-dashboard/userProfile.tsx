import { useQuery } from "@tanstack/react-query";
import { getSingleUser } from "../api";
import { PiSpinnerBold } from "react-icons/pi";
import { BsBell } from "react-icons/bs";
import { HiOutlineCog6Tooth } from "react-icons/hi2";
import { MdLogout } from "react-icons/md";

export default function UserProfile() {
    // Get user data via query keys
    const { data: userData, isLoading, isError } = useQuery({
        queryKey: ['userProfile'],
        queryFn: getSingleUser,
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

    return (
        <div className="flex justify-between bg-white rounded-lg shadow-sm p-4 mt-6 ">
            <div className="flex w-32 justify-between" >
                <img
                    src={userData?.data?.imageUrl}
                    alt={userData?.data?.name }
                    className="h-14 w-14 rounded-full"
                />
                <p className="text-lg text-gray-500 mt-4">
                    {userData?.data?.name}
                </p>
            </div>
            <div className="flex justify-between w-28">
                {/* settings and notifees */}
                <BsBell size={30}/>
                <HiOutlineCog6Tooth size={30}/>
            </div>
            <div>
                {/* Loggout */}
                <MdLogout size={30}/>
            </div>
        </div>
    );
}

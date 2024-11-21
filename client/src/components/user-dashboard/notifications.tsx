import { useState } from "react";
import { Bell, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";

const notifications = [
    {
        id: 1,
        title: "System Update",
        message: "A new version of the software is available.",
        type: "info",
        timestamp: "2 hours ago",
    },
    {
        id: 2,
        title: "Payment Processed",
        message: "Your monthly subscription has been successfully paid.",
        type: "success",
        timestamp: "1 day ago",
    },
    {
        id: 3,
        title: "Security Alert",
        message: "Suspicious login attempt detected from a new device.",
        type: "warning",
        timestamp: "3 days ago",
    },
];

const getIconByType = (type: string) => {
    const iconProps = { size: 24, className: "mr-3" };
    switch (type) {
        case "success":
            return <CheckCircle color="#10B981" {...iconProps} />;
        case "warning":
            return <AlertTriangle color="#F59E0B" {...iconProps} />;
        case "error":
            return <XCircle color="#EF4444" {...iconProps} />;
        default:
            return <Info color="#3B82F6" {...iconProps} />;
    }
};

export default function Notifee({ visible, onClose }: { visible: boolean; onClose: () => void }) {
    const [activeNotifications, setActiveNotifications] = useState(notifications);

    const handleDismiss = (id: number) => {
        setActiveNotifications(
            activeNotifications.filter((notification) => notification.id !== id)
        );
    };

    if (!visible) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white shadow-md rounded-lg p-4 max-w-md w-full relative">
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                >
                    <XCircle size={24} />
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center">
                        <Bell size={24} className="mr-2" /> Notifications
                    </h2>
                    <span className="text-sm text-gray-500">
                        {activeNotifications.length} new
                    </span>
                </div>

                {activeNotifications.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                        No new notifications
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {activeNotifications.map((notification) => (
                            <li
                                key={notification.id}
                                className="py-3 hover:bg-gray-50 transition-colors duration-200 flex items-start"
                            >
                                {getIconByType(notification.type)}
                                <div className="flex-grow">
                                    <h3 className="font-semibold text-gray-800">
                                        {notification.title}
                                    </h3>
                                    <p className="text-sm text-gray-600">{notification.message}</p>
                                    <span className="text-xs text-gray-400 mt-1">
                                        {notification.timestamp}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDismiss(notification.id)}
                                    className="text-gray-400 hover:text-gray-600 ml-2"
                                >
                                    <XCircle size={20} />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

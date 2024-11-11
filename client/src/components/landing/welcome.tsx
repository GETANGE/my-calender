import { FaArrowRight } from "react-icons/fa6";
import { Button } from "../ui/button";
import Globe from "../ui/globe";
import { motion } from 'framer-motion';
import './../../App.css'

export default function Welcome() {
    return (
        <div className="h-5/6 min-h-screen bg-gradient-to-b from-white flex items-center justify-center px-4 ">
            <div className="container mx-auto flex flex-col-reverse lg:flex-row items-center justify-between gap-12 mb-60">
                {/* Left content */}
                <motion.div 
                    className="flex-1 text-center lg:text-left space-y-6 mt-40"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900">
                        Welcome to 
                        <span className="text-gray-400 ml-2">Calendery!</span>
                    </h1>
                    
                    <div className="space-y-4">
                        <p className="text-xl lg:text-2xl text-gray-600">
                            Your personal calendar, tailored just for you.
                        </p>
                        <p className="text-lg text-gray-500">
                            Organize your time, boost productivity, and never miss an important event.
                        </p>
                    </div>

                    <Button >
                        Get Started <FaArrowRight />
                    </Button>

                    <div className="pt-8 flex justify-center lg:justify-start space-x-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold ">10k+</div>
                            <div className="text-gray-500">Active Users</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold ">50k+</div>
                            <div className="text-gray-500">Events Created</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold ">99%</div>
                            <div className="text-gray-500">Satisfaction</div>
                        </div>
                    </div>
                </motion.div>

                <div>
                    <Globe></Globe>
                </div>

            </div>
        </div>
    );
}
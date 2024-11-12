import { Button } from "@/components/ui/button";
import { FaArrowRight } from "react-icons/fa6";
import { FcCalendar } from "react-icons/fc";
import Welcome from "@/components/landing/welcome";
import HeroSection from "@/components/landing/hero-section";
import Testimonial from "@/components/landing/testimonials";
import  ResponsiveFooter  from "@/components/landing/footer";

export default function Landing(){
    return(
        <>
            <div>
                <header className="flex flex-row justify-evenly mt-6 m-2">
                    <div className="flex flex-row space-x-4 text-gray-500 text-1xl font-bold"><FcCalendar size={30}/> <h2>Calendery</h2></div>
                    <nav className="flex justify-between space-x-4 mx-8 w-1/4 text-gray-500 text-1xl font-bold">
                        <a href="#">Home</a>
                        <a href="#">Services</a>
                        <a href="#">Testimonials</a>
                        <a href="#">Contact</a>
                    </nav>
                    <div className="flex space-x-6 text-gray-500 text-1xl font-bold">
                        <Button>Sign In</Button>
                        <Button variant="outline">Get Started <FaArrowRight/></Button>
                    </div>
                </header>
                <div>
                        {/* Welcome */}
                        <Welcome />
                </div>
                <div>
                    {/* Hero Section */}
                    <HeroSection />
                </div>
                <div>
                    <Testimonial/>
                </div>
                <div>
                    {/* Footer */}
                    <ResponsiveFooter />
                </div>
            </div>
        </>
    )
}
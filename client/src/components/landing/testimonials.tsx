import Marquee from "../ui/marquee";
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

export default function Testimonial() {
  const testimonials = [
    {
      quote: "Calendery has completely transformed the way I manage my schedule and tasks. The intuitive interface and seamless integration of events have been game-changers for my productivity.",
      author: "John Doe, Entrepreneur",
      photo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1980&q=80"
    },
    {
      quote: "As a busy marketing manager, Calendery has helped me stay on top of my hectic schedule. The customizable features and reliable reminders make it the perfect tool for my needs.",
      author: "Jane Smith, Marketing Manager",
      photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
    },
    {
      quote: "Calendery is the only calendar app I trust. The seamless event management and smart reminders have made my life as a software engineer so much easier.",
      author: "Michael Johnson, Software Engineer",
      photo: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1974&q=80"
    },
    {
      quote: "I can't imagine going back to a traditional calendar after using Calendery. The drag-and-drop functionality and team collaboration features have been invaluable for managing my projects.",
      author: "Sarah Lee, Project Manager",
      photo: "https://thumbs.dreamstime.com/b/portrait-young-female-software-developer-busy-startup-office-her-multiethnic-business-team-background-142183584.jpg"
    }
  ];

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Hear from Our Satisfied Users
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            See why Calendery is the preferred choice for busy professionals across industries.
          </p>
        </div>
        <Marquee>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-lg p-8 m-4 max-w-md flex flex-col items-center text-center"
            >
              <img
                src={testimonial.photo}
                alt={`${testimonial.author}'s profile`}
                className="w-20 h-20 rounded-full mb-4 shadow-md object-cover"
              />
              <FaQuoteLeft className="text-blue-500 h-6 w-6 mb-4" />
              <p className="text-lg text-gray-700 italic mb-4">{testimonial.quote}</p>
              <FaQuoteRight className="text-blue-500 h-6 w-6 mb-4" />
              <p className="text-gray-500 font-medium">{testimonial.author}</p>
            </div>
          ))}
        </Marquee>
      </div>
    </div>
  );
}
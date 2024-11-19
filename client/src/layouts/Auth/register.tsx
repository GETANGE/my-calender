/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from './../../components/api';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { RiAccountCircleLine, RiLockPasswordLine } from 'react-icons/ri';
import { MdOutlineCall, MdOutlineMail } from 'react-icons/md';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const RegisterForm = () => {
    const [name, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    // Mutation for registering a user
    const mutation = useMutation(registerUser, {
        onSuccess: (data:any) => {
            
            const token = data?.token;
            const userData = data?.data.id

            if (token) {
                localStorage.setItem('token', JSON.stringify({token}));
                localStorage.setItem('userData', JSON.stringify({userData}))
                toast.success("Registration successful!")
                setSuccess('Registration successful!');
                setError(''); 

                navigate('/user-dashboard');
            }else {
                toast.error(data.message)
                setError(data.message);
                setSuccess(''); // Clear success message on error
            }
        },
        onError: (error:any) => {
            toast.error(error.data.message)
            console.log('Registration failed:', error.data.message);
            setSuccess(''); // Clear success message on error
        },
    });

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setSuccess('');
            return;
        }

        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success message
        mutation.mutate({
            name,
            email,
            phoneNumber,
            password
        });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-2 text-gray-700">
                    Register
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Already have an account? Sign in instead.
                </p>

                {success && <p className="text-green-900 text-1xl text-center mb-4">{success}</p>}
                {error && <p className="text-red-500 text-center text-1xl mb-4">{error}</p>}

                {/* Username */}
                <div className="w-full relative mb-4">
                    <RiAccountCircleLine className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        value={name}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Email Field */}
                <div className="w-full relative mb-4">
                    <MdOutlineMail className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                    <input
                        type="email"
                        name="email"
                        id="email"
                        placeholder="Email address"
                        className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                {/* Phone Number */}
                <div className="w-full relative mb-4">
                    <MdOutlineCall className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                    <input
                        type="tel"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="Phone Number"
                        className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                </div>

                {/* Password */}
                <div className="w-full relative mb-4">
                    <RiLockPasswordLine className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                    <input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                {/* Confirm Password */}
                <div className="w-full relative mb-4">
                    <RiLockPasswordLine className="absolute top-3.5 left-3 text-[1.5rem] text-[#777777]" />
                    <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        className="peer border-[#e5eaf2] border rounded-md outline-none pl-10 pr-4 py-3 w-full focus:border-[#3B9DF8] transition-colors duration-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                {/* Submit Button */}
                <Button type="submit" className="w-full py-3 mt-4 bg-black text-white rounded-md hover:bg-slate-100 hover:text-black transition-colors duration-300">
                    Register
                </Button>
            </form>
            <ToastContainer/>
        </div>
    );
};

export default RegisterForm;

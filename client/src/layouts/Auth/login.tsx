/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { LoginUser } from './../../components/api';
import { Button } from '@/components/ui/button';
import { MdOutlineMail } from 'react-icons/md';
import { RiLockPasswordLine } from 'react-icons/ri';
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
    
        // Redirect to user-dashboard if token exists
        if (token) {
            navigate('/user-dashboard');
        }
    
        // Define the event listener function
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                const newToken = localStorage.getItem('token');
                if (newToken) {
                    navigate('/user-dashboard');
                } else {
                    navigate('/login');
                }
            }
        };
    
        // Add the event listener
        window.addEventListener('storage', handleStorageChange);
    
        // Remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };

    }, [navigate]);
    

    // Mutation for logging in a user
    const mutation = useMutation(LoginUser, {
        onSuccess: (data:any) => {

            // get the token from the response.
            const token = data?.token;
            const userData= data?.data.id;

            if (token) {
                localStorage.setItem('token', JSON.stringify({ token }));
                localStorage.setItem('userData', JSON.stringify({userData}));

                toast.success(data.message)
                setSuccess('Login successful!');
                setEmail('');
                setPassword('');

                // Redirect to dashboard
                navigate('/user-dashboard');
            } else {
                console.log(data.message)
                toast.error(data.data.message)
            }
        },
        onError: (error: any) => {
            console.log('Login failed:', error.response.data);
            toast.error(error?.response?.data?.message || 'This user does not exist');
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h2 className="text-2xl font-semibold text-center mb-2 text-gray-700">
                    Login
                </h2>
                <p className="text-center text-sm text-gray-500 mb-6">
                    Don't have an account?{' '}
                    <a
                        href="#"
                        className="text-blue-500 hover:underline"
                        onClick={() => navigate('/signin')}
                    >
                        Sign up instead.
                    </a>
                </p>

                {success && <p className="text-green-900 text-xl text-center mb-4">{success}</p>}

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
                        required
                    />
                </div>

                {/* Password Field */}
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
                        required
                    />
                </div>

                {/* Submit Button */}
                <Button
                    type="submit"
                    className="w-full py-3 mt-4 bg-black text-white rounded-md hover:bg-slate-100 hover:text-black transition-colors duration-300"
                >
                    Login
                </Button>
            </form>
            <ToastContainer/>
        </div>
    );
};

export default LoginForm;

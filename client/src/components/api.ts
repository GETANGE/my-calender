import axios, { AxiosError } from 'axios';

// Define the type for user data
interface UserData_1 {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
}

// Define the type for user data2
interface UserData_2 {
    email: string;
    password: string;
}

// Function to register a user
export const registerUser = async (userData: UserData_1): Promise<string | undefined> => {
    try {
        const url = 'http://localhost:4000/api/v1/users/signup';

        const response = await axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (err) {
        // Handle errors safely
        if (err instanceof AxiosError && err.response) {
            return err.response.data;
        } else {
            console.error('An unknown error occurred:', err);
        }
    }
};

export const LoginUser = async (userData: UserData_2): Promise<string | undefined> => {
    try {
        const url = 'http://localhost:4000/api/v1/users/login';

        const response = await axios.post(url, userData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        return response.data;
    } catch (err) {
        // Handle errors safely
        if (err instanceof AxiosError && err.response) {
            console.log(err.response.data.message);
            return err.response.data;
        } else {
            console.error('An unknown error occurred:', err);
        }
    }
};
/* eslint-disable @typescript-eslint/no-explicit-any */
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

// get a single user profile
export const getSingleUser = async ()=>{
        // get user_id from the local storage
        const userData:any = localStorage.getItem('userData');

        const userDataId = JSON.parse(userData);
        console.log(userDataId)

    try {
        const url = `http://localhost:4000/api/v1/users/${userDataId.userData}`;

        const response = await axios.get(url)
        console.log(response)

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError && err.response) {
            console.log(err.response.data.message);
            return err.response.data;
        } else {
            console.error('An unknown error occurred:', err);
        }
    }
}

// get all events 
export const getEvents = async ()=>{
    try{
        const url = 'http://localhost:4000/api/v1/events';

        const response = await axios.get(url);

        return response.data;
    } catch(err){

        if(err instanceof AxiosError && err.response){
            console.log(err.response.data.message);
            return err.response.data;
        } else {
            console.error('An unknown error occurred:', err);
        }
    }
}

// create events
export const createEvent = async (eventData: unknown) => {
    try {
        // Retrieve the token from localStorage
        const token:any = localStorage.getItem('token'); 

        if (!token) {
            console.log('No token found in localStorage');
        }

        // convert the token to an object.
        const objectToken = JSON.parse(token);
        console.log(objectToken);

        const url = 'http://localhost:4000/api/v1/events';

        const response = await axios.post(url, eventData, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${objectToken.token}`,
            },
        });

        console.log(response);

        return response.data;
    } catch (err) {
        if (err instanceof AxiosError && err.response) {
            console.error('Error from API:', err.response.data.message);
            return err.response.data;
        } else {
            console.error('An unknown error occurred:', err);
            throw err; // Re-throw error for further handling
        }
    }
};


// update events
export const updateEvent = async (eventId: number, eventData: unknown)=>{
    try{
        const url = `http://localhost:4000/api/v1/events/${eventId}`;

        const response = await axios.patch(url, eventData);

        return response.data;
    } catch(err){

        if(err instanceof AxiosError && err.response){
            console.log(err.response.data.message);
            return err.response.data;
        } else {
            console.error('An unknown error occurred:', err);
        }
    }
}

// delete events
export const deleteEvent = async (eventId: number)=>{
    try{
        const url = `http://localhost:4000/api/v1/events/${eventId}`;

        const response = await axios.delete(url);

        return response.data;
    } catch(err){

        if(err instanceof AxiosError && err.response){
            console.log(err.response.data.message);
            return err.response.data;
        } else {
            console.error('An unknown error occurred:', err);
        }
    }
}

// get a single-user
export const getUserEvents = async ()=>{
        // get user_id from the local storage
        const userData:any = localStorage.getItem('userData');

        const userDataId = JSON.parse(userData);
        
    try {
        const url = `http://localhost:4000/api/v1/users/${userDataId.userData}`;

        const response = await axios.get(url);

        console.log(response.data)

        return response.data
    } catch (error) {
        if(error instanceof AxiosError && error.response ){
            return error.response.data
        }else{
            console.log("An unknown error occured")
        }
    }
}
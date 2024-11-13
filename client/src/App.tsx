import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Landing from './layouts/Landing_page/landing';
import AuthForm from './layouts/Auth/login';
import SignIn from './layouts/Auth/register';

export default function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
        <BrowserRouter>
          <Routes>
            {/* Define the routes for each component */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<AuthForm />} />
            <Route path="/signin" element={<SignIn />} />
          </Routes>
      </BrowserRouter>
    </QueryClientProvider>

  );
}

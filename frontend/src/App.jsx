import "./App.css";
import SignUp from "./pages/signup/SignUp";
import SignIn from "./pages/signin/SignIn";
import AdminLogin from "./pages/AdminLogin/AdminLogin";
import CreateProjectAdmin from "./components/CreateProjectAdmin";
import AdminDashboard from "./pages/AdminPage/AdminDashboard";
import { BrowserRouter, Route, Routes } from "react-router";
import Home from "./pages/Home/Home";
import { CounterProvider } from "./contextApi/TotalCountsContext";
import { FormProvider } from "./contextApi/FormContext";
import NotFound from "./pages/ErrorPage/NotFound";
import DisplayAllEvents from "./pages/UserTotalEvents/DisplayAllEvents";
import ProtectedRoute from "./components/ProtectedRoute";
import EachEventDetails from "./components/EachEventDetails";
import AppliedEvent from "./pages/AppliedEvents/AppliedEvent";
import UserAccount from "./pages/Account/UserAccount";
import ProjectsPage from "./components/ProjectPage";
import { Toaster } from "react-hot-toast";
import EachProject from "./components/EachProject";
import AdminAcc from "./pages/AdminAccount/AdminAcc";
import UserAppliedEvents from "./components/UserAppliedEvents";
import UserSavedEvents from "./pages/UserSavedEvents/UserSavedEvents";
import UserAppliedEventsPage from "./pages/UserAppliedEventsPage/UserAppliedEventsPage";
import UserDetailsPage from "./pages/UserDetailsPage/UserDetailsPage";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";



function App() {
  return (

    <CounterProvider>
      <FormProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/projects" element={<ProtectedRoute><ProjectsPage /></ProtectedRoute>} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/user/allevents" element={<ProtectedRoute><DisplayAllEvents /></ProtectedRoute>} />
            <Route path="/user/allevents/:eventid" element={<ProtectedRoute><EachEventDetails /></ProtectedRoute>} />
            <Route path="/events/apply/:eventid" element={<ProtectedRoute><AppliedEvent /></ProtectedRoute>} />
            <Route path="/user/account" element={<ProtectedRoute><UserAccount /></ProtectedRoute>} />
            <Route path="/projects/:id" element={<ProtectedRoute><EachProject /></ProtectedRoute>} />
            <Route path="/adminaccount" element={<AdminAcc />} />
            <Route path="/userappliedevents" element={<UserAppliedEvents />} />
            <Route path="/user/saved-events" element={<ProtectedRoute><UserSavedEvents /></ProtectedRoute>} />
            <Route path="/user/applied-events" element={<ProtectedRoute><UserAppliedEventsPage /></ProtectedRoute>} />
            <Route path="/user/details" element={<ProtectedRoute><UserDetailsPage /></ProtectedRoute>} />
            <Route path="/createproject" element={<CreateProjectAdmin />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </FormProvider>
    </CounterProvider>
  );
}

export default App;



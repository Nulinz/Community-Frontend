import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminLayout from "./layout/admin/AdminLayout";
import { MainProvider } from "./context/MainContext";
import MainLayout from "./layout/MainLayout";
import CollegeLayout from "./layout/college/CollegeLayout";
import CompanyLayout from "./layout/company/CompanyLayout";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ChangePassword from "./pages/auth/CreatePassword";
import HomeLayout from "./layout/HomeLayout";
import Company from "./pages/admin/companyPages/Company";
import Competition from "./pages/admin/events/Competition";
import Conference from "./pages/admin/events/Conference";
import Event from "./pages/admin/events/Event";
import Seminar from "./pages/admin/events/Seminar";
import ProfileForm from "./common/ProfileForm";
import Profile from "./common/Profile";
import JobsProfile from "./common/JobsProfile";
import Internship from "./pages/admin/jobsPages/Internship";
import Freelance from "./pages/admin/jobsPages/Freelance";
import College from "./pages/admin/colegePages/College";
import CollegeProfile from "./pages/admin/colegePages/CollegeProfile";
import CompanyProfile from "./pages/admin/companyPages/CompanyProfile";
import ScrollHandler from "./components/ScrollHandler";
import Dashboard from "./pages/admin/Dashboard";
import CompanyForm from "./components/CompanyForm";
import CollegeForm from "./components/CollegeForm";
import CompetitionForm from "./components/CompetitionForm";
import EventForm from "./components/EventForm";
import SeminarForm from "./components/SeminarForm";
import ConferenceForm from "./components/ConferenceForm"
import FreelanceForm from "./components/FreelanceForm";
import InternshipForm from "./components/InternshipForm";
import CompetitionProfile from "./components/CompetitionProfile";
import SeminarProfile from "./components/SeminarProfile";
import ConferenceProfile from "./components/ConferenceProfile";
import EventProfile from "./components/EventProfile";
import FreelanceProfile from "./components/FreelanceProfile";


const router = createBrowserRouter([
  {
    element: <ScrollHandler />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: "/",
            element: <Navigate to="/auth/login" replace />,
          },
          {
            path: "/auth",
            element: <HomeLayout />,
            children: [
              {
                index: true,
                element: <Navigate to="login" replace />,
              },
              {
                path: "login",
                element: <Login />,
              },
              {
                path: "forgot-password",
                element: <ForgotPassword />,
              },
              {
                path: "change-password",
                element: <ChangePassword />,
              },
            ],
          },
          {
            path: "/admin",
            children: [
              {
                element: <AdminLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="dashboard" replace />,
                  },
                  {
                    path: "dashboard",
                    element: <Dashboard />,
                  },
                  {
                    path: "company",
                    element: <Company module="admin" />,
                  },
                  {
                    path: "company-form",
                    element: <CompanyForm module="admin" />,
                  },
                  {
                    path: "company-profile/:id",
                    element: <CompanyProfile module="admin" />,
                  },
                  {
                    path: "conference-profile/:id",
                    element: <ConferenceProfile />,
                  },
                  {
                    path: "college",
                    element: <College />,
                  },
                  {
                    path: "college-form",
                    element: <CollegeForm />,
                  },
                  {
                    path: "college-profile/:id",
                    element: <CollegeProfile />,
                  },
                  {
                    path: "competition",
                    element: <Competition />,
                  },
                  {
                    path: "competition-form",
                    element: <CompetitionForm />,
                  },
                  {
                    path: "competition-profile/:id",
                    element: <CompetitionProfile />,
                  },
                  {
                    path: "conference",
                    element: <Conference />,
                  },
                  {
                    path: "conference-form",
                    element: <ConferenceForm />,
                  },
                  {
                    path: "events",
                    element: <Event />,
                  },
                  {
                    path: "events-form",
                    element: <EventForm />,
                  },
                  {
                    path: "event-profile/:id",
                    element: <EventProfile />,
                  },
                  {
                    path: "seminar",
                    element: <Seminar />,
                  },
                  {
                    path: "seminar-form",
                    element: <SeminarForm />,
                  },
                  {
                    path: "seminar-profile/:id",
                    element: <SeminarProfile />,
                  },
                  {
                    path: "add-form",
                    element: <ProfileForm />,
                  },
                  {
                    path: "jobs",
                    children: [
                      {
                        path: "add-form",
                        element: <ProfileForm />,
                      },
                      {
                        path: "internship",
                        element: <Internship />,
                      },
                      {
                        path: "internship-form",
                        element: <InternshipForm />,
                      },
                      {
                        path: "internship-profile/:id",
                        element: <JobsProfile />,
                      },
                      {
                        path: "freelance",
                        element: <Freelance />,
                      },
                      {
                        path: "freelance-form",
                        element: <FreelanceForm />,
                      },
                      {
                        path: "freelance-profile/:id",
                        element: <FreelanceProfile/>,
                      },
                    ],
                  },
                ],
              },
            ],
          },
          {
            path: "/college",
            children: [
              {
                element: <CollegeLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="dashboard" replace />,
                  },
                  {
                    path: "dashboard",
                    element: <Dashboard />,
                  },
                  {
                    path: "college",
                    element: <College />,
                  },
                  {
                    path: "college-form",
                    element: <CollegeForm />,
                  },
                ],
              }
            ]

          },
          {
            path: "/company",
            children: [
              {
                element: <CompanyLayout />,
                children: [
                  {
                    index: true,
                    element: <Navigate to="dashboard" replace />,
                  },
                  {
                    path: "dashboard",
                    element: <Dashboard />,
                  },
                  {
                    path: "company",
                    element: <CompanyProfile module="company" />,
                  },
                  {
                    path: "company-form",
                    element: <CompanyForm module="company" />,
                  },
                  {
                    path: "company-profile/:id",
                    element: <CompanyProfile module="company" />,
                  },
                  {
                    path: "company-profile",
                    element: <CompanyProfile module="company" />,
                  },
                  {
                    path: "jobs",
                    children: [
                      {
                        path: "internship",
                        element: <Internship module="company" />,
                      },
                      {
                        path: "internship-form",
                        element: <InternshipForm />,
                      },
                      {
                        path: "internship-profile/:id",
                        element: <JobsProfile module="company" />,
                      },
                      {
                        path: "freelance",
                        element: <Freelance module="company" />,
                      },
                      {
                        path: "freelance-form",
                        element: <FreelanceForm />,
                      },
                      {
                        path: "freelance-profile/:id",
                        element: <FreelanceProfile module="company" />,
                      },
                    ],
                  },
                ],
              },
            ],
          },



        ],
      },
    ],
  },
]);


const App = () => {
  return (
    <div>
      <MainProvider>
        <RouterProvider router={router} />
        <ToastContainer
          position="top-center"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop
        />
      </MainProvider>
    </div>
  );
};

export default App;

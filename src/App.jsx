import { useEffect } from "react"
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom"
import AdminLayout from "./layout/admin/AdminLayout"
import { MainProvider } from "./context/MainContext"
import Login from "./pages/auth/Login"
import ForgotPassword from "./pages/auth/ForgotPassword"
import ChangePassword from "./pages/auth/CreatePassword"
import HomeLayout from "./layout/HomeLayout"
import Company from "./pages/admin/companyPages/Company"
import Competition from "./pages/admin/events/Competition"
import Conference from "./pages/admin/events/Conference"
import Event from "./pages/admin/events/Event"
import Seminar from "./pages/admin/events/Seminar"
import ProfileForm from "./common/ProfileForm"
import Profile from "./common/Profile"
import JobsProfile from "./common/JobsProfile"
import Internship from "./pages/admin/jobsPages/Internship"
import Freelance from "./pages/admin/jobsPages/Freelance"
import College from "./pages/admin/colegePages/College"
import CollegeProfile from "./pages/admin/colegePages/CollegeProfile"
import CompanyProfile from "./pages/admin/companyPages/CompanyProfile"
import ScrollHandler from "./components/ScrollHandler"
import Dashboard from "./pages/admin/Dashboard"


const router = createBrowserRouter([

  {
    element: <ScrollHandler />, // ✅ ONE LINE ONLY
    children: [



      // 1. Auth / Public Routes
      {
        path: "/",
        element: <HomeLayout />,
        children: [
          {
            index: true,
            element: <Login />
          },
          {
            path: "forgot-password",
            element: <ForgotPassword />
          },
          {
            path: "change-password",
            element: <ChangePassword />
          },
        ]
      },

      // 2. Admin / Private Routes
      {
        path: "/admin",
        element: <AdminLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="dashboard" replace />
          },
          {
            path: "dashboard",
            element: <Dashboard/>
          },
          {
            path: "company",
            element: <Company />
          },
          {
            path: "company-profile",
            element: <CompanyProfile />
          },
          {
            path: "college",
            element: <College />
          },
          {
            path: "college-profile",
            element: <CollegeProfile />
          },
          {
            path: "competition",
            element: <Competition />
          },
          {
            path: "competition-profile",
            element: <Profile />
          },

          {
            path: "conference",
            element: <Conference />
          },
          {
            path: "conference-profile",
            element: <Profile />
          },
          {
            path: "events",
            element: <Event />
          },
          {
            path: "events-profile",
            element: <Profile />
          },
          {
            path: "seminar",
            element: <Seminar />
          },
          {
            path: "seminar-profile",
            element: <Profile />
          },
          {
            path: "add-form",
            element: <ProfileForm />
          },





          // /admin/events / add - form
          // --- JOBS SECTION (Sub-routes) ---


          {
            path: "jobs",
            children: [
              {
                path: "add-form",
                element: <ProfileForm />
              },
              {
                path: "internship",
                element: <Internship />
              },
              {
                path: "internship-profile",
                element: <JobsProfile />
              },
              {
                path: "freelance",
                element: <Freelance />
              },
              {
                path: "freelance-profile",
                element: <JobsProfile />
              },
            ]
          },


          // {
          //   path: "users",
          //   element: <Users />
          // }
        ]
      }



    ]}


]);


const App = () => {








  return (
    <div>
      <MainProvider>
        <RouterProvider router={router} />
      </MainProvider>
    </div>
  )
}


export default App

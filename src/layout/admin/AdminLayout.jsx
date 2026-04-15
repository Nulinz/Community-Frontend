// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import Sidebar from './Sidebar'

// const AdminLayout = () => {
//   return (
//     <div className='flex'>

//       <Sidebar />


//       <div className='w-full'>
//         <Outlet />
//       </div>
//     </div>
//   )
// }



// export default AdminLayout










import React from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { assets } from '../../assets/assets'

const AdminLayout = () => {
  const location = useLocation();

  // Logic to capitalize the current route name for the header title
  // e.g., /admin/company -> Company
  const pageTitle = location.pathname.split('/').pop() || 'Dashboard';

  return (
    <div className='flex h-screen overflow-hidden bg-[#F9FAFB]'>
      
      {/* 1. Fixed Sidebar */}
      <div className='flex-shrink-0'>
        <Sidebar />
      </div>

      {/* 2. Main Content Wrapper */}
      <div className='flex-1 flex flex-col min-w-0 h-screen'>
        
        {/* Top Header Section */}
        <header className='flex items-center justify-between px-8 py-4 bg-white border-b-2 border-[#E5E7EB]'>
          <h1 className='text-xl font-bold text-gray-800 capitalize'>
            {pageTitle}
          </h1>
          
          {/* User Profile Section */}
          <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center overflow-hidden border border-gray-100'>
               {/* Replace with your profile icon/image */}
               <span className='text-lg'>👦</span>
            </div>
            <div className='text-left'>
              <p className='text-sm font-bold text-gray-900 leading-none'>Dhanush</p>
              <p className='text-[12px] text-blue-600 font-medium'>Admin</p>
            </div>

          </div>
        </header>

        {/* 3. Dynamic Page Content (Table, etc.) */}
        <main className='scroll-reset-target flex-1 overflow-y-auto p-3'>
          <Outlet />
        </main>

      </div>
    </div>
  )
}

export default AdminLayout






// import React from 'react'
// import { Outlet } from 'react-router-dom'
// import Sidebar from '../components/Sidebar' // Import your CUSTOM component, not the icon

// const AdminLayout = () => {
//   return (
//     // "flex" puts sidebar and main content side-by-side
//     // "min-h-screen" ensures the background covers the full height
//     <div className="flex min-h-screen bg-[#F9FAFB]">
      
//       {/* Sidebar - Width is handled inside the Sidebar component or here */}
//       <div className="flex-shrink-0">
//         <Sidebar />
//       </div>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* You can add a Top Header component here later */}
        
//         <main className="flex-1 overflow-y-auto p-8">
//           <Outlet />
//         </main>
//       </div>

//     </div>
//   )
// }

// export default AdminLayout

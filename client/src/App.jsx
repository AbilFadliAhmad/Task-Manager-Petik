import React from 'react';
import { Routes, Route, useNavigate, Outlet, useLocation, Navigate } from 'react-router-dom';
import { Dashboard, Tasks, Login, Users, Trash, TaskDetails, Activity, AdminSupport } from './pages';
import Layout from './components/Layout';
import Training from './Training/Training';
import {Toaster} from 'react-hot-toast'
import Pengumuman from './pages/Pengumuman';
import CreateAdmin from './pages/CreateAdmin';
// const Layout = () => {

// }
const App = () => {
  return (
    <main className="w-full min-h-screen bg-[#f4f5f6]">
      <Toaster position="top-right" reverseOrder={true} />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/completed/:status" element={<Tasks />} />
          <Route path="/in-progress/:status" element={<Tasks />} />
          <Route path="/todo/:status" element={<Tasks />} />
          <Route path="/team" element={<Users />} />
          <Route path="/trashed" element={<Trash />} />
          <Route path="/announcement" element={<Pengumuman />} />
          <Route path="/task/:id" element={<TaskDetails />} />
          <Route path="/activity" element={<Activity />} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>

        <Route path="/log-in" element={<Login />} />
        <Route path="/Training" element={<Training />} />
        <Route path="/admin-support" element={<AdminSupport />} />
        <Route path="/create-admin" element={<CreateAdmin />} />
      </Routes>

    </main>
  );
};

export default App;

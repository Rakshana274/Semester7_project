import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RoleProtectedRoute } from './components/routing/RoleProtectedRoute';

// Landing Page
import LandingPage from './pages/LandingPage';

// Patient Pages
import PatientLogin from './pages/patient/PatientLogin';
import PatientRegister from './pages/patient/PatientRegister';
import PatientDashboard from './pages/patient/PatientDashboard';
import BookAppointment from './pages/patient/BookAppointment';
import MyAppointments from './pages/patient/MyAppointments';
import AppointmentDetails from './pages/patient/AppointmentDetails';
import PatientNotifications from './pages/patient/PatientNotifications';
import PatientProfile from './pages/patient/PatientProfile';

// Receptionist Pages
import ReceptionistLogin from './pages/receptionist/ReceptionistLogin';
import ReceptionistDashboard from './pages/receptionist/ReceptionistDashboard';
import ReceptionistQueue from './pages/receptionist/ReceptionistQueue';
import PatientSearch from './pages/receptionist/PatientSearch';
import PatientDetails from './pages/receptionist/PatientDetails';
import WalkinRegistration from './pages/receptionist/WalkinRegistration';
import EmergencyAlerts from './pages/receptionist/EmergencyAlerts';

// Doctor Pages
import DoctorLogin from './pages/doctor/DoctorLogin';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorSchedule from './pages/doctor/DoctorSchedule';
import DoctorQueue from './pages/doctor/DoctorQueue';
import PatientQueueDetails from './pages/doctor/PatientQueueDetails';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import DoctorManagement from './pages/admin/DoctorManagement';
import DoctorScheduleAdmin from './pages/admin/DoctorScheduleAdmin';
import OPDSessions from './pages/admin/OPDSessions';
import CapacityManagement from './pages/admin/CapacityManagement';
import WalkinManagement from './pages/admin/WalkinManagement';
import BookingSettings from './pages/admin/BookingSettings';
import Statistics from './pages/admin/Statistics';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Landing & Auth Routes */}
          <Route path="/" element={<LandingPage />} />

          {/* Patient Routes */}
          <Route path="/patient/login" element={<PatientLogin />} />
          <Route path="/patient/register" element={<PatientRegister />} />
          <Route
            path="/patient/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['patient']}>
                <PatientDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient/book"
            element={
              <RoleProtectedRoute allowedRoles={['patient']}>
                <BookAppointment />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments"
            element={
              <RoleProtectedRoute allowedRoles={['patient']}>
                <MyAppointments />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient/appointments/:id"
            element={
              <RoleProtectedRoute allowedRoles={['patient']}>
                <AppointmentDetails />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient/notifications"
            element={
              <RoleProtectedRoute allowedRoles={['patient']}>
                <PatientNotifications />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <RoleProtectedRoute allowedRoles={['patient']}>
                <PatientProfile />
              </RoleProtectedRoute>
            }
          />

          {/* Receptionist Routes */}
          <Route path="/receptionist/login" element={<ReceptionistLogin />} />
          <Route
            path="/receptionist/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/receptionist/queue"
            element={
              <RoleProtectedRoute allowedRoles={['receptionist']}>
                <ReceptionistQueue />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/receptionist/patients"
            element={
              <RoleProtectedRoute allowedRoles={['receptionist']}>
                <PatientSearch />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/receptionist/patients/:id"
            element={
              <RoleProtectedRoute allowedRoles={['receptionist']}>
                <PatientDetails />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/receptionist/walkins"
            element={
              <RoleProtectedRoute allowedRoles={['receptionist']}>
                <WalkinRegistration />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/receptionist/emergencies"
            element={
              <RoleProtectedRoute allowedRoles={['receptionist']}>
                <EmergencyAlerts />
              </RoleProtectedRoute>
            }
          />

          {/* Doctor Routes */}
          <Route path="/doctor/login" element={<DoctorLogin />} />
          <Route
            path="/doctor/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['doctor']}>
                <DoctorDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/doctor/schedule"
            element={
              <RoleProtectedRoute allowedRoles={['doctor']}>
                <DoctorSchedule />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/doctor/queue"
            element={
              <RoleProtectedRoute allowedRoles={['doctor']}>
                <DoctorQueue />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/doctor/queue/:id"
            element={
              <RoleProtectedRoute allowedRoles={['doctor']}>
                <PatientQueueDetails />
              </RoleProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/departments"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <DepartmentManagement />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/doctors"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <DoctorManagement />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/schedules"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <DoctorScheduleAdmin />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/opd-sessions"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <OPDSessions />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/capacity"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <CapacityManagement />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/walkins"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <WalkinManagement />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <BookingSettings />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/statistics"
            element={
              <RoleProtectedRoute allowedRoles={['admin']}>
                <Statistics />
              </RoleProtectedRoute>
            }
          />

          {/* Catch-all redirect to landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

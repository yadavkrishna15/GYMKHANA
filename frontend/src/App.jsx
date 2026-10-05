import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import PublicLayout from './components/layout/PublicLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Guards
import ProtectedRoute from './components/auth/ProtectedRoute';
import { RoleGuard, DashboardRedirect } from './components/auth/RoleGuard';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Exercises from './pages/public/Exercises';
import ExerciseDetail from './pages/public/ExerciseDetail';
import Equipment from './pages/public/Equipment';
import EquipmentDetail from './pages/public/EquipmentDetail';
import WorkoutPlans from './pages/public/WorkoutPlans';
import WorkoutPlanDetail from './pages/public/WorkoutPlanDetail';
import Trainers from './pages/public/Trainers';
import Membership from './pages/public/Membership';
import Contact from './pages/public/Contact';
import FitnessCalculator from './pages/public/FitnessCalculator';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberProfile from './pages/member/MemberProfile';
import MemberMembership from './pages/member/MemberMembership';
import MemberPlan from './pages/member/MemberPlan';
import MemberAttendance from './pages/member/MemberAttendance';
import MemberProgress from './pages/member/MemberProgress';
import MemberFeedback from './pages/member/MemberFeedback';
import MemberTools from './pages/member/MemberTools';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerProfile from './pages/trainer/TrainerProfile';
import TrainerMembers from './pages/trainer/TrainerMembers';
import TrainerPlans from './pages/trainer/TrainerPlans';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminExercises from './pages/admin/AdminExercises';
import AdminEquipment from './pages/admin/AdminEquipment';
import AdminWorkoutPlans from './pages/admin/AdminWorkoutPlans';
import AdminMemberships from './pages/admin/AdminMemberships';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminMessages from './pages/admin/AdminMessages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Top Navbar and Dynamic Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/exercises/:id" element={<ExerciseDetail />} />
            <Route path="/equipment" element={<Equipment />} />
            <Route path="/equipment/:id" element={<EquipmentDetail />} />
            <Route path="/workout-plans" element={<WorkoutPlans />} />
            <Route path="/workout-plans/:id" element={<WorkoutPlanDetail />} />
            <Route path="/trainers" element={<Trainers />} />
            <Route path="/membership" element={<Membership />} />
            <Route path="/calculator" element={<FitnessCalculator />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Route>

          {/* Smart Redirect to Role-Specific Dashboard */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRedirect />
              </ProtectedRoute>
            }
          />

          {/* Member Workspace */}
          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['MEMBER', 'ADMIN']}>
                  <DashboardLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<MemberDashboard />} />
            <Route path="profile" element={<MemberProfile />} />
            <Route path="membership" element={<MemberMembership />} />
            <Route path="plan" element={<MemberPlan />} />
            <Route path="attendance" element={<MemberAttendance />} />
            <Route path="progress" element={<MemberProgress />} />
            <Route path="tools" element={<MemberTools />} />
            <Route path="feedback" element={<MemberFeedback />} />
          </Route>

          {/* Trainer Workspace */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['TRAINER', 'ADMIN']}>
                  <DashboardLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<TrainerDashboard />} />
            <Route path="profile" element={<TrainerProfile />} />
            <Route path="members" element={<TrainerMembers />} />
            <Route path="plans" element={<TrainerPlans />} />
          </Route>

          {/* Admin Workspace */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleGuard allowedRoles={['ADMIN']}>
                  <DashboardLayout />
                </RoleGuard>
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="trainers" element={<AdminTrainers />} />
            <Route path="exercises" element={<AdminExercises />} />
            <Route path="equipment" element={<AdminEquipment />} />
            <Route path="workout-plans" element={<AdminWorkoutPlans />} />
            <Route path="memberships" element={<AdminMemberships />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="messages" element={<AdminMessages />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

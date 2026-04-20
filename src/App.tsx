import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExamList from './pages/ExamList';
import ExamTake from './pages/ExamTake';
import QuestionBank from './pages/QuestionBank';
import Reports from './pages/Reports';
import { doc, getDocFromServer } from 'firebase/firestore';
import { db } from './lib/firebase';

import { StudentGamification } from './modules/student/gamification';
import { StudentAITutor } from './modules/student/ai-tutor';
import { ProfessorAIHub } from './modules/professor/ai-hub';
import UserManager from './pages/admin/UserManager';
import CourseManager from './modules/admin/courses/CourseManager';
import UCManager from './modules/admin/courses/UCManager';
import CapacidadesManager from './modules/admin/courses/CapacidadesManager';
import ProfessorInsights from './modules/professor/insights/ProfessorInsights';
import StudentAdaptiveJourney from './modules/student/adaptive/StudentAdaptiveJourney';
import Profile from './pages/Profile';
import ActivateAccount from './pages/ActivateAccount';
import { SAPanel, SAEditor, SAView } from './modules/professor/sa';
import { NotificationProvider } from './lib/NotificationContext';

export default function App() {
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration.");
        }
      }
    }
    testConnection();
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/activate" element={<ActivateAccount />} />
            
            <Route path="/" element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/exams" element={
              <AuthGuard>
                <Layout>
                  <ExamList />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/exams/:examId" element={
              <AuthGuard>
                <ExamTake />
              </AuthGuard>
            } />

            <Route path="/questions" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <QuestionBank />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/gamification" element={
              <AuthGuard requiredRole="ALUNO">
                <Layout>
                  <StudentGamification />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/tutor-ia" element={
              <AuthGuard requiredRole="ALUNO">
                <Layout>
                  <StudentAITutor />
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/student/journey" element={
              <AuthGuard requiredRole="ALUNO">
                <Layout>
                  <StudentAdaptiveJourney />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/sa" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <SAPanel />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/ai-hub" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ProfessorAIHub />
                </Layout>
              </AuthGuard>
            } />
            
            <Route path="/professor/insights" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ProfessorInsights />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/sa/create" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <SAEditor />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/sa/edit/:id" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <SAEditor />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/sa/:id" element={
              <AuthGuard>
                <Layout>
                  <SAView />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/reports" element={
              <AuthGuard>
                <Layout>
                  <Reports />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/admin/users" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <UserManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/admin/courses" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <CourseManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/admin/ucs" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <UCManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/admin/capacidades" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <CapacidadesManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/profile" element={
              <AuthGuard>
                <Layout>
                  <Profile />
                </Layout>
              </AuthGuard>
            } />

            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

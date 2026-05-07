import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './lib/AuthContext';
import { TenantProvider } from './lib/TenantContext';
import { AuthGuard } from './components/AuthGuard';
import { Layout } from './components/Layout';
import { ErrorBoundary } from './components/ErrorBoundary';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ExamList from './pages/ExamList';
import ExamTake from './pages/ExamTake';
import QuestionBank from './pages/QuestionBank';
import Reports from './pages/Reports';
import StudentDossier from './pages/StudentDossier';
import LessonPlanner from './pages/LessonPlanner';
import Evaluations from './pages/Evaluations';
import VirtualMentor from './pages/VirtualMentor';
import { SAPanel, SAEditor, SAView } from './modules/professor/sa';
import { NotificationProvider } from './lib/NotificationContext';

import { StudentGamification } from './modules/student/gamification';
import ProfessorGamification from './modules/professor/gamification/ProfessorGamification';
import AdminGamification from './modules/admin/gamification/AdminGamification';
import Missions from './pages/admin/Missions';
import LabDashboard from './modules/professor/laboratorios/LabDashboard';
import LabEditor from './modules/professor/laboratorios/LabEditor';
import { StudentAITutor } from './modules/student/ai-tutor';
import { ProfessorAIHub } from './modules/professor/ai-hub';
import { PedagogicalBI } from './modules/teacher/bi';
import { CoordinatorBI } from './modules/coordinator/bi';
import UserManager from './pages/admin/UserManager';
import CourseManager from './modules/admin/courses/CourseManager';
import UCManager from './modules/admin/courses/UCManager';
import CapacidadesManager from './modules/admin/courses/CapacidadesManager';
import ProfessorInsights from './modules/professor/insights/ProfessorInsights';
import StudentAdaptiveJourney from './modules/student/adaptive/StudentAdaptiveJourney';
import Profile from './pages/Profile';
import ActivateAccount from './pages/ActivateAccount';
import OAuthCallback from './pages/OAuthCallback';

// New Advanced Modules
import ABPManager from './modules/pedagogical/abp/ABPManager';
import CollaborativeWorkspace from './modules/pedagogical/collaboration/CollaborativeWorkspace';
import SpacedLearningHub from './modules/student/spaced-learning/SpacedLearningHub';
import CertificationCenter from './modules/student/certification/CertificationCenter';
import InstitutionalConfigManager from './modules/admin/institutional/InstitutionalConfigManager';
import { PaymentConfigManager } from './modules/admin/payments/PaymentConfigManager';
import { EduJarvisChat } from './components/EduJarvis/Chat';
import { EnterpriseCommandCenter } from './components/edujarvis/EnterpriseCommandCenter';
import { EduJarvisIntelligencePlatform } from './components/edujarvis/EduJarvisIntelligencePlatform';
import { EducationOSDashboard } from './components/edujarvis/EducationOSDashboard';
import { HyperIntelligenceDashboard } from './components/edujarvis/HyperIntelligenceDashboard';
import { EduQuestMVP } from './components/mvp/EduQuestMVP';

import SubscriptionPlans from './modules/saas/SubscriptionPlans';
import { ProfessorSAPlanner } from './modules/professor/ProfessorSAPlanner';
import SimulationManager from './modules/professor/simuladores/SimulationManager';
import CaseStudyManager from './modules/professor/estudos-caso/CaseStudyManager';
import PedagogicalMaestro from './modules/professor/ai-hub/PedagogicalMaestro';
import FlippedModuleManager from './modules/professor/flipped/FlippedModuleManager';
import LiveMonitoring from './modules/professor/classroom/LiveMonitoring';
import { useTenant } from './lib/TenantContext';

import ActivitiesDashboard from './components/activities/ActivitiesDashboard';
import ActivityCreateView from './components/activities/ActivityCreateView';
import ActivityDetailsView from './components/activities/ActivityDetailsView';
import ActivityCorrectionView from './components/activities/ActivityCorrectionView';
import StudentActivityView from './components/activities/StudentActivityView';
import ActivityRubricBuilder from './components/activities/ActivityRubricBuilder';

function TenantSpecificIntelligence() {
  const { tenant } = useTenant();
  return <EduJarvisIntelligencePlatform tenantId={tenant?.id || 'public'} />;
}

function TenantSpecificOS() {
  const { tenant } = useTenant();
  return <EducationOSDashboard tenantId={tenant?.id || 'public'} />;
}

function TenantSpecificHyperOS() {
  const { tenant } = useTenant();
  return <HyperIntelligenceDashboard tenantId={tenant?.id || 'public'} />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <TenantProvider>
          <NotificationProvider>
            <Router>
              <EduJarvisChat />
              <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/activate" element={<ActivateAccount />} />
            
            <Route path="/" element={
              <AuthGuard>
                <Layout>
                  <Dashboard />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/enterprise" element={
              <AuthGuard>
                <Layout>
                  <EnterpriseCommandCenter />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/intelligence" element={
              <AuthGuard>
                <Layout>
                   <TenantSpecificIntelligence />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/os" element={
              <AuthGuard>
                <Layout>
                   <TenantSpecificOS />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/hyper-os" element={
              <AuthGuard>
                <Layout>
                   <TenantSpecificHyperOS />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/mvp" element={
              <AuthGuard>
                <Layout>
                   <EduQuestMVP />
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

            <Route path="/evaluations" element={
              <AuthGuard>
                <Layout>
                  <Evaluations />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/planning" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <LessonPlanner />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/dossier/:studentId" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <StudentDossier />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/mentor" element={
              <AuthGuard requiredRole="ALUNO">
                <Layout>
                  <VirtualMentor />
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

            <Route path="/gamification-professor" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ProfessorGamification />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/professor/laboratorios" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <LabDashboard />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/professor/laboratorios/novo" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <LabEditor />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/professor/laboratorios/:id" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <LabEditor />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/admin/gamification" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <AdminGamification />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/admin/gamification/missions" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <Missions />
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

            <Route path="/professor/bi" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <PedagogicalBI />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/coordinator/bi" element={
              <AuthGuard requiredRole="COORDENADOR">
                <Layout>
                  <CoordinatorBI />
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
            
            <Route path="/professor/planner" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ProfessorSAPlanner />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/professor/simuladores" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <SimulationManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/professor/casos" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <CaseStudyManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/professor/maestro" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <PedagogicalMaestro />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/professor/invertida" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <FlippedModuleManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/professor/live/:sessionId" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <LiveMonitoring sessionId="default" />
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

            <Route path="/abp" element={
              <AuthGuard>
                <Layout>
                  <ABPManager />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/collaboration" element={
              <AuthGuard>
                <Layout>
                  <CollaborativeWorkspace />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/spaced-learning" element={
              <AuthGuard>
                <Layout>
                  <SpacedLearningHub />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/certifications" element={
              <AuthGuard>
                <Layout>
                  <CertificationCenter />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/plans" element={
              <AuthGuard>
                <Layout>
                  <SubscriptionPlans />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/admin/institutional" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <InstitutionalConfigManager />
                </Layout>
              </AuthGuard>
            } />
            <Route path="/admin/payments" element={
              <AuthGuard requiredRole="ADMIN">
                <Layout>
                  <PaymentConfigManager />
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

            <Route path="/activities" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ActivitiesDashboard />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/activities/new" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ActivityCreateView />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/activities/rubric/new" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ActivityRubricBuilder />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/activities/:id" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ActivityDetailsView />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/activities/:id/correction/:submissionId" element={
              <AuthGuard requiredRole="PROFESSOR">
                <Layout>
                  <ActivityCorrectionView />
                </Layout>
              </AuthGuard>
            } />

            <Route path="/my-activities" element={
              <AuthGuard requiredRole="ALUNO">
                <Layout>
                  <StudentActivityView />
                </Layout>
              </AuthGuard>
            } />

            <Route path="*" element={<Dashboard />} />
          </Routes>
        </Router>
      </NotificationProvider>
      </TenantProvider>
    </AuthProvider>
    </ErrorBoundary>
  );
}

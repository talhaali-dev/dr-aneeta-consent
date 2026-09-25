/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { StudySelector } from './pages/StudySelector';
import { ConsentForm } from './pages/ConsentForm';
import { HealthLiteracyConsentForm } from './pages/HealthLiteracyConsentForm';
import { AdminDashboard } from './pages/AdminDashboard';
import { Layout } from './components/Layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Study Selection Hub */}
          <Route path="/" element={<StudySelector />} />
          
          {/* Study 1: Cancer Caregiver Burden */}
          <Route path="/study/caregiver-burden" element={<ConsentForm />} />
          
          {/* Study 2: Health Literacy & Cancer Pathways */}
          <Route path="/study/health-literacy" element={<HealthLiteracyConsentForm />} />
          
          {/* Admin Dashboard */}
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Legacy route redirects */}
          <Route path="/consent" element={<Navigate to="/study/caregiver-burden" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

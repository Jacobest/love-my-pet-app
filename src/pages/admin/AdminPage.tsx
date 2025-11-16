import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminDashboardPage from './AdminDashboardPage';
import AdminAlertsPage from './AdminAlertsPage';
import AdminMembersPage from './AdminMembersPage';
import AdminModerationPage from './AdminModerationPage';
import AdminAdvertisingPage from './AdminAdvertisingPage';
import AdminAdvertiserDetailPage from './AdminAdvertiserDetailPage';
import AdminAdvertDetailPage from './AdminAdvertDetailPage';
import AdminMemberDetailPage from './AdminMemberDetailPage';
import AdminPoliciesPage from './AdminPoliciesPage';
import AdminPetsPage from './AdminPetsPage';
import AdminSettingsPage from './AdminSettingsPage';
import AdminPostsPage from './AdminPostsPage';

const AdminPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="flex-1 p-6 md:p-10">
        <Routes>
          <Route path="/" element={<AdminDashboardPage />} />
          <Route path="alerts" element={<AdminAlertsPage />} />
          <Route path="moderation" element={<AdminModerationPage />} />
          <Route path="members" element={<AdminMembersPage />} />
          <Route path="members/:userId" element={<AdminMemberDetailPage />} />
          <Route path="advertising" element={<AdminAdvertisingPage />} />
          <Route path="advertising/:advertiserId" element={<AdminAdvertiserDetailPage />} />
          <Route path="adverts/:advertId" element={<AdminAdvertDetailPage />} />
          <Route path="policies" element={<AdminPoliciesPage />} />
          <Route path="posts" element={<AdminPostsPage />} />
          <Route path="pets" element={<AdminPetsPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminPage;
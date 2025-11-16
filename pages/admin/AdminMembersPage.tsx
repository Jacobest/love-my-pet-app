import React, { useContext, useMemo, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../App';
import { User } from '../../types';
import { Check, X, MoreHorizontal, Shield, User as UserIcon, ShieldAlert, PauseCircle, Ban, Archive } from 'lucide-react';
import Button from '../../components/Button';

type UserRole = User['role'];
type UserStatus = User['status'];

const ActionDropdown: React.FC<{
  user: User;
  onStatusChange: (userId: string, status: UserStatus) => void;
  onRoleChange: (userId: string, role: UserRole) => void;
}> = ({ user, onStatusChange, onRoleChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const roles: UserRole[] = ['User', 'Moderator', 'Admin'];
  const statuses: UserStatus[] = ['Active', 'Paused', 'Blocked', 'Archived'];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
        <MoreHorizontal size={20} />
      </Button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Change Status</div>
            {statuses.filter(s => s !== user.status).map(status => (
                <button
                    key={status}
                    onClick={() => { onStatusChange(user.id, status); setIsOpen(false); }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    {status}
                </button>
            ))}
            <div className="border-t my-1"></div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase">Change Role</div>
             {roles.filter(r => r !== user.role).map(role => (
                 <button
                    key={role}
                    onClick={() => { onRoleChange(user.id, role); setIsOpen(false); }}
                    className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                    {role}
                </button>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};


const RolePill: React.FC<{ role: UserRole }> = ({ role }) => {
    const roleConfig = {
        Admin: 'bg-red-100 text-red-800',
        Moderator: 'bg-blue-100 text-blue-800',
        User: 'bg-gray-100 text-gray-800',
    };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${roleConfig[role]}`}>{role}</span>;
};

const AdminMembersPage: React.FC = () => {
  const { users, updateUserVettingStatus, updateUserAccountStatus, updateUserRole } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState<UserStatus>('Active');
  const navigate = useNavigate();
  
  const pendingUsers = useMemo(() => users.filter(u => u.vettingStatus === 'Pending'), [users]);
  const vettedUsers = useMemo(() => users.filter(u => u.vettingStatus === 'Verified' || u.vettingStatus === 'Not Verified'), [users]);

  const filteredUsers = useMemo(() => {
    return vettedUsers.filter(u => u.status === activeTab);
  }, [vettedUsers, activeTab]);

  const handleApprove = (userId: string) => {
    updateUserVettingStatus(userId, 'Verified');
  };

  const handleReject = (userId: string) => {
    updateUserVettingStatus(userId, 'Not Verified');
    updateUserAccountStatus(userId, 'Blocked'); // Automatically block rejected users
  };
  
  const TABS: UserStatus[] = ['Active', 'Paused', 'Blocked', 'Archived'];
  
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-dark">Members Management</h1>

      {/* Vetting Queue */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-brand-dark mb-4 flex items-center gap-2">
            <ShieldAlert className="text-yellow-500" /> Vetting Queue ({pendingUsers.length})
        </h2>
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {pendingUsers.length > 0 ? pendingUsers.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="h-10 w-10 rounded-full object-cover" src={user.profilePhotoUrl} alt={user.displayName} />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-admin-primary" onClick={() => navigate(`/admin/members/${user.id}`)}>{user.displayName}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.city}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="flex justify-end gap-2">
                                    <Button size="sm" variant="danger" onClick={() => handleReject(user.id)}><X className="mr-1 h-4 w-4"/> Reject</Button>
                                    <Button size="sm" variant="primary" onClick={() => handleApprove(user.id)}><Check className="mr-1 h-4 w-4"/> Approve</Button>
                                </div>
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={4} className="text-center py-6 text-gray-500">The vetting queue is empty.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {/* Member Directory */}
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-brand-dark mb-4">Member Directory</h2>
        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {TABS.map(tab => (
                    <button key={tab} onClick={() => setActiveTab(tab)}
                        className={`${
                            activeTab === tab
                            ? 'border-admin-primary text-admin-primary'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                    >
                       {tab}
                    </button>
                ))}
            </nav>
        </div>
        <div className="overflow-x-auto mt-4">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.length > 0 ? filteredUsers.map(user => (
                        <tr key={user.id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <img className="h-10 w-10 rounded-full object-cover" src={user.profilePhotoUrl} alt={user.displayName} />
                                    <div className="ml-4">
                                        <div className="text-sm font-medium text-gray-900 cursor-pointer hover:text-admin-primary" onClick={() => navigate(`/admin/members/${user.id}`)}>{user.displayName}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.city}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"><RolePill role={user.role}/></td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(user.joinDate).toLocaleDateString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <ActionDropdown user={user} onStatusChange={updateUserAccountStatus} onRoleChange={updateUserRole} />
                            </td>
                        </tr>
                    )) : (
                        <tr><td colSpan={5} className="text-center py-6 text-gray-500">No members found with status "{activeTab}".</td></tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMembersPage;
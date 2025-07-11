import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useData } from '../context/DataContext';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiUserPlus, FiMail, FiCheck, FiX } = FiIcons;

const UserManagement = ({ property }) => {
  const [users, setUsers] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState('viewer');
  const { supabase } = useData();

  useEffect(() => {
    loadUsers();
  }, [property]);

  const loadUsers = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        users:user_id (
          email,
          user_metadata
        )
      `)
      .eq('property_id', property.id);

    if (!error) {
      setUsers(data);
    }
  };

  const sendInvite = async () => {
    const { data, error } = await supabase
      .from('invitations')
      .insert([
        {
          email: inviteEmail,
          role: selectedRole,
          property_id: property.id,
          invited_by: supabase.auth.user().id
        }
      ]);

    if (!error) {
      // Send email notification (implement email service)
      setInviteEmail('');
      setSelectedRole('viewer');
    }
  };

  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .match({ user_id: userId, property_id: property.id });

    if (!error) {
      loadUsers();
    }
  };

  const removeUser = async (userId) => {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .match({ user_id: userId, property_id: property.id });

    if (!error) {
      loadUsers();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-gray-900">Property Access</h3>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <SafeIcon icon={FiUserPlus} className="mr-2 h-5 w-5" />
          Invite User
        </button>
      </div>

      {/* Invite Form */}
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Email address"
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
              >
                <option value="viewer">Viewer</option>
                <option value="manager">Manager</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div>
              <button
                onClick={sendInvite}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                <SafeIcon icon={FiMail} className="mr-2 h-5 w-5" />
                Send Invite
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {users.map((user) => (
            <li key={user.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                      {user.users?.user_metadata?.full_name?.[0] || user.users?.email[0]}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.users?.user_metadata?.full_name || user.users?.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      {user.users?.email}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.user_id, e.target.value)}
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  >
                    <option value="viewer">Viewer</option>
                    <option value="manager">Manager</option>
                    <option value="owner">Owner</option>
                  </select>
                  <button
                    onClick={() => removeUser(user.user_id)}
                    className="inline-flex items-center p-2 border border-transparent rounded-full text-red-600 hover:bg-red-100"
                  >
                    <SafeIcon icon={FiX} className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserManagement;
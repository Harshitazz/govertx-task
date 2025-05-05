import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function UserManagement({users,onCreditChange}) {
  const [editingUserId, setEditingUserId] = useState(null);
  const [creditInput, setCreditInput] = useState('');

  const { userData } = useContext(AuthContext);
  const updateCredits = async (userId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/admin/${userId}/credits`,
        { credits: parseInt(creditInput) },
        {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        }
      );
      onCreditChange(res.data); 
      setEditingUserId(null);    
      setCreditInput('');
      toast.success("Credits Updated!")

    } catch (err) {
      toast.error('Failed to update credits.');
      console.error(err);
    }
  };
  

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">User Management</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow-md">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Username</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Credits</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="px-4 py-2">{user.username}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td className="px-4 py-2">
                  {editingUserId === user._id ? (
                    <input
                      type="number"
                      value={creditInput}
                      onChange={(e) => setCreditInput(e.target.value)}
                      className="border px-2 py-1 rounded w-20"
                    />
                  ) : (
                    user.credits
                  )}
                </td>
                <td className="px-4 py-2">
                  {editingUserId === user._id ? (
                    <button
                      className="text-green-600 font-medium mr-2"
                      onClick={() => updateCredits(user._id)}
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      className="text-blue-600 font-medium"
                      onClick={() => {
                        setEditingUserId(user._id);
                        setCreditInput(user.credits);
                      }}
                    >
                      Edit
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

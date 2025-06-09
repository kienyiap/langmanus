import React from 'react';
import { Link } from 'react-router-dom';

function RoleCard({ role }) {
  return (
    <Link
      to={`/chat/${role.id}`}
      className="bg-white rounded shadow p-4 hover:shadow-xl hover:-translate-y-1 transform transition-all block text-center"
    >
      <img
        src={role.avatar}
        alt={role.name}
        className="mx-auto mb-2 rounded-full w-24 h-24 object-cover"
      />
      <h2 className="text-xl font-semibold mb-1">{role.name}</h2>
    </Link>
  );
}

export default RoleCard;

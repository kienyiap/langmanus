import React from 'react';
import RoleCard from './RoleCard';
import { roles } from '../data/roles';

function RoleList() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Choose Your Role</h1>
      <div className="grid gap-4 md:grid-cols-3 sm:grid-cols-2">
        {roles.map(role => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>
    </div>
  );
}

export default RoleList;

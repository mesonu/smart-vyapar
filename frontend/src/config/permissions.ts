import { UserRole } from './roles';
export const RolePermissions = {
    [UserRole.SUPER_ADMIN]: {
      users: ['create', 'read', 'update', 'delete'],
      inventory: ['create', 'read', 'update', 'delete'],
      products: ['create', 'read', 'update', 'delete'],
      billing: ['create', 'read', 'update', 'delete'],
      gst: ['create', 'read', 'update', 'delete'],
      settings: ['create', 'read', 'update', 'delete']
    },
    [UserRole.ADMIN]: {
      users: ['create', 'read', 'update'],
      inventory: ['create', 'read', 'update'],
      products: ['create', 'read', 'update'],
      billing: ['create', 'read', 'update'],
      gst: ['read', 'update']
    },
    // ... other roles
};
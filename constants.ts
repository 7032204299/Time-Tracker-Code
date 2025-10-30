import { User, UserRole } from './types';

export const USERS: User[] = [
  { id: '1', name: 'Admin', email: 'admin@example.com', role: UserRole.ADMIN },
  { id: '2', name: 'Alex Kit', email: 'alex.kit@example.com', role: UserRole.USER },
  { id: '3', name: 'Jane Anderson', email: 'jane.anderson@example.com', role: UserRole.USER },
  { id: '4', name: 'David Smith', email: 'david.smith@example.com', role: UserRole.USER },
  { id: '5', name: 'Susan David', email: 'susan.david@example.com', role: UserRole.USER },
  { id: '6', name: 'Tammy Smith', email: 'tammy.smith@example.com', role: UserRole.USER },
  { id: '7', name: 'Mary James', email: 'mary.james@example.com', role: UserRole.USER },
  { id: '8', name: 'Sandy Anderson', email: 'sandy.anderson@example.com', role: UserRole.USER },
];

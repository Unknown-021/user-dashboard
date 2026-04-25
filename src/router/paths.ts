export const ROUTES = {
  root: '/',
  users: '/users',
  userDetails: '/users/:id/view',
  userEdit: '/users/:id/edit',
} as const;

export const SEGMENT_TITLES: Record<string, string> = {
  users: 'Users',
  view: 'View',
  edit: 'Edit',
};

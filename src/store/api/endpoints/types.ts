export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  ein: string;
  company?: {
    name?: string;
  };
}

export interface GetUsersParams {
  limit: number;
  skip: number;
  search?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface ModifyUsersParams {
  id: number;
  body: Partial<User>;
}

export interface CreateUserParams {
  body: Partial<User>;
}

export interface GetUsersResponse {
  users: User[];
  total: number;
  skip: number;
  limit: number;
}

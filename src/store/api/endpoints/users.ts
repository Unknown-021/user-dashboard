import api from '../api';
import { TAGS } from '../tags';
import type {
  CreateUserParams,
  GetUsersParams,
  GetUsersResponse,
  ModifyUsersParams,
  User,
} from './types';

const usersService = api.injectEndpoints({
  endpoints: (build) => ({
    getUsers: build.query<GetUsersResponse, GetUsersParams>({
      query: ({ limit, skip, search }) => ({
        url: search?.trim() ? '/users/search' : '/users',
        params: {
          limit,
          skip,
          ...(search?.trim() ? { q: search.trim() } : {}),
        },
      }),
      providesTags: (result) => [
        { type: TAGS.USERS, id: 'LIST' },
        ...(result?.users ?? []).map(({ id }) => ({
          type: TAGS.USERS,
          id,
        })),
      ],
    }),
    getUserById: build.query<User, number>({
      query: (id) => ({
        url: `/users/${id}`,
      }),
      providesTags: (result, error, id) => [{ type: TAGS.USERS, id }],
    }),

    createUser: build.mutation<User, CreateUserParams>({
      query: (body) => ({
        url: '/users/add',
        method: 'POST',
        body: { ...body },
      }),
      invalidatesTags: [{ type: TAGS.USERS, id: 'LIST' }],
    }),

    modifyUser: build.mutation<User, ModifyUsersParams>({
      query: ({ body, id }) => ({
        url: `/users/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: TAGS.USERS, id: 'LIST' }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useLazyGetUsersQuery,
  useModifyUserMutation,
} = usersService;

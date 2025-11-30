import { apiSlice } from './apiSlice';

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface CreateUserResponse {
  id: string;
  username: string;
  createdAt: string;
}

export const authApi = apiSlice.injectEndpoints({
  endpoints: builder => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: credentials => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    createUser: builder.mutation<CreateUserResponse, CreateUserRequest>({
      query: userData => ({
        url: '/users',
        method: 'POST',
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useCreateUserMutation } = authApi;

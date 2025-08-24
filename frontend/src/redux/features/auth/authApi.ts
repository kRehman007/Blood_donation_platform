import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL,
    credentials: 'include',
    prepareHeaders:(headers,{getState})=>{
        const token=(getState() as any).auth.user?.token
        if(token){
            headers.set('Authorization',`Bearer ${token}`)
        }
        return headers
    }
   }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
        query:(credentials)=>({
            url:"/user/register",
            method:"POST",
            body:credentials
        })
    }),
    loginUser: builder.mutation({
        query:(credentials)=>({
            url:"/user/login",
            method:"POST",
            body:credentials
        })
    }),
    checkAuth:builder.query<any,void>({
        query:()=>({
            url:"/user/auth/validate-user",
            method:"GET",
        })
    }),
    logoutUser:builder.mutation<any,void>({
        query:()=>({
            url:"/user/logout",
            method:"GET",
        })
    })
  }),
})


export const { 
    useRegisterUserMutation, 
    useLoginUserMutation,
    useLogoutUserMutation,
    useCheckAuthQuery
 } = authApi
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store/store'
import type { User } from '@/lib/interface'


// Define a type for the slice state
interface AuthState {
  user: User | null
  isAuthenticated: boolean
}

// Define the initial state using that type
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    addUser:(state, action:PayloadAction<User>)=>{
        state.user=action.payload,
        state.isAuthenticated=true
    },
    clearUser:(state)=>{
        state.user=null,
        state.isAuthenticated=false
    },
    updateUser:(state, action:PayloadAction<Partial<User>>)=>{
        if(state.user){
            state.user={...state.user,...action.payload},
            state.isAuthenticated=true
        }
    }
}
})

export const {addUser,clearUser,updateUser } = authSlice.actions



export const selectCount = (state: RootState) => state.auth.user

export default authSlice.reducer
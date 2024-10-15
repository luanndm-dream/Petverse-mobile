import { createSlice } from "@reduxjs/toolkit";

const initialState : {
    id: string,
    accesstoken: string
} = {
    id: '',
    accesstoken: ''
}
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        authData: initialState,

    },
    reducers: {
        addAuth: (state, action) =>{
            state.authData = action.payload
        }
    }
})

export default authSlice.reducer
export const {addAuth} = authSlice.actions

export const authSelector = (state: any) => state.authReducer.authData
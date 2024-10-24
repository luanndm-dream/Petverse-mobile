import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";


const initialState = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxMUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJjdXN0b21lciIsImV4cCI6MTc2MTA2NDgxNSwiaXNzIjoiYmhlcC1hdXRoLWFwaSIsImF1ZCI6ImJoZXAtY2xpZW50In0.-gYG3yZKPGxACvehX6722F2q_tIt3XK4ezNPxh2SGhc',
    refreshToken: '',
    refreshTokenExpiryTime: '',
    roleName: '',
    userId: Platform.OS === 'android' ? '1': '2',
    // userId: 'eac9c97b-1f5f-40d5-0f82-08dcf1c7e0cd'
};

const authSlice = createSlice({
    name: 'authSlice',  // Đổi tên cho đồng nhất
    initialState: initialState,
    reducers: {
        addAuth: (state, action: PayloadAction<any>) => {
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            state.refreshTokenExpiryTime = action.payload.refreshTokenExpiryTime
            state.roleName = action.payload.roleName
            state.userId = action.payload.userId
        }
    }
});

// Xuất khẩu reducer và actions
const { reducer, actions } = authSlice;
export const { addAuth } = actions;
export default reducer;

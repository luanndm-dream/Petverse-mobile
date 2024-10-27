import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";


const initialState = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxMkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJjdXN0b21lciIsImV4cCI6MTc2MTQ4ODEyNiwiaXNzIjoiYmhlcC1hdXRoLWFwaSIsImF1ZCI6ImJoZXAtY2xpZW50In0.DHiPgoVufltywr9lRiKQuHroD772geg7fw5VFH099t8',
    // accessToken: undefined,
    refreshToken: '',
    refreshTokenExpiryTime: '',
    roleName: '',
    userId: '15f0494d-a539-471a-9748-08dcf595a244' //User số 12
    // userId: Platform.OS === 'ios' ? '2': '1',
    // userId: '1'
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

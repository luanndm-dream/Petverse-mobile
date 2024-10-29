import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Platform } from "react-native";

interface AuthState {
    accessToken: string;
    refreshToken: string;
    refreshTokenExpiryTime: string;
    roleName: string;
    userId: string;
    petCenterId?: string | null;
}
//thông tin user14
const initialState: AuthState = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxNEBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJwZXRjZW50ZXIiLCJleHAiOjE3NjE3NDMxNTAsImlzcyI6InBldHZlcnNlLWF1dGgtYXBpIiwiYXVkIjoicGV0dmVyc2UtY2xpZW50In0.-eldv4fm9oV_PNQLwn_cm_GbyNLR-LUXzt2EjNxRNUU',
    refreshToken: '',
    refreshTokenExpiryTime: '',
    roleName: '',
    // userId: '0d175a92-e335-4036-94f1-08dcf6b29884', //user 14
    // petCenterId: '74af3d3c-04ba-4e1e-379d-08dcf7d40aea',//user 14
    userId: '6bab4bf2-24c5-4dee-a2c5-08dcf7ff94b1', //user 16
    petCenterId: 'd4009399-360a-4b29-0c05-08dcf7f9ae4e', //user 16
};

const authSlice = createSlice({
    name: 'authSlice',
    initialState: initialState,
    reducers: {
        addAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
            state.accessToken = action.payload.accessToken || state.accessToken;
            state.refreshToken = action.payload.refreshToken || state.refreshToken;
            state.refreshTokenExpiryTime = action.payload.refreshTokenExpiryTime || state.refreshTokenExpiryTime;
            state.roleName = action.payload.roleName || state.roleName;
            state.userId = action.payload.userId || state.userId;
            state.petCenterId = action.payload.petCenterId !== undefined ? action.payload.petCenterId : state.petCenterId;
        },
    },
});

// Xuất khẩu reducer và actions
const { reducer, actions } = authSlice;
export const { addAuth } = actions;
export default reducer;
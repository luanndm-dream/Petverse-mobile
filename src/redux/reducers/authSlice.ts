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

const initialState: AuthState = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxMkBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJjdXN0b21lciIsImV4cCI6MTc2MTczNjI2NCwiaXNzIjoicGV0dmVyc2UtYXV0aC1hcGkiLCJhdWQiOiJwZXR2ZXJzZS1jbGllbnQifQ.IYc_C7XEaN_sPkKrBQnpZAcqqlmvLtI10tKpjdvYAwI',
    refreshToken: '',
    refreshTokenExpiryTime: '',
    roleName: '',
    userId: '0d175a92-e335-4036-94f1-08dcf6b29884',
    petCenterId: '74af3d3c-04ba-4e1e-379d-08dcf7d40aea',
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
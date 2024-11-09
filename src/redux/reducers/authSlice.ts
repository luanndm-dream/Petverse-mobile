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
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxMUBnbWFpbC5jb20iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJwZXRjZW50ZXIiLCJleHAiOjE3NjI0MjUzMjMsImlzcyI6InBldHZlcnNlLWF1dGgtYXBpIiwiYXVkIjoicGV0dmVyc2UtY2xpZW50In0.9a9v1ezQB2VVa27fuA9JgtZMNUVLlXOhjqf1oCh8jXc',
    refreshToken: '',
    refreshTokenExpiryTime: '',
    roleName: Platform.OS === 'android'? 'petCenter' : 'customer',
    userId: Platform.OS === 'android'? '6bab4bf2-24c5-4dee-a2c5-08dcf7ff94b1' : '782aa387-9efc-4a37-9a8d-08dd009cdea2',
    petCenterId: Platform.OS === 'android'? 'd4009399-360a-4b29-0c05-08dcf7f9ae4e' : undefined, 
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
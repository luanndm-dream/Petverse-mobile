import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiJtaW5obHVhbm5ndXllbjIwMTdAZ21haWwuY29tIiwiaHR0cDovL3NjaGVtYXMubWljcm9zb2Z0LmNvbS93cy8yMDA4LzA2L2lkZW50aXR5L2NsYWltcy9yb2xlIjoiY3VzdG9tZXIiLCJleHAiOjE3MjkxMDA4NDUsImlzcyI6ImJoZXAtYXV0aC1hcGkiLCJhdWQiOiJiaGVwLWNsaWVudCJ9.ElHV8W4g5dxMueHaKH2YLN-oDnR2V6UUknVsqelM0SE',
    refreshToken: '',
    refreshTokenExpiryTime: '',
    roleName: '',
    userId: '',
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

import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState = {
    accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiIxQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNzYxMDQ2NTkyLCJpc3MiOiJiaGVwLWF1dGgtYXBpIiwiYXVkIjoiYmhlcC1jbGllbnQifQ.mfLJj0_6wUvDn4dL_xCP7yEJHaIrg_cphqIsz1bGzKM',
    refreshToken: '',
    refreshTokenExpiryTime: '',
    roleName: '',
    userId: '718cf56e-cc3f-4581-4b92-08dcf0135c72',
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

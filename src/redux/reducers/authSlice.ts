import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

const initialState = {
    id: '',
    accesstoken: ''
};

const authSlice = createSlice({
    name: 'authSlice',  // Đổi tên cho đồng nhất
    initialState: initialState,
    reducers: {
        addAuth: (state, action) => {
            state.id = action.payload.id;  // Cập nhật id
            state.accesstoken = action.payload.accesstoken;  // Cập nhật accesstoken
        }
    }
});

// Xuất khẩu reducer và actions
const { reducer, actions } = authSlice;
export const { addAuth } = actions;
export default reducer;

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Platform} from 'react-native';

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
  accessToken:
    Platform.OS === 'android'
      ? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjZiYWI0YmYyLTI0YzUtNGRlZS1hMmM1LTA4ZGNmN2ZmOTRiMSIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IjE2QGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6InBldGNlbnRlciIsImV4cCI6MTc2Mzg5NzYyOSwiaXNzIjoicGV0dmVyc2UtYXV0aC1hcGkiLCJhdWQiOiJwZXR2ZXJzZS1jbGllbnQifQ.PxUbY7hCntYf0mGfrowOQCq05CeaS8RftjuGPiIEKDc'
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6Ijc4MmFhMzg3LTllZmMtNGEzNy05YThkLTA4ZGQwMDljZGVhMiIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL2VtYWlsYWRkcmVzcyI6IjIwQGdtYWlsLmNvbSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6ImN1c3RvbWVyIiwiZXhwIjoxNzYzOTAyNDM1LCJpc3MiOiJwZXR2ZXJzZS1hdXRoLWFwaSIsImF1ZCI6InBldHZlcnNlLWNsaWVudCJ9.0KAiL9OVBPXt2cHk2vVrWnyyT_PBtgstykCUNMzjwK0',
  refreshToken: '',
  refreshTokenExpiryTime: '',
  roleName: Platform.OS === 'android' ? 'petCenter' : 'customer',
  userId:
    Platform.OS === 'android'
      ? '6bab4bf2-24c5-4dee-a2c5-08dcf7ff94b1'
      : '782aa387-9efc-4a37-9a8d-08dd009cdea2',
  petCenterId:
    Platform.OS === 'android'
      ? 'd4009399-360a-4b29-0c05-08dcf7f9ae4e'
      : undefined,
};

const authSlice = createSlice({
  name: 'authSlice',
  initialState: initialState,
  reducers: {
    addAuth: (state, action: PayloadAction<Partial<AuthState>>) => {
      state.accessToken = action.payload.accessToken || state.accessToken;
      state.refreshToken = action.payload.refreshToken || state.refreshToken;
      state.refreshTokenExpiryTime =
        action.payload.refreshTokenExpiryTime || state.refreshTokenExpiryTime;
      state.roleName = action.payload.roleName || state.roleName;
      state.userId = action.payload.userId || state.userId;
      state.petCenterId =
        action.payload.petCenterId !== undefined
          ? action.payload.petCenterId
          : state.petCenterId;
    },
  },
});

// Xuất khẩu reducer và actions
const {reducer, actions} = authSlice;
export const {addAuth} = actions;
export default reducer;

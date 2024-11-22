import { combineSlices } from "@reduxjs/toolkit";
import { appReducer, breedHistoryReducer } from "./reducers";
import appLoadingSlice from "./reducers/appLoadingSlice";
import authReducer from "./reducers/authSlice";


const rootReducer = combineSlices({
    auth : authReducer,
    app: appReducer,
    breedHistory: breedHistoryReducer
})

export default rootReducer
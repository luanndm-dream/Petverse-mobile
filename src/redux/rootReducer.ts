import { combineSlices } from "@reduxjs/toolkit";
import { appReducer } from "./reducers";
import appLoadingSlice from "./reducers/appLoadingSlice";

import authReducer from "./reducers/authSlice";


const rootReducer = combineSlices({
    auth : authReducer,
    app: appReducer
    // app: appLoadingSlice
})

export default rootReducer
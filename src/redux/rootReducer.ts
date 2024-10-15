import { combineSlices } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";

const rootReducer = combineSlices({
    auth: authReducer
})

export default rootReducer
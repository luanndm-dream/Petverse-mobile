import { createSlice } from "@reduxjs/toolkit"

const initialState ={ 
    items: [],
}
export const breedHistorySlice = createSlice({
    name: "historyBreedSlice",
    initialState,
    reducers: {
        addBreedHistory: (state, action) => {
           state.items = action.payload
        }
    }
});

const {reducer, actions} = breedHistorySlice
export const {addBreedHistory} = actions
export default reducer
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
exact : null
}
const exactSlice = createSlice({
    name : "exact",
    initialState,
    reducers : {
        setExact:(state , action) => {
            state.exact = action.payload;
            
        },
       
    },
 
});

export const { setExact} = exactSlice.actions;
export default exactSlice.reducer;
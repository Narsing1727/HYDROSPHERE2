import { createSlice } from "@reduxjs/toolkit";

const initialState = {
latLng : null,
}
const locationSlice = createSlice({
    name : "location",
    initialState,
    reducers : {
        setLocation:(state , action) => {
            state.latLng = action.payload;
            
        },
       
    },
 
});

export const { setLocation} = locationSlice.actions;
export default locationSlice.reducer;
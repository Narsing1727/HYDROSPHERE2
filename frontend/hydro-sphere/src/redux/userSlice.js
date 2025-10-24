import { createSlice } from "@reduxjs/toolkit";

const initialState = {
userInfo : null,
isAuth : false
}
const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        setUser:(state , action) => {
            state.userInfo = {...state.userInfo , ...action.payload}
            state.isAuth = true;
        },
        clearUser : (state) => {
        state.userInfo = null;
        state.isAuth = false;
    }
    },
 
});

export const { setUser , clearUser} = userSlice.actions;
export default userSlice.reducer;
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from "./userSlice";
import locationReducer from "./locationSlice";
import exactReducer from "./exactSlice";

const rootReducer = combineReducers({
  user: userReducer,
  location: locationReducer,
  loc: exactReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "location", "loc"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // necessary for redux-persist
    }),
});

export const persistor = persistStore(store);

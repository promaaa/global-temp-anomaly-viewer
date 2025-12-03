import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../hooks/reducer/reducer";
import logger from "redux-logger";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger), // Added logger
  enhancers: (getDefaultEnhancers) => getDefaultEnhancers()
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
import { createStore } from "redux";
import userReducer from "./userReducer.tsx";

export const store = createStore(userReducer);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

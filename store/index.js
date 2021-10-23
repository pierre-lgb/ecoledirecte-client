import { createStore, applyMiddleware } from "redux";
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import thunk from "redux-thunk";

import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";

const rootReducer = combineReducers({
    auth: persistReducer({
        key: "root",
        storage: AsyncStorage,
        writeFailHandler: () => { console.log("Write error") }
    }, authReducer)
})

const middleware = [thunk];

export const store = createStore(
    rootReducer,
    applyMiddleware(...middleware)
)
export const persistor = persistStore(store)

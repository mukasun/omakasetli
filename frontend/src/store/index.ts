import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { persistStore } from 'redux-persist'
import { persistedReducer } from './reducers'

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware({
    serializableCheck: false,
  }),
})

export const persistor = persistStore(store)

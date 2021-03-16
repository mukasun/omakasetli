import { createReducer } from '@reduxjs/toolkit'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { updateMusicPlatform, updateUserId, updateDestinationRoomKey } from './actions'
import { Platform } from '@/libs/music/music'

const initialState: {
  destinationRoomKey?: string
  musicPlatform: Platform
  userId: string
} = {
  destinationRoomKey: undefined,
  musicPlatform: 'apple',
  userId: '',
}

export const rootReducer = createReducer(initialState, {
  [updateDestinationRoomKey.type]: (state, action) => {
    state.destinationRoomKey = action.payload
  },
  [updateMusicPlatform.type]: (state, action) => {
    state.musicPlatform = action.payload
  },
  [updateUserId.type]: (state, action) => {
    state.userId = action.payload
  },
})

const persistConfig = {
  key: 'root',
  storage,
}

export const persistedReducer = persistReducer(persistConfig, rootReducer)

export type RootState = ReturnType<typeof persistedReducer>

import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { REFRESH_TOKEN } from '~/settings/constants'
import webStorage from '~/utils/webStorageClient'

interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  is_superuser: boolean
  is_staff: boolean
  is_active: boolean
}

export interface AuthInterface {
  userInfo: User | null
}

const initialState: AuthInterface = {
  userInfo: {} as User,
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    actionLogin: (
      state,
      action: PayloadAction<{
        rememberMe?: boolean
        userInfo: User
        access: string
        refresh: string
      }>,
    ) => {
      const { rememberMe } = action.payload
      state.userInfo = action.payload?.userInfo
      webStorage.setToken(action.payload?.access, rememberMe ? { expires: 30 } : {})
      webStorage.set(REFRESH_TOKEN, action.payload?.refresh, {
        expires: 30,
      })
    },

    actionLogout: (state) => {
      state.userInfo = null
      webStorage.removeAll()
    },

    actionUpdate: (state, action: PayloadAction<User>) => {
      state.userInfo = action.payload
    },

    actionUpdatePartial: (state, action: PayloadAction<Partial<User>>) => {
      state.userInfo = {
        ...(state.userInfo as User),
        ...action.payload,
      }
    },
  },

  extraReducers: () => {
    // Add your extraReducers logic using builder
  },
})

export const { actionLogin, actionLogout, actionUpdate, actionUpdatePartial } = authSlice.actions
export default authSlice.reducer

import { createSlice, current, PayloadAction } from '@reduxjs/toolkit'

const data = Object.freeze({
  wrongSoundSrc: '/sound/wrong-sound.mp3',
  correctSoundSrc: '/sound/correct-sound.mp3',
})

const authSlice = createSlice({
  name: 'app',
  initialState: {
    mute: false,
  },
  reducers: {
    actionPlaySound(state, action: PayloadAction<'wrong' | 'correct'>) {
      const audioElement = document.createElement('audio')
      audioElement.autoplay = true
      audioElement.style.display = 'none'
      audioElement.addEventListener('ended', () => document.body.removeChild(audioElement))
      const { mute } = current(state)
      audioElement.muted = mute
      if (action.payload === 'wrong') audioElement.src = data.wrongSoundSrc
      else if (action.payload === 'correct') audioElement.src = data.correctSoundSrc

      document.body.appendChild(audioElement)
    },
    actionChangeMute: (state, action: PayloadAction<boolean>) => {
      state.mute = action.payload
    },
  },
})

export const { actionPlaySound, actionChangeMute } = authSlice.actions
export default authSlice.reducer

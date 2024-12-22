import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const data = Object.freeze({
  wrongSoundSrc: '/sound/wrong-sound.mp3',
  correctSoundSrc: '/sound/correct-sound.mp3',
})

const authSlice = createSlice({
  name: 'app',
  initialState: {},
  reducers: {
    actionPlaySound(_, action: PayloadAction<'wrong' | 'correct'>) {
      const audioElement = document.createElement('audio')
      audioElement.autoplay = true
      audioElement.style.display = 'none'
      audioElement.addEventListener('ended', () => document.body.removeChild(audioElement))

      if (action.payload === 'wrong') audioElement.src = data.wrongSoundSrc
      else if (action.payload === 'correct') audioElement.src = data.correctSoundSrc

      document.body.appendChild(audioElement)
    },
  },
})

export const { actionPlaySound } = authSlice.actions
export default authSlice.reducer

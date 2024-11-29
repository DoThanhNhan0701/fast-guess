type WsEventType = 'start' | 'question' | 'turn' | 'error' | 'end' | 'user_joined'

export interface IRoom {
  id: string
  topics: string[]
  name: string
  created_by: {
    username: string
    avatar: string | null
  }
  time: number
}

export interface ITopic {
  id: string
  banner: string
  name: string
  count_image: number
}

export interface IImage {
  image: string
  name: string
}

interface IStartGame {
  type: 'start'
  message: string
  current_turn: string
  players: [string, string]
}

interface IQuestion {
  type: 'question'
  question: string
}

interface IEnd {
  type: 'end'
  winner: string
  loser: string
  reason: string
}

interface IError {
  type: 'error'
  message: 'string'
}

interface ITurn {
  type: 'turn'
  correct_user: string
  message: string
  next_turn: string
}

interface IUserJoin {
  type: 'user_joined'
  message: string
  username: string
}

type WsEvent<T extends WsEventType> = T extends 'start'
  ? IStartGame
  : T extends 'question'
  ? IQuestion
  : T extends 'error'
  ? IError
  : T extends 'turn'
  ? ITurn
  : T extends 'user_joined'
  ? IUserJoin
  : IEnd

export type TWsEvent<T extends WsEventType> = WsEvent<T>

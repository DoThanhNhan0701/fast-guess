export interface Student {
  key: string
  name: string
  surname: string
  username: string
  password: string
  groupe: number
  characterClass: string
  level: number
  stars: number
  lessonsDone: number
  quizzDone: number
  spells: number
}

export interface Quiz {
  action: Record<string, any>
  complicated: number
  created_at: string
  grade: number
  id: string
  name: string
  subject: string
  teacher: string
  type: string
  updated_at: string
}

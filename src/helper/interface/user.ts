export interface UserProfile {
  userbase: string
  level: number
  stars: number
  spells: number
  experience: number
  character_model: Record<string, any>
  raw_password: string
  character_class: string
  device_token: string
  updated_at: string
  created_at: string
  ground_name: string
}

export interface UserClass {
  id: string
  name: string
  surname: string
  account: string
  role: string
  is_superuser: boolean
  is_staff: boolean
  language: string
  is_active: boolean
  last_login: string | null
  profile: UserProfile
}

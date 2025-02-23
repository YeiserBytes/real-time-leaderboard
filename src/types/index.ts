export interface User {
  id: string
  username: string
  email: string
  password: string
  createdAt: Date
}

export interface Score {
  id: string
  score: number
  userId: string
  gameId: string
  timestamp: Date
}

export interface Game {
  id: string
  name: string
  description: string
}

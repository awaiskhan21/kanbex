export interface User {
  id?: number
  username?: string
  email?: string
  first_name?: string
  last_name?: string
}

export interface Board {
  id?: number
  title?: string
  description?: string
  created_by?: User
}

export interface Stage extends Partial<Board> {
  board?: string
  board_object?: Readonly<Partial<Board>>
}

export interface Task extends Stage {
  due_date?: string
  completed?: boolean
  priority?: number
  stage?: string
  stage_object?: Partial<Board>
}

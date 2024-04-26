import { fireRequest } from './apiWrapper'

// User
export const postLogin = (params: object) => {
  return fireRequest('login', [], params)
}

export const getCurrentUser = () => {
  return fireRequest('currentUser', [], {}, {}, undefined, true)
}

export const signupUser = (params: object) => {
  return fireRequest('createUser', [], params)
}

export const addUser = (params: object) => {
  return fireRequest('addUser', [], params)
}

export const deleteUser = (username: string) => {
  return fireRequest('deleteUser', [username], {})
}

export const getUserDetails = (username: string, suppress?: boolean) => {
  return fireRequest('getUserDetails', [], {}, { username }, undefined, suppress ?? true)
}
export const updateUserDetails = (username: string, data: object) => {
  return fireRequest('updateUserDetails', [username], data)
}

// Boards

export const getBoards = (params: object) => {
  return fireRequest('getBoards', [], params)
}

export const getBoard = (external_id: string) => {
  return fireRequest('getBoard', [], {}, { external_id })
}

export const createBoard = (params: object) => {
  return fireRequest('createBoard', [], params)
}

export const updateBoard = (params: object, external_id: string) => {
  return fireRequest('updateBoard', [], params, { external_id })
}

export const deleteBoard = (external_id: string) => {
  return fireRequest('deleteBoard', [], {}, { external_id })
}

// Stages

export const getStages = (params: object) => {
  return fireRequest('getStages', [], params)
}

export const getStage = (external_id: string) => {
  return fireRequest('getStage', [], {}, { external_id })
}

export const createStage = (params: object) => {
  return fireRequest('createStage', [], params)
}

export const updateStage = (params: object, external_id: string) => {
  return fireRequest('updateStage', [], params, { external_id })
}

export const deleteStage = (external_id: string) => {
  return fireRequest('deleteStage', [], {}, { external_id })
}

// Tasks

export const getTasks = (params: object) => {
  return fireRequest('getTasks', [], params)
}

export const getTask = (external_id: string) => {
  return fireRequest('getTask', [], {}, { external_id })
}

export const createTask = (params: object) => {
  return fireRequest('createTask', [], params)
}

export const updateTask = (params: object, external_id: string) => {
  return fireRequest('updateTask', [], params, { external_id })
}

export const deleteTask = (external_id: string) => {
  return fireRequest('deleteTask', [], {}, { external_id })
}

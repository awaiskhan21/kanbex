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

// Team

export const getUserTeam = (pathParam: object) => {
  return fireRequest('userTeam', [], {}, pathParam)
}

// Activities

export const getActivites = (params: object) => {
  return fireRequest('getActivities', [], params)
}

export const getStuCreds = (params: object) => {
  return fireRequest('getStuCreds', [], params)
}

export const getActivity = (external_id: string, key?: string) => {
  return fireRequest('getActivity', [], {}, { external_id }, key)
}

export const createActivity = (params: object) => {
  return fireRequest('createActivity', [], params)
}

export const updateActivity = (params: object, external_id: string) => {
  return fireRequest('updateActivity', [], params, {
    external_id
  })
}

export const deleteActivity = (external_id: string) => {
  return fireRequest('deleteActivity', [], {}, { external_id })
}

export const getStuCred = (external_id: string, key?: string) => {
  return fireRequest('getStuCred', [], {}, { external_id }, key)
}

export const createStuCred = (params: object) => {
  return fireRequest('createStuCred', [], params)
}

export const updateStuCred = (params: object, external_id: string) => {
  return fireRequest('updateStuCred', [], params, {
    external_id
  })
}

export const deleteStuCred = (external_id: string) => {
  return fireRequest('deleteStuCred', [], {}, { external_id })
}

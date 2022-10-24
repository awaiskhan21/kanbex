/* eslint-disable sort-keys-fix/sort-keys-fix */
interface Route {
  path: string
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  noAuth?: boolean
}

interface Routes {
  [name: string]: Route
}

const routes: Routes = {
  createUser: {
    method: 'POST',
    noAuth: true,
    path: '/api/v1/users/add_user/'
  },

  // User
  currentUser: {
    method: 'GET',
    path: '/api/v1/users/getcurrentuser/'
  },

  deleteUser: {
    method: 'DELETE',
    path: '/api/v1/users/{username}/'
  },

  login: {
    method: 'POST',
    noAuth: true,
    path: '/api/v1/auth/login/'
  },

  partialUpdateUser: {
    method: 'PATCH',
    path: '/api/v1/users/{username}/'
  },

  token_refresh: {
    method: 'POST',
    path: '/api/v1/auth/token/refresh/'
  },

  token_verify: {
    method: 'POST',
    path: '/api/v1/auth/token/verify/'
  },

  updateUser: {
    method: 'PUT',
    path: '/api/v1/users/'
  },

  // Boards

  createBoard: {
    method: 'POST',
    path: '/api/v1/boards/'
  },

  getBoards: {
    method: 'GET',
    path: '/api/v1/boards/'
  },

  getBoard: {
    method: 'GET',
    path: '/api/v1/boards/{external_id}/'
  },

  updateBoard: {
    method: 'PUT',
    path: '/appi/v1/boards/{external_id}/'
  },

  deleteBoard: {
    method: 'DELETE',
    path: '/api/v1/boards/{external_id}/'
  },

  // Stages

  createStage: {
    method: 'POST',
    path: '/api/v1/stages/'
  },

  getStages: {
    method: 'GET',
    path: '/api/v1/stages/'
  },

  getStage: {
    method: 'GET',
    path: '/appi/v1/stages/{external_id}/'
  },

  updateStage: {
    method: 'PUT',
    path: '/appi/v1/stages/{external_id}/'
  },

  deleteStage: {
    method: 'DELETE',
    path: '/api/v1/stages/{external_id}/'
  },

  // Tasks

  createTask: {
    method: 'POST',
    path: '/api/v1/tasks/'
  },

  getTasks: {
    method: 'GET',
    path: '/api/v1/tasks/'
  },

  getTask: {
    method: 'GET',
    path: '/api/v1/tasks/{external_id}/'
  },

  updateTask: {
    method: 'PUT',
    path: '/appi/v1/tasks/{external_id}/'
  },

  deleteTask: {
    method: 'DELETE',
    path: '/api/v1/tasks/{external_id}/'
  }
}

export default routes

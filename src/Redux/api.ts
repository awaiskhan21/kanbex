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
    path: '/api/v1/users'
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
    path: '/api/v1/auth/token/refresh'
  },

  token_verify: {
    method: 'POST',
    path: '/api/v1/auth/token/verify'
  },

  updateUser: {
    method: 'PUT',
    path: '/api/v1/users'
  }
}

export default routes

import { useRoutes } from 'raviger'

import { Login, Signup } from '../Components/Auth'

const routes = {
  '/': () => <Login />,
  '/login': () => <Login />,
  '/register': () => <Signup />
}

const SessionRouter = () => {
  const content = useRoutes(routes) || <Login />
  const path =
    content &&
    content.props &&
    content.props.children &&
    content.props.children.props &&
    content.props.children.props.value
  const login = !path || path === '/' || path === '/login' || path === '/login/'

  return (
    <div className={!login ? 'bg-zinc-100' : ''}>
      {!login}
      <div className={!login ? 'container mx-auto max-w-5xl p-4' : ''}>{content}</div>
    </div>
  )
}

export default SessionRouter

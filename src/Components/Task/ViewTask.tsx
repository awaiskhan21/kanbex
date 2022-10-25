import { Link } from 'raviger'
import EditIcon from '@mui/icons-material/Edit'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DescriptionIcon from '@mui/icons-material/Description'
import clsx from 'clsx'

import { Task } from '../../types/task'

type ViewTaskProps = {
  task: Task
}

const priorityColor = [
  { text: 'Urgent', color: 'bg-black' },
  { text: 'High', color: 'bg-rose-700' },
  { text: 'Medium', color: 'bg-red-700' },
  { text: 'Low', color: 'bg-sky-700' }
]

export const ViewTask = (props: ViewTaskProps) => {
  const { task } = props

  const priorityBadge = (number: number) => {
    return (
      <div
        className={clsx(
          'rounded-lg border border-zinc-600 bg-zinc-100 px-3 py-1 text-sm font-semibold text-white',
          number > 3 ? 'bg-gray-900' : priorityColor[number].color
        )}
      >
        {priorityColor[number].text || 'Undefined'}
      </div>
    )
  }

  return (
    <div className="mt-2 w-full">
      <div className="mx-2 h-full overflow-hidden rounded-lg bg-white shadow">
        <div className="flex h-full flex-col justify-between p-4">
          <div>
            <div className="flex justify-between">
              <div className="flex flex-row gap-2">
                <h2 className="flex h-8 items-center text-sm">
                  {task.completed ? (
                    <s>{task.title}</s>
                  ) : (
                    <div className="font-bold">{task.title}</div>
                  )}
                </h2>
                <Link href={`/board/${task.board}/stage/${task.stage}/task/${task.id}/update`}>
                  <EditIcon style={{ color: '#10b981' }} />
                </Link>
                <Link href={`/board/${task.board}/stage/${task.stage}/task/${task.id}/delete`}>
                  <DeleteForeverIcon style={{ color: '#dc2626' }} />
                </Link>
              </div>
            </div>
          </div>
          <dl className="grid grid-cols-1 gap-x-1 gap-y-2 sm:grid-cols-1">
            <div className="sm:col-span-1">
              <div className="flex items-center whitespace-nowrap text-sm leading-5  text-gray-500">
                <DescriptionIcon style={{ color: '#71717a', marginRight: '6px' }} />
                <span className="break-normal text-sm leading-5 text-gray-900">
                  {task.description || ''}
                </span>
              </div>
            </div>
            <div className="sm:col-span-1">
              <div className="flex items-center text-sm leading-5 text-gray-500">
                <CalendarMonthIcon style={{ color: '#71717a', marginRight: '6px' }} />
                <span className="break-normal text-sm leading-5 text-gray-900">
                  {task.due_date}
                </span>
              </div>
            </div>
            <div className="sm:col-span-1">
              <div className="flex justify-end text-sm leading-5 text-gray-500">
                <span className="break-normal text-sm leading-5 text-gray-900">
                  {priorityBadge(task.priority || 1)}
                </span>
              </div>
            </div>
          </dl>
        </div>
      </div>
    </div>
  )
}

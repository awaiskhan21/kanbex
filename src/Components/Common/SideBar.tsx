import { Close } from '@mui/icons-material'
import { IconButton, Drawer } from '@mui/material'
import clsx from 'clsx'
import { get } from 'lodash'
import { Link, navigate, usePath } from 'raviger'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'

import { PREFERENCE_SIDEBAR_KEY, SIDEBAR } from '../../Common/constants'
import useWindowDimensions from '../../Common/hooks/useWindowDimensions'

const LOGO = 'https://jugaad.ecellvnit.org/img/jugaadnew.png'
const LOGO_COLLAPSE = 'https://jugaad.ecellvnit.org/img/jugaadnew.png'

const menus = [
  {
    icon: 'fas fa-home',
    link: '/home',
    title: 'Home'
  },
  {
    icon: 'fas fa-money-bill',
    link: '/activities',
    title: 'Activities'
  },
  {
    icon: 'fas fa-id-card',
    link: '/stucreds',
    title: 'StuCred Regsitration'
  },
  {
    icon: 'fas fa-history',
    link: '/recent',
    title: 'Recent'
  }
]

interface SideBarProps {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export const SideBar: React.FC<SideBarProps> = ({ isOpen, setIsOpen }) => {
  const state: any = useSelector((state) => state)
  const { currentUser } = state
  const loginUser = `${get(currentUser, 'data.first_name', '')} ${get(
    currentUser,
    'data.last_name',
    ''
  )}`
  const path = usePath()
  const url = path?.replaceAll('/', '')

  const active = menus.reduce((acc, menu) => {
    const tag = menu.link.replaceAll('/', '')

    return url?.includes(tag) ? tag : acc
  }, '')

  const { width } = useWindowDimensions()
  const mobileBreakpoint = 768
  const isMobile = width <= mobileBreakpoint ? true : false
  const [enableCollapse, setEnableCollapse] = useState(
    localStorage.getItem(PREFERENCE_SIDEBAR_KEY) === SIDEBAR.COLLAPSED
  )
  const [expanded, setExpanded] = useState(!enableCollapse)
  const handleSignOut = () => {
    localStorage.removeItem('jugaad_access_token')
    localStorage.removeItem('jugaad_refresh_token')
    navigate('/')
    window.location.reload()
  }

  useEffect(() => {
    window.addEventListener('storage', () => {
      setEnableCollapse(localStorage.getItem(PREFERENCE_SIDEBAR_KEY) === SIDEBAR.COLLAPSED)
    })
  }, [])

  useEffect(() => {
    setIsOpen(false)
    setExpanded(isMobile)

    return () => {
      setIsOpen(false)
    }
  }, [isMobile, setIsOpen])

  useEffect(() => {
    setExpanded(isMobile || !enableCollapse)
  }, [isMobile, enableCollapse, setExpanded])

  const open = isOpen || !isMobile

  return (
    <Drawer
      PaperProps={{
        className: 'bg-primary-500'
      }}
      anchor="left"
      className={clsx('transition-all duration-300', expanded ? 'w-64' : 'w-14')}
      open={open}
      variant={isMobile ? 'temporary' : 'persistent'}
      onClose={() => setIsOpen(false)}
      onMouseEnter={() => !isMobile && enableCollapse && setExpanded(true)}
      onMouseLeave={() => !isMobile && enableCollapse && setExpanded(false)}
    >
      <div
        className={clsx(
          'bg-primary-400 flex h-full flex-col overflow-hidden transition-all duration-300',
          expanded ? 'w-64' : 'w-14'
        )}
      >
        <div className="flex items-center justify-between">
          <Link className="block w-28 shrink-0" href="/">
            <img
              alt="jugaad logo"
              className="m-2 h-auto w-auto p-2 transition"
              src={expanded ? LOGO : LOGO_COLLAPSE}
            />
          </Link>
          <IconButton
            aria-label="Close Sidebar"
            className="fill-current px-4 text-white md:hidden"
            onClick={() => setIsOpen(false)}
          >
            <Close color="inherit" />
          </IconButton>
        </div>
        <nav className="flex-1 overflow-x-hidden px-2">
          {menus.map((item) => {
            return (
              <Link
                key={item.title}
                className={clsx(
                  'hover:bg-primary-500 my-1 flex w-10 items-center justify-items-start overflow-hidden rounded py-1 transition-all duration-300 hover:text-white',
                  active === item.link.replaceAll('/', '')
                    ? 'bg-primary-400 text-gray-700 hover:bg-gray-900'
                    : 'bg-primary-400 text-gray-700',
                  expanded && 'w-60'
                )}
                href={item.link}
                onClick={() => isMobile && setIsOpen(false)}
              >
                <div className="flex h-8 w-10 shrink-0 items-center justify-center">
                  <i className={clsx(item.icon, 'text-lg')} />
                </div>
                {
                  <div
                    className={clsx(
                      'whitespace-nowrap transition-all duration-300',
                      expanded ? 'w-60' : 'w-0'
                    )}
                  >
                    {item.title}
                  </div>
                }
              </Link>
            )
          })}
        </nav>

        <div
          className={clsx(
            'flex-no-wrap ml-2 flex items-center overflow-hidden py-4 transition-all duration-300',
            expanded ? 'w-60' : 'w-10'
          )}
        >
          <div className="flex w-10 shrink-0 items-center justify-center">
            <Link
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white"
              href="/user/profile"
            >
              <i className="fas fa-user text-primary-900 block text-base" />
            </Link>
          </div>
          <div className="ml-3 overflow-hidden whitespace-nowrap">
            <Link
              className="mb-1 text-base font-medium leading-5 text-gray-800"
              href="/user/profile"
            >
              {loginUser}
            </Link>
            <p
              className="group-hover:text-primary-100 cursor-pointer text-sm font-medium leading-4 text-gray-900 transition duration-150 ease-in-out"
              onClick={handleSignOut}
            >
              Sign Out
            </p>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { CircularProgress } from '@mui/material'
import { get } from 'lodash'
import { navigate } from 'raviger'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import * as Notification from '../../Utils/Notification.js'
import { signupUser } from '../../Redux/actions'
import TextFormField from '../Common/Form/FormFields/TextFormField'
import { FieldChangeEventHandler } from '../Common/Form/FormFields/Utils'
import kanbex from '../../assets/images/kanbex.png'

export const Signup = () => {
  const dispatch: any = useDispatch()
  const initForm: any = {
    password: '',
    passwordV2: '',
    username: '',
    first_name: '',
    last_name: '',
    email: ''
  }
  const initErr: any = {}
  const [form, setForm] = useState(initForm)
  const [errors, setErrors] = useState(initErr)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordV2, setShowPasswordV2] = useState(false)

  // display spinner while login is under progress
  const [loading, setLoading] = useState(false)

  const handleChange: FieldChangeEventHandler<string> = (event: any) =>
    setForm({ ...form, [event.name]: event.value })

  const validateData = () => {
    let hasError = false
    const err = Object.assign({}, errors)

    Object.keys(form).forEach((key) => {
      if (typeof form[key] === 'string' && key !== 'password' && key !== 'confirm') {
        if (!form[key].match(/\w/)) {
          hasError = true
          err[key] = 'field_required'
        }
      }
      if (!form[key]) {
        hasError = true
        err[key] = 'field_required'
      }
    })
    if (hasError) {
      setErrors(err)

      return false
    }

    return form
  }

  // set loading to false when component is dismounted
  useEffect(() => {
    return () => {
      setLoading(false)
    }
  }, [])

  const handleSubmit = (e: any) => {
    e.preventDefault()
    let valid = validateData()

    if (form['password'] !== form['passwordV2']) {
      valid = false
      Notification.Error({
        msg: "Password don't match"
      })
    }

    if (valid) {
      setLoading(true)

      dispatch(signupUser(valid))
        .then((resp: any) => {
          const statusCode = get(resp, 'status', '')

          if (statusCode === 429) {
            setLoading(false)
          } else if (statusCode === 201) {
            navigate('/login')
            window.location.reload()
          } else {
            // error from server set back to login button
            setLoading(false)
          }

          return
        })
        .catch((_ex: any) => {
          // console.log("Error")
        })
    }
  }

  return (
    <div className="relative flex flex-col md:h-screen md:flex-row">
      <div className="top-2 right-2 bg-zinc-500 p-2 md:absolute md:bg-white md:p-0" />
      <div className="flex flex-col justify-center border-black bg-black md:h-full md:w-1/2">
        <div className="flex items-center justify-center">
          <a href={'/'}>
            <img alt="kanbex logo" className="h-auto w-auto" src={kanbex} />{' '}
          </a>
        </div>
      </div>

      <div className="my-4 flex w-full items-center justify-center md:mt-0 md:h-full md:w-1/2">
        <div className="mt-4 bg-white p-4 md:mt-20">
          <div className="pt-4 text-center text-2xl font-bold text-zinc-900">Register</div>

          <form onSubmit={handleSubmit}>
            <div className="my-2">
              <TextFormField
                error={errors.username}
                label={<span className="text-sm">Username</span>}
                name="username"
                value={form.username}
                onChange={handleChange}
              />
              <TextFormField
                error={errors.first_name}
                label={<span className="text-sm">Firstname</span>}
                name="first_name"
                value={form.first_name}
                onChange={handleChange}
              />
              <TextFormField
                error={errors.last_name}
                label={<span className="text-sm">Lastname</span>}
                name="last_name"
                value={form.last_name}
                onChange={handleChange}
              />
              <TextFormField
                error={errors.email}
                label={<span className="text-sm">Email</span>}
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
              />
              <div className="relative w-full">
                {showPassword ? (
                  <VisibilityIcon
                    className="absolute right-2 top-11"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                ) : (
                  <VisibilityOffIcon
                    className="absolute right-2 top-11"
                    onClick={() => setShowPassword(!showPassword)}
                  />
                )}
                <TextFormField
                  className="w-full"
                  error={errors.password}
                  label={<span className="text-sm">Password</span>}
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={handleChange}
                />
              </div>
              <div className="relative w-full">
                {showPasswordV2 ? (
                  <VisibilityIcon
                    className="absolute right-2 top-11"
                    onClick={() => setShowPasswordV2(!showPasswordV2)}
                  />
                ) : (
                  <VisibilityOffIcon
                    className="absolute right-2 top-11"
                    onClick={() => setShowPasswordV2(!showPasswordV2)}
                  />
                )}
                <TextFormField
                  className="w-full"
                  error={errors.passwordV2}
                  label={<span className="text-sm">Confirm Password</span>}
                  name="passwordV2"
                  type={showPasswordV2 ? 'text' : 'password'}
                  value={form.passwordV2}
                  onChange={handleChange}
                />
              </div>
              {loading ? (
                <div className="flex items-center justify-center">
                  <CircularProgress className="text-zinc-900" />
                </div>
              ) : (
                <button
                  className="inline-flex w-full cursor-pointer items-center justify-center rounded bg-zinc-800 px-4 py-2 text-sm font-semibold text-white"
                  type="submit"
                >
                  Signup
                </button>
              )}
            </div>
          </form>
          <div className="mt-4 flex w-full items-center justify-center pb-4">
            <a
              className="text-sm text-zinc-800 underline underline-offset-4 hover:text-zinc-900"
              href="/login"
            >
              Have an account? Login
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

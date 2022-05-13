import axios from 'axios'
import { Suspense, useCallback, useEffect, useRef, useState } from 'react'
import {
  Navigate,
  Route,
  Routes,
  
  useLocation,
  useNavigate,
} from 'react-router-dom'
import Login from './Pages/Login'
import ResetPassword from './Pages/ResetPassword'
import TaskItem from './Pages/Tasks/item'
import TaskList from './Pages/Tasks/list'
import VolumeItem from './Pages/Volume'
import * as routePath from './routePaths'
import { MAIN_PATH, RESET_PASSWORD_PAGE_PATH } from "./routePaths";
import Main from "./Pages/Main";

const TOKEN_KEY = 'user-token'

function App() {
  // const navigate = useNavigate()
  // const [token, setToken] = useState(null)
  const [userState, setUserState] = useState(null)
  // const [loading, setLoadingStatus] = useState(true)
  // const location = useLocation()
  // const tempApi = useRef()

  // const createApi = useCallback(() => {
  //
  //   if (!tempApi.current) {
  //     const axiosInstance = axios.create({
  //       withCredentials: true,
  //       timeout: 250000,
  //       baseURL: `${BASE_URL}/api`
  //     })
  //
  //     async function requestInterceptor(target, thisArg, argArray) {
  //       try {
  //         return await target.apply(thisArg, argArray)
  //       } catch (e) {
  //         const {request: {status}} = e
  //         if (status === 401) {
  //           setToken(null)
  //           setUserState(null)
  //           localStorage.removeItem(TOKEN_KEY)
  //           localStorage.removeItem(COOKIE_KEY)
  //           navigate("/manage/login")
  //         }
  //         throw e
  //       }
  //     }
  //
  //     axiosInstance.get = new Proxy(axiosInstance.get, {
  //       apply: requestInterceptor
  //     })
  //     axiosInstance.post = new Proxy(axiosInstance.post, {
  //       apply: requestInterceptor
  //     })
  //     axiosInstance.put = new Proxy(axiosInstance.put, {
  //       apply: requestInterceptor
  //     })
  //     axiosInstance.delete = new Proxy(axiosInstance.delete, {
  //       apply: requestInterceptor
  //     })
  //
  //     tempApi.current = axiosInstance
  //     return axiosInstance
  //   }
  //   return tempApi.current
  //
  // }, [])

  // const api = useRef(createApi())

  // const userRequest = useCallback(async () => {
  //   try {
  //     setLoadingStatus(true)
  //     const {data} = await api.current.get("/current_user")
  //     setUserState(data)
  //   } catch (e) {
  //     setToken(null)
  //   } finally {
  //     setLoadingStatus(false)
  //   }
  // }, [])

  // useEffect(() => {
  //   const token = localStorage.getItem(TOKEN_KEY)
  //   const key = localStorage.getItem(COOKIE_KEY)
  //   if (token !== null) {
  //     setToken(token)
  //     document.cookie = `${key}=${token}`;
  //   } else {
  //     (async () => {
  //       if (window.PasswordCredential && location.pathname !== "/login") {
  //         try {
  //           const credential = await window.navigator.credentials.get({password: true, mediation: "optional"})
  //           if (credential) {
  //             await AuthRequest({email: credential.id, password: credential.password})
  //           }
  //           return null
  //         } catch (e) {
  //           return null
  //         }
  //       } else {
  //         // ничего не грузим. т.к. по умолчанию приложение пытается что-то грузить снимаем флаг
  //         setLoadingStatus(false)
  //         return null
  //       }
  //     })()
  //   }
  // }, [])
  //
  //
  // useWatch(token, (token) => {
  //   if (token !== null) {
  //     if (userState === null) {
  //       userRequest()
  //     }
  //   } else {
  //     setUserState(null)
  //   }
  // })

  return (
    <Suspense fallback={<div>Загрузка...</div>}>
      <Routes>
        {userState === null ? (
          <>
            <Route path={routePath.LOGIN_PAGE_PATH} element={<Login setToken={setUserState} />} />
            <Route path={routePath.RESET_PASSWORD_PAGE_PATH} element={<ResetPassword setToken={setUserState} />} />
            <Route
              path="*"
              element={<Navigate to={routePath.LOGIN_PAGE_PATH} />}
            />
          </>
        ) : (
          <Route element={<Main />}>
            <Route path={routePath.TASK_ITEM_PATH} element={<TaskItem />} />
            <Route path={routePath.TASK_LIST_PATH} element={<TaskList />} />
            <Route path={routePath.VOLUME_ITEM_PATH} element={<VolumeItem />} />
            <Route
              path="*"
              element={<Navigate to={routePath.TASK_LIST_PATH} replace />}
            />
          </Route>
        )}
      </Routes>
    </Suspense>
  )
}

export default App

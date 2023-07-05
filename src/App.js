import axios from 'axios'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import Login from './Pages/Login'
import ResetPassword from './Pages/ResetPassword'
import TaskList from './Pages/Tasks/list'
import ArchiveList from './Pages/Tasks/archiveList'
import VolumeItem from './Pages/Volume'
import BasketList from './Pages/Basket/list'
import * as routePath from './routePaths'
import createAxiosInstance, { API_URL } from './api'
import Main from './Pages/Main'
import {
  URL_KERBEROS_LOGIN,
  URL_LOGIN,
  URL_USER_CHANGE_PASSWORD,
  URL_USER_OBJECT,
} from './ApiList'
import useTokenStorage from '@Components/Logic/UseTokenAndUserStorage'
import { ApiContext, TokenContext } from './contants'
import { DocumentItem, TaskItem, TaskNewItem } from './Pages/Tasks/item'
import { CREATE_PASSWORD_PAGE_PATH, TASK_STORAGE_LIST_PATH } from './routePaths'
import Search from '@/Pages/Search'
import NotificationBox from '@/Components/Notificator/NotificationBox'
import CreatePassword from '@/Pages/CreatePassword'
import Reporting from '@/Pages/Rporting'
import ViewedTask from '@/Pages/Tasks/viewed'
import Settings from '@/Pages/Settings'
import Notification from '@/Pages/Notification'
import StorageList from '@/Pages/Tasks/storegeList'

// Апи на получения токена базовое и не требует
const authorizationRequest = async (data) => {
  const {
    data: { token },
  } = await axios.post(URL_LOGIN, data)
  return token
}

function App() {
  const navigate = useNavigate()
  const [axiosInstanceParams, updateAxiosInstanceParams] = useState({})
  const [login, setLogin] = useState('')
  const apiInstance = useMemo(
    () => createAxiosInstance(axiosInstanceParams),
    [axiosInstanceParams],
  )

  const userObjectRequest = useCallback(async () => {
    try {
      const { data } = await apiInstance.post(URL_USER_OBJECT)
      return data
    } catch (e) {
      const { response: { status, data: { dss_user_name } = {} } = {} } = e

      if (status === 418) {
        setLogin(dss_user_name)
        navigate(CREATE_PASSWORD_PAGE_PATH)
        return null
      }
      throw e
    }
  }, [apiInstance, navigate])

  const { userState, loginRequest, userObjectLoading, dropToken, token } =
    useTokenStorage({
      authorizationRequest,
      userObjectRequest,
      addTokenToAxiosInstance: useCallback(
        (token) => updateAxiosInstanceParams({ token }),
        [],
      ),
      kerberosUrl: `${API_URL}${URL_KERBEROS_LOGIN}`,
    })

  const changePasswordRequest = useCallback(
    async ({ login, password, new_password }) => {
      const token = await loginRequest({ login, password })
      return apiInstance.post(URL_USER_CHANGE_PASSWORD, {
        password: new_password,
        token,
      })
    },
    [apiInstance, loginRequest],
  )

  const createPasswordRequest = useCallback(
    async ({ new_password }) => {
      await apiInstance.post(URL_USER_CHANGE_PASSWORD, {
        password: new_password,
        token,
      })
      await loginRequest({ login, password: new_password })
      setLogin('')
    },
    [apiInstance, login, loginRequest, token],
  )

  useEffect(() => {
    apiInstance.interceptors.response.use(
      function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        return response
      },
      function (error) {
        const { status } = error
        if (status === 415) {
          dropToken()
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error)
      },
    )
  }, [apiInstance, dropToken])

  return (
    <>
      <ApiContext.Provider value={apiInstance}>
        <TokenContext.Provider
          value={useMemo(() => ({ token, dropToken }), [dropToken, token])}
        >
          <Suspense fallback={<div>Загрузка...</div>}>
            <Routes>
              {userState === null ? (
                <>
                  <Route
                    path={routePath.LOGIN_PAGE_PATH}
                    element={<Login loginRequest={loginRequest} />}
                  />
                  <Route
                    path={routePath.RESET_PASSWORD_PAGE_PATH}
                    element={
                      <ResetPassword loginRequest={changePasswordRequest} />
                    }
                  />
                  <Route
                    path={routePath.CREATE_PASSWORD_PAGE_PATH}
                    element={
                      <CreatePassword loginRequest={createPasswordRequest} />
                    }
                  />
                  {!userObjectLoading && (
                    <Route
                      path="*"
                      element={<Navigate to={routePath.LOGIN_PAGE_PATH} />}
                    />
                  )}
                </>
              ) : (
                <Route element={<Main initUrl={routePath.TASK_LIST_PATH} />}>
                  <Route
                    path={routePath.DOCUMENT_ITEM_PATH}
                    element={<DocumentItem />}
                  />
                  <Route
                    path={routePath.TASK_ITEM_PATH}
                    element={<TaskItem />}
                  />
                  <Route
                    path={routePath.TASK_LIST_ARCHIVE_PATH}
                    element={<ArchiveList />}
                  />
                  <Route
                    path={routePath.TASK_NEW_ITEM_PATH}
                    element={<TaskNewItem />}
                  />
                  <Route
                    path={routePath.TASK_LIST_PATH}
                    element={<TaskList />}
                  />
                  <Route
                    path={routePath.TASK_STORAGE_LIST_PATH}
                    element={<StorageList />}
                  />
                  <Route
                    path={routePath.VOLUME_ITEM_PATH}
                    element={<VolumeItem />}
                  />
                  <Route
                    path={routePath.DELETED_LIST_PATH}
                    element={<BasketList />}
                  />
                  <Route
                    path="*"
                    element={<Navigate to={routePath.TASK_LIST_PATH} replace />}
                  />
                  <Route
                    path={routePath.SEARCH_PAGE_PATH}
                    element={<Search />}
                  />
                  <Route
                    path={routePath.REPORTING_PATH}
                    element={<Reporting />}
                  />
                  <Route
                    path={routePath.TASK_VIEWED_LIST_PATH}
                    element={<ViewedTask />}
                  />
                  <Route
                    path={routePath.SETTINGS_PATH}
                    element={<Settings />}
                  />
                  <Route
                    path={routePath.NOTIFICATION_PATH}
                    element={<Notification />}
                  />
                </Route>
              )}
            </Routes>
          </Suspense>
        </TokenContext.Provider>
      </ApiContext.Provider>
      <NotificationBox />
    </>
  )
}

export default App

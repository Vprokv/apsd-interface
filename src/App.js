import axios from 'axios'
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './Pages/Login'
import ResetPassword from './Pages/ResetPassword'
import TaskList from './Pages/Tasks/list'
import ArchiveList from './Pages/Tasks/archiveList'
import VolumeItem from './Pages/Volume'
import BasketList from './Pages/Basket/list'
import * as routePath from './routePaths'
import createAxiosInstance from './api'
import Main from './Pages/Main'
import {
  URL_LOGIN,
  URL_SYSTEM_META,
  URL_USER_CHANGE_PASSWORD,
  URL_USER_OBJECT,
} from './ApiList'
import useTokenStorage from '@Components/Logic/UseTokenAndUserStorage'
import { ApiContext, TokenContext } from './contants'
import { DocumentItem, TaskNewItem, TaskItem } from './Pages/Tasks/item'
import {
  SEARCH_PAGE_PATH,
  TASK_ITEM_PATH,
  TASK_LIST_ARCHIVE_PATH,
} from './routePaths'
import Search from '@/Pages/Search'

// Апи на получения токена базовое и не требует
const authorizationRequest = async (data) => {
  const {
    data: { token },
  } = await axios.post(URL_LOGIN, data)
  return token
}

function App() {
  const [axiosInstanceParams, updateAxiosInstanceParams] = useState({})
  const apiInstance = useMemo(
    () => createAxiosInstance(axiosInstanceParams),
    [axiosInstanceParams],
  )
  const userObjectRequest = useCallback(async () => {
    const { data } = await apiInstance.post(URL_USER_OBJECT)
    return data
  }, [apiInstance])

  const { userState, loginRequest, userObjectLoading, dropToken, token } =
    useTokenStorage({
      authorizationRequest,
      userObjectRequest,
      addTokenToAxiosInstance: useCallback(
        (token) => updateAxiosInstanceParams({ token }),
        [],
      ),
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

  useEffect(() => {
    ;(async () => {
      // TODO включить что-то из этого, пока оба запроса валятся
      // const {data} = axios.get(URL_SYSTEM_META)
      // const {data} = axios.get("/settings.json")
    })()
  }, [])

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
                {!userObjectLoading && (
                  <Route
                    path="*"
                    element={<Navigate to={routePath.LOGIN_PAGE_PATH} />}
                  />
                )}
              </>
            ) : (
              <Route element={<Main />}>
                <Route
                  path={routePath.DOCUMENT_ITEM_PATH}
                  element={<DocumentItem />}
                />
                <Route path={routePath.TASK_ITEM_PATH} element={<TaskItem />} />
                <Route
                  path={routePath.TASK_LIST_ARCHIVE_PATH}
                  element={<ArchiveList />}
                />
                <Route
                  path={routePath.TASK_NEW_ITEM_PATH}
                  element={<TaskNewItem />}
                />
                <Route path={routePath.TASK_LIST_PATH} element={<TaskList />} />
                <Route
                  path={routePath.VOLUME_ITEM_PATH}
                  element={<VolumeItem />}
                />
                <Route
                  path={routePath.DELETED_ITEM_PATH}
                  element={<BasketList />}
                />
                <Route
                  path="*"
                  element={<Navigate to={routePath.TASK_LIST_PATH} replace />}
                />
                <Route path={routePath.SEARCH_PAGE_PATH} element={<Search />} />
              </Route>
            )}
          </Routes>
        </Suspense>
      </TokenContext.Provider>
    </ApiContext.Provider>
  )
}

export default App

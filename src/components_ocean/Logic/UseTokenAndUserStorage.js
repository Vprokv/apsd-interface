import {useState, useEffect, useCallback} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import { useRecoilState, atom } from "recoil";
import useWatch from "../Utils/Hooks/useWatch";

export const userAtom = atom({ key: "userAtom", default: null })

const initLocation = window.location.pathname !== "/login" ? window.location.pathname : "/"

const useTokenAndUserStorage = ({
  userObjectRequest,
  authorizationRequest,
  addTokenToAxiosInstance,
  tokenKey = "Authorization",
}) => {
  const navigate = useNavigate()
  const location = useLocation()
  const [token, storeToken] = useState(null)
  const [userState, setUserState] = useRecoilState(userAtom)
  const [userObjectLoading, setLoadingStatus] = useState(true)

  const dropToken = useCallback(() => {
    storeToken(null)
  },[])
  
  const loginRequest = useCallback(async (args) => {
    const token = await authorizationRequest(args)
    addTokenToAxiosInstance(token)
    storeToken(token)
    localStorage.setItem(tokenKey, token)
    navigate(initLocation)
    return token
  }, [authorizationRequest, navigate, addTokenToAxiosInstance, tokenKey])

  const getUser = useCallback(async () => {
    try {
      setLoadingStatus(true)
      const userState = await userObjectRequest()
      setUserState(userState)
    } catch (e) {
      storeToken(null)
    } finally {
      setLoadingStatus(false)
    }
  }, [setUserState, userObjectRequest])

  // вычитываем токен 
  useEffect(() => {
    const token = localStorage.getItem(tokenKey)
    if (token !== null) {
      storeToken(token)
      addTokenToAxiosInstance(token)
    } else {
      (async () => {
        if (window.PasswordCredential && location.pathname !== "/login") {
          try {
            const credential = await window.navigator.credentials.get({password: true, mediation: "optional"})
            if (credential) {
              await loginRequest({email: credential.id, password: credential.password})
            }
            return null
          } catch (e) {
            return null
          }
        } else {
          // ничего не грузим. т.к. по умолчанию приложение пытается что-то грузить снимаем флаг
          setLoadingStatus(false)
          return null
        }
      })()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useWatch(token, (token, prevToken) => {
    if (token !== null) {
      if (userState === null) {
        getUser()
      }
    } else if (prevToken !== undefined) {
      setUserState(null)
      localStorage.removeItem(tokenKey)
    }
  })

  // // удаляем стейт пользователя при уничтожении компонента
  // useEffect(() => () => {
  //   setUserState(null)
  //   removeToken()
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  return {
    userState, token, loginRequest, userObjectLoading, dropToken
  }
}

export default useTokenAndUserStorage
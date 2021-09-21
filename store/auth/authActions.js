import axios from "axios";
import * as SecureStore from "expo-secure-store"

export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";

export const SET_ERROR_MESSAGE = "SET_ERROR_MESSAGE";
export const CLEAR_ERROR_MESSAGE = "CLEAR_ERROR_MESSAGE";

export const setErrorMessage = (message) => ({
    type: SET_ERROR_MESSAGE,
    payload: message
})

export const clearErrorMessage = () => ({
    type: CLEAR_ERROR_MESSAGE
})

export const login = (username, password) => async (dispatch) => {
    return axios
        .post("https://api.ecoledirecte.com/v3/login.awp", `data=${JSON.stringify({
            identifiant: username,
            motdepasse: password
        })}`)
        .then(async (res) => {
            const { data, token, message } = res.data

            if (token && data.accounts.length) {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        token: token,
                        accounts: data.accounts
                    }
                })
                // console.log("Logged in : ", password, username)

                await SecureStore.setItemAsync("pswd", password)
                await SecureStore.setItemAsync("user", username)

                return Promise.resolve()
            }

            // console.log("Login failed : ", message)

            dispatch({
                type: LOGIN_FAIL
            })

            dispatch({
                type: SET_ERROR_MESSAGE,
                payload: message
            })

            return Promise.reject()
        })
}

export const refreshUser = () => async (dispatch) => {
    const password = await SecureStore.getItemAsync("pswd")
    const username = await SecureStore.getItemAsync("user")

    return dispatch(login(username, password))
}

export const logout = () => (dispatch) => {
    dispatch({
        type: LOGOUT
    })
}
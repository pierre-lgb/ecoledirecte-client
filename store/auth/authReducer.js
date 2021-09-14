import {
    LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT,
    SET_ERROR_MESSAGE, CLEAR_ERROR_MESSAGE
} from "./authActions"

const initialState = {
    isLoggedIn: false,
    token: "",
    accounts: [],
    errorMessage: ""
}

export default function (state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            return {
                ...state,
                isLoggedIn: true,
                token: action.payload.token,
                accounts: action.payload.accounts
            }
        case LOGIN_FAIL:
        case LOGOUT:
            return {
                ...state,
                isLoggedIn: false,
                token: "",
                accounts: []
            }
        case SET_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: action.payload
            }
        case CLEAR_ERROR_MESSAGE:
            return {
                ...state,
                errorMessage: ""
            }
        default:
            return state
    }
}
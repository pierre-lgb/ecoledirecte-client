import { useEffect, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { refreshUser } from "../../store/auth/authActions";
import { responseCodes } from "../../constants";

import axios from "axios";

export default (url, params = {}, body = {}, method) => {
    const [data, setData] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [refetchIndex, setRefetchIndex] = useState(0)

    const dispatch = useDispatch()
    const { token } = useSelector(state => state.auth)

    const refetch = () => {
        setLoading(true) // Prevent refresh indicator glitch
        setRefetchIndex(prevRefetchIndex => prevRefetchIndex + 1)
    }

    useEffect(() => {
        console.log("[INFO] Fetch EcoleDirecte API :", url)
        setLoading(true);
        let request;

        switch (method) {
            // case "GET":
            //     request = axios.get(url, params)
            case "POST":
            default:
                request = axios.post(url, `data=${JSON.stringify({
                    ...body,
                    token
                })}`, {
                    params
                })
        }

        request
            .then(res => {
                if (res.data.message) {
                    setError(res.data.message)
                }
                switch (res.data.code) {
                    case responseCodes.sessionExpired:
                    case responseCodes.invalidToken:
                        console.log("[INFO] Refreshing user")
                        dispatch(refreshUser())
                    case responseCodes.success:
                    default:
                        break
                }

                setData(res.data)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [url, refetchIndex]);

    return { data, error, loading, refetch };
};
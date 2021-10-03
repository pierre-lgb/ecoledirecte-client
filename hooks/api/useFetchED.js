import {
    useEffect,
    useState
} from "react";
import {
    useSelector,
    useDispatch
} from 'react-redux';
import { refreshUser } from "../../store/auth/authActions";
import { responseCodes } from "../../constants";

import axios from "axios";

export default (url, params = {}, body = {}) => {
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
        setError("")

        axios.post(url, `data=${JSON.stringify({
            ...body,
            token
        })}`, {
            params
        })
            .then(res => {
                if (res.data.message) {
                    setError(res.data.message)
                }
                switch (res.data.code) {
                    case responseCodes.sessionExpired:
                    case responseCodes.invalidToken:
                        console.log("[INFO] Refreshing user")
                        dispatch(refreshUser())
                            .then(() => refetch())
                        return;
                    case responseCodes.success:
                    default:
                        break
                }

                setData(res.data)
            })
            .catch(error => {
                if (axios.isCancel(error)) {
                    console.log('Request canceled', error.message);
                } else {
                    console.log(error)
                }
            })
            .finally(() => {
                setLoading(false)
            })
    }, [url, refetchIndex]);

    return { data, error, loading, refetch };
};
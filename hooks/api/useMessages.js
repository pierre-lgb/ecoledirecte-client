import useDidMountEffect from '../useDidMountEffect';
import useFetchED from "./useFetchED";

const useMessages = (box, idClasseur, query, yearMessages) => {
    const { data, error, loading, refetch } = useFetchED('https://api.ecoledirecte.com/v3/eleves/5241/messages.awp', {
        "verbe": "getall",
        "typeRecuperation": box,
        "orderBy": "date",
        "order": "desc",
        "query": query,
        "itemsPerPage": 0,
        "page": 0,
        "idClasseur": idClasseur
    }, {
        "anneeMessages": yearMessages // (undefined by default)
    })

    useDidMountEffect(() => {
        refetch()
    }, [box, idClasseur, query, yearMessages])

    return {
        messages: data?.data.messages[box] || [],
        classeurs: data?.data.classeurs || [],
        error,
        loading,
        refetchMessages: refetch
    }
}

export default useMessages
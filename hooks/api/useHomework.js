import useFetchED from "./useFetchED";

const useDocuments = () => {
    const { data, error, loading, refetch } = useFetchED('https://api.ecoledirecte.com/v3/elevesDocuments.awp', {
        "verbe": "get"
    })

    return {}
}

export default useDocuments
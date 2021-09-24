import useFetchED from "./useFetchED";

const useDocuments = () => {
    const { data, error, loading, refetch } = useFetchED('https://api.ecoledirecte.com/v3/elevesDocuments.awp', {
        "verbe": "get"
    })

    const documents = data?.data

    return {
        documents: documents ? Object.keys(documents).map(section => {
            if (Array.isArray(documents[section])) {
                return {
                    title: section,
                    data: documents[section]
                }
            }
            return false
        }).filter(Boolean) : [],
        error,
        loading,
        refetchDocuments: refetch
    }
}

export default useDocuments
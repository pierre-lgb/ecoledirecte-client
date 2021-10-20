import useFetchED from "./useFetchED";

const useDatesWithHomework = (date) => {
    const { data, error, loading, refetch } = useFetchED((userId) => {
        return `https://api.ecoledirecte.com/v3/Eleves/${userId}/cahierdetexte/${date.format("YYYY-MM-DD")}.awp`
    }, {
        "verbe": "get"
    })

    return {
        homework: data?.data || [],
        error,
        loading,
        refetchHomework: refetch
    }
}

export default useDatesWithHomework
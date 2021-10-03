import useFetchED from "./useFetchED";

const useDatesWithHomework = (date) => {
    const { data, error, loading, refetch } = useFetchED(`https://api.ecoledirecte.com/v3/Eleves/5241/cahierdetexte/${date.format("YYYY-MM-DD")}.awp`, {
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
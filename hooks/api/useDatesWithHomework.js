import useFetchED from "./useFetchED";

const useDatesWithHomework = () => {
    const { data, error, loading, refetch } = useFetchED(`https://api.ecoledirecte.com/v3/Eleves/5241/cahierdetexte.awp`, {
        "verbe": "get"
    })

    return {
        datesWithHomework: data?.data ? Object.keys(data.data) : null,
        error,
        loading
    }
}

export default useDatesWithHomework
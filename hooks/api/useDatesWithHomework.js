import useFetchED from "./useFetchED";

const useDatesWithHomework = () => {
    const { data, error, loading } = useFetchED((userId) => {
        return `https://api.ecoledirecte.com/v3/Eleves/${userId}/cahierdetexte.awp`
    }, {
        "verbe": "get"
    })

    return {
        datesWithHomework: data?.data ? Object.keys(data.data) : null,
        error,
        loading
    }
}

export default useDatesWithHomework
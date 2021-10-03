import useFetchED from "./useFetchED";

const useTimetableEvents = (date) => {
    const { data, error, loading, refetch } = useFetchED('https://api.ecoledirecte.com/v3/E/5241/emploidutemps.awp', {
        "verbe": "get"
    }, {
        "dateDebut": date.format("YYYY-MM-DD"),
        "dateFin": date.format("YYYY-MM-DD"),
        "avecTrous": false
    })

    let filteredEvents = (data?.data.map((event) => ({
        matiere: event.matiere,
        codeMatiere: event.codeMatiere,
        startDate: event.start_date,
        endDate: event.end_date,
        profs: [event.prof],
        salle: event.salle,
        canceled: event.isAnnule
    })) || [])
        // Combining events with the same startDate && endDate but different teachers
        .reduce((acc, val, i) => {
            const index = acc.findIndex(el =>
                el.startDate === val.startDate &&
                el.endDate === val.endDate
            )

            if (index !== -1) {
                acc[index]["profs"] = acc[index]["profs"].concat(val["profs"])
            } else {
                acc.push(val)
            }

            return acc
        }, [])



    return {
        events: filteredEvents,
        refetchTimelineEvents: refetch,
        loading,
        error
    }
}

export default useTimetableEvents
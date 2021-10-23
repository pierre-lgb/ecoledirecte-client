import useFetchED from "./useFetchED";

const useDocuments = (account) => {
    const { data, error, loading, refetch } = useFetchED(() => 'https://api.ecoledirecte.com/v3/elevesDocuments.awp', {
        "verbe": "get"
    })
    const documents = data?.data

    if (!account) {
        return { data, error, loading }
    }

    /**
     * Sections
     * (activeProperty: to check if this section is enabled in the module params)
     */
    const sections = {
        "factures": {
            title: "Factures",
            activeProperty: "DocumentsFacturesActif"
        },
        "notes": {
            title: "Notes",
            activeProperty: "DocumentsNotesActif"
        },
        "viescolaire": {
            title: "Vie Scolaire",
            activeProperty: "DocumentsVSActif"
        },
        "administratifs": {
            title: "Administratif",
            activeProperty: "DocumentsAdministratifActif"
        },
        "inscriptions": {
            title: "Inscriptions",
            activeProperty: "DocumentsInscriptionsActif"
        }
    }

    const activeProperties = account.modules.filter(mod =>
        mod.code === "DOCUMENTS_ELEVE"
    )[0].params



    return {
        documents: documents ? Object.keys(documents).map(section => {
            if (Array.isArray(documents[section])) {
                if (!activeProperties[sections[section]?.activeProperty]) {
                    return false
                }

                return {
                    title: sections[section].title,
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
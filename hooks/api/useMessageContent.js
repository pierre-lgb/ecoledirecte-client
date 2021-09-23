import useFetchED from "./useFetchED";
import { base64UTF8Decode } from "../../utils";

const useMessageContent = (message, yearMessages) => {
    const { data, error, loading } = useFetchED(`https://api.ecoledirecte.com/v3/eleves/5241/messages/${message.id}.awp`, {
        "verbe": "get",
        "mode": message.mtype === "send" ? "expediteur" : "destinataire" // <------------------------ A adapter
    }, {
        "anneeMessages": yearMessages // (undefined by default)
    })

    return {
        messageContent: data ? base64UTF8Decode(
            data.data.content.replace(/\n/gm, "")
        ) : "",
        error,
        loading
    }
}

export default useMessageContent
import base64 from "base-64";
import utf8 from "utf8";

export default function base64UTF8Decode(str) {
    const bytes = base64.decode(str)
    const text = utf8.decode(bytes)

    return text
}
export default function generateUniqueId() {
    // Create a unique number with timestamp
    const number = Math.floor(Date.now() / 1000)

    // Shorten the number using more digits (rixits)
    const RIXITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    if (isNaN(Number(number)) || number === null ||
        number === Number.POSITIVE_INFINITY)
        throw "The input is not valid";
    if (number < 0)
        throw "Can't represent negative numbers now";

    let rixit; // like 'digit', only in some non-decimal radix 
    let residual = Math.floor(number);
    let result = '';
    while (true) {
        rixit = residual % 64
        result = RIXITS.charAt(rixit) + result;
        residual = Math.floor(residual / 64);

        if (residual == 0) break;
    }

    return result;
}
import {
    createToken,
    deleteTokens,
    getSingleToken,
    listOfTokensByPriority,
    processOnToken,
    listOfTokensByActiveOfCurrentDate,
    setTokenHighPriority,
    addReservedToken,
    listOfAllTokens
} from "./tokenMethods"

const tokenRouter = {
    createToken,
    deleteTokens,
    processOnToken,
    listOfTokensByPriority,
    getSingleToken,
    listOfTokensByActiveOfCurrentDate,
    setTokenHighPriority,
    addReservedToken,
    listOfAllTokens
}

export default tokenRouter
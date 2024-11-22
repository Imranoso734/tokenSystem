import {
    createToken,
    deleteTokens,
    getSingleToken,
    listOfTokensByPriority,
    processOnToken,
    listOfTokensByActiveOfCurrentDate,
    setTokenHighPriority,
    addReservedToken,
    listOfAllTokens,
    listOfTokensByCompleteOfCurrentDate
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
    listOfAllTokens,
    listOfTokensByCompleteOfCurrentDate
}

export default tokenRouter
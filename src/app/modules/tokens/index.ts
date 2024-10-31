import {
    createToken,
    deleteTokens,
    getSingleToken,
    listOfTokensByPriority,
    processOnToken,
    listOfTokensByActiveOfCurrentDate,
    setTokenHighPriority,
    addReservedToken
} from "./tokenMethods"

const tokenRouter = {
    createToken,
    deleteTokens,
    processOnToken,
    listOfTokensByPriority,
    getSingleToken,
    listOfTokensByActiveOfCurrentDate,
    setTokenHighPriority,
    addReservedToken
}

export default tokenRouter
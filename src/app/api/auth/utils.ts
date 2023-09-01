import {getUserByAddress} from "../../db/users";
import {User} from "../../db/users/interface";
import {CryptoHelper} from "../../helpers/crypto";

export const buildMessage = (nonce: number) => {
    return `Hi there. Sign this message to prove you own this wallet. This is an offchain signature and doesn't cost anything.\n\nSecurity code (you can ignore this): ${nonce}`
}

export const getUserAuthToken = (
    userAddress: string,
    expirationMs = 86400 * 1000 * 7 // 1 week duration
): string => {
    const cryptoHelper = new CryptoHelper(process.env.SECRET as string)
    const expirationDate = Date.now() + expirationMs // 8 days in ms
    const hash = cryptoHelper.encrypt(`${userAddress}:${expirationDate}`)
    return `${hash.iv.toString('hex')}:${hash.encrypted.toString('hex')}`
}

export async function verifyTokenAndGetUser(token: string): Promise<User> {
    const [encodedIv, encodedEncryptedPayload] = token.split(':')
    const decodedEncryptedPayload = Buffer.from(encodedEncryptedPayload, 'hex')
    const decodedIv = Buffer.from(encodedIv, 'hex')
    const cryptoHelper = new CryptoHelper(process.env.SECRET as string)
    const decrypted = cryptoHelper.decrypt(decodedEncryptedPayload, decodedIv)
    const [userAddress, expirationDate] = decrypted.toString('utf8').split(':')
    if (Date.now() > parseInt(expirationDate)) {
        throw {error: {message: 'Token expired'}, status: 401};
    }
    const user = await getUserByAddress(userAddress)
    if (!user) {
        throw {error: {message: 'Invalid token: user not found'}, status: 401};
    }
    return user;
}
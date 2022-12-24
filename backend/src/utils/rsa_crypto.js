/**
 *    Copyright 2022 Dellius Alexander
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
const crypto = require('crypto')
const CryptoJS = require("crypto-js")
const randomBytes = require('util')
    .promisify(crypto.randomBytes)
/************************************************************************/
/**
 * Encrypt the given plaintext message using public key
 * @param {String} publicKey the public key string
 * @param {String} plaintext the plaintext message
 * @returns {Promise<null|Buffer>} the encrypted message
 */
async function rsaEncrypt(publicKey, plaintext) {
    try{
        return crypto.publicEncrypt(
            {
                key: publicKey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            plaintext
        )
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
    return null
}
/************************************************************************/
/**
 * Decrypt the given encrypted message using private key
 * @param {String} privateKey the private key string
 * @param {String} message the encrypted message
 * @returns {Promise<null|Buffer>} the decrypted message
 */
async function rsaDecrypt(privateKey, message) {
    try{
        return crypto.privateDecrypt(
            {
                key: privateKey,
                // In order to decrypt the data, we need to specify the
                // same hashing function and padding scheme that we used to
                // encrypt the data in the previous step
                padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
                oaepHash: 'sha256',
            },
            Buffer.from(message.toString(), "base64")
        )
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
    return null
}
/************************************************************************/
/**
 * Encrypt a plaintext message (a string)
 * with a given 256-bit symmetric key (in a Buffer object), returning the ciphertext.
 * @param {String} key the static key string
 * @param {String} plaintext the message to encrypt
 * @returns {Promise<null|Buffer>} the encrypted ciphertext
 */
async function aesEncrypt(key, plaintext) {
    try {
        // generating an IV as a random 16-byte sequence
        const iv = await randomBytes(16)
        // creates a cipher (the object that will encrypt our data) with
        // createCipheriv, using the key that was passed and the random IV
        const cipher = crypto.createCipheriv('aes-256-cbc', key, iv)
        // uses cipher.update to encrypt the message, and then signals that no more
        // data is coming with cipher.final (you could invoke cipher.update to pass
        // chunks of data as many times as you need, until you invoke cipher.final)
        const encrypted = Buffer.concat([
            cipher.update(plaintext, 'utf8'),
            cipher.final()
        ])
        // we return the result, which is the concatenation of two buffers:
        // the IV and the ciphertext. It's common practice to store the IV before
        // the ciphertext.
        return Buffer.concat([iv, encrypted])
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
    return null
}
/************************************************************************/
/**
 * Decrypts a ciphertext (in a Buffer object) with a given 256-bit
 * symmetric key (again, as a Buffer argument), and returns the plaintext
 * message as a string.
 * @param {String} key the static key string
 * @param {String} message the message to decrypt
 * @returns {Promise<null|Buffer>} the decrypted message
 */
async function aesDecrypt(key, message) {
    try {
        // Because we are storing the IV at the beginning of the encrypted
        // message, the first thing we need to do is slice the message
        // argument into two parts. The first 16 bytes are the IV,
        // while the rest is the actual ciphertext.
        const iv = message.slice(0, 16)
        const ciphertext = message.slice(16)
        // create decipher object with createDecipheriv, passing the key and
        // the IV that was extracted from the beginning of the message.
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv)
        // Use decipher object, just like we did with the cipher object in
        // the previous method, invoking decipher.update with the ciphertext
        // to decrypt and use decipher.final when we're done.
        const decrypted = Buffer.concat([
            decipher.update(ciphertext, 'utf-8'),
            decipher.final()
        ])
        // return the string in its original UTF-8 encoding
        return decrypted.toString('utf-8')
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
    return null
}
/************************************************************************/
/**
 * Encrypt the given plaintext message using the given PUBLIC_KEY. In
 * symmetric-key cryptography, the same key is used for both
 * encryption and decryption. In public-key cryptography, there
 * exists a pair of related keys known as the public key and
 * private key. The public key is freely available, whereas the
 * private key is kept secret. The public key is able to encrypt
 * messages that only the corresponding private key is able to
 * decrypt, and vice versa.
 * @param {String} key the key used to encrypt the message
 * @param {String} plaintext the plaintext message
 * @return {String} the encrypted message
 */
async function encrypt(key, plaintext){
    try {
        // Encrypt
        const cypherText = await CryptoJS.AES.encrypt(plaintext, key);
        console.log('Encrypted message: ',cypherText.toString(CryptoJS.enc.base64));
        return cypherText.toString(CryptoJS.enc.base64);
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
    return null;
}
/************************************************************************/
/**
 * Decrypt the given message using the given PUBLIC_KEY. In
 * symmetric-key cryptography, the same key is used for both
 * encryption and decryption. In public-key cryptography, there
 * exists a pair of related keys known as the public key and
 * private key. The public key is freely available, whereas the
 * private key is kept secret. The public key is able to encrypt
 * messages that only the corresponding private key is able to
 * decrypt, and vice versa.
 * @param {String} key the key used to encrypt the message
 * @param {String} message the message to decrypt
 * @return {String} the decrypted message
 */
async function decrypt(key, message) {
    try {
        // Decrypt using the provided key
        const bytes = await CryptoJS.AES.decrypt(message, key);
        const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
        console.log("Decrypted message: ",decryptedString.toString(CryptoJS.enc.Utf8));
        return decryptedString;
    } catch (e) {
        console.dir(e)
        e.stackTrace
    }
    return null;
}
/************************************************************************/

// // test algorithm
// ;(async () => {
//     const publicKey = require('fs')
//         .readFileSync(process.env.PUBLIC_KEY_FILE, 'utf-8').toString()
//     const plaintext = "123456789"
//     // const key = await randomBytes(32)
//     console.log('Key: ', publicKey.toString())
//     console.log('Key length: ', publicKey.length)
//     const encrypted = await encrypt(publicKey, plaintext)
//     // console.log('Encrypted message: ', encrypted.toString('base64'))
//     const decrypted = await decrypt(publicKey, encrypted)
//     // console.log('Decrypted message: ', decrypted.toString('utf-8'))
// })()

module.exports = {
    rsaDecrypt,
    rsaEncrypt,
    aesDecrypt,
    aesEncrypt,
    encrypt,
    decrypt
}
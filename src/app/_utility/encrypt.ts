import { Static } from "../_constant/static";

export class Encrypt {

    encryptData(val: any) {
        return CryptoJS.AES.encrypt(JSON.stringify(val), Static.secret_key).toString();
    }

    decryprData(val: any) {
        return CryptoJS.AES.decrypt(val, Static.secret_key).toString(
            CryptoJS.enc.Utf8
        );
    }

}
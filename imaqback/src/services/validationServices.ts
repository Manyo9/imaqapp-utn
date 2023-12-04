export const validateObjectKeys = (obj: Object, json: Object): boolean => {
    const objKeys = Object.keys(obj);
    const jsonKeys = Object.keys(json);

    for (let i = 0; i < objKeys.length; i++) {
        if (!jsonKeys.includes(objKeys[i])) {
            return false;
        }
    }

    return true;
}

export const validateArray = (array: any): boolean => Array.isArray(array) && array.length > 0;

export const checkStringBoolean = (str: string): boolean => str === "true" || str === "false";

export const validateStringNumber = (input: string): number | undefined => {
    const parsedNumber = Number(input);
    if (!isNaN(parsedNumber)) {
        return parsedNumber;
    } else {
        return undefined;
    }
}

export const isValidUUID = (uuid: string): boolean => {
    const uuidPattern: RegExp = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
    return uuidPattern.test(uuid);
}

export const validateEmail = (email: string) => {
    const emailRegex: RegExp = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
    return emailRegex.test(email);
}
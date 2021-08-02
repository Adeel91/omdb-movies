(function () {
    'use strict';

    const validator = require('validator');

    const _this = {
        Validate: Validate,
        ValidateVar: ValidateVar,
        IsNull: IsNull,
        IsValidType: IsValidType,
        IsValidRule: IsValidRule,
        GetOptions: GetOptions,
        objTypes: {
            object: 'object',
            array: 'array',
            number: 'number',
            bool: 'boolean',
            string: 'string',
            func: 'function',
            email: 'email',
            password: 'password',
            regexp: 'regexp',
            uuid: 'uuid',
            date: 'date',
            mobilePhone: 'mobilePhone',
            postalCode: 'postalCode',
            url: 'url',
            mongoId: 'mongoId',
            jwt: 'jwt',
        },
        validationRules: [
            'type',
            'required',
            'min',
            'max',
            'minLength',
            'maxLength',
            'regexp',
            'fields',
            'file',
            'enum',
        ],
    };

    module.exports = _this;

    /**
     *
     * @param obj input object to run the validation rules against
     * @param validationRules is one of:
     *      1. a type as a string value
     *      2. a validation object, to validate one value
     *      3. a collection validation object, to validate an object or array
     * @param objPath only used for recursive calls, records the depth of the function call in objects and arrays
     * @return {array} a list of error messages
     */
    function Validate(obj, validationRules, objPath = '') {
        if (_this.IsNull(obj)) {
            const error = new Error('obj is either null or undefined');
            Error.captureStackTrace(error);
            throw error;
        }

        let failures = [];
        if (_this.IsNull(validationRules)) {
            const error = new Error('ValidationRules is either null or undefined');
            Error.captureStackTrace(error);
            throw error;
        }

        // if validationRules is a file, set validationRules to the contents of the file
        if (!_this.IsValidType(validationRules) && typeof validationRules === _this.objTypes.string) {
            validationRules = require(validationRules);
        }

        // validationRules: string
        if (_this.IsValidType(validationRules)) {
            const v = _this.ValidateVar(obj, validationRules);
            if (!v.valid) {
                failures.push(`[${objPath}] failed validation: ${v.details}`);
            }
        }
        // validationRules: validation object
        else if (typeof validationRules === _this.objTypes.object && _this.IsValidType(validationRules.type)) {
            const type = validationRules.type;
            const options = _this.GetOptions(validationRules, obj);
            const v = _this.ValidateVar(obj, type, options);
            if (!v.valid) {
                failures.push(`[${objPath}] failed validation: ${v.details}`);
            }
        }
        // validationRules: collection validation object
        else {
            const validationKeys = Object.keys(validationRules);

            for (let i = 0; i < validationKeys.length; ++i) {
                const fieldName = validationKeys[i];
                const objItem = obj[fieldName];
                const validationRule = validationRules[fieldName];
                const type = validationRule.type || validationRule;

                if (!_this.IsValidRule(validationRule)) {
                    const error = new Error(
                        `Rule [${fieldName}: ${validationRule.toString()}] is not one of the valid rules [${Object.values(
                            _this.objTypes
                        ).toString()},${_this.validationRules.toString()}]`
                    );
                    Error.captureStackTrace(error);
                    throw error;
                }

                const options = _this.GetOptions(validationRule, obj);
                const v = _this.ValidateVar(objItem, type, options);
                if (!v.valid) {
                    failures.push(
                        `[${objPath === '' ? fieldName : `${objPath}.${fieldName}`}] failed validation: ${v.details}`
                    );
                    continue;
                }

                // check arrays and nested objects
                const nextValidationRule = validationRule.file || validationRule.fields;
                let deepVal;

                if (objItem && nextValidationRule && type === 'object') {
                    deepVal = Validate(
                        objItem,
                        nextValidationRule,
                        objPath === '' ? fieldName : `${objPath}.${fieldName}`
                    );
                    for (let details of deepVal) {
                        failures.push(details);
                    }
                } else if (objItem && nextValidationRule && type === 'array') {
                    for (let j = 0; j < objItem.length; ++j) {
                        deepVal = Validate(
                            objItem[j],
                            nextValidationRule,
                            objPath === '' ? `${fieldName}[${j}]` : `${objPath}.${fieldName}[${j}]`
                        );
                        for (let details of deepVal) {
                            failures.push(details);
                        }
                    }
                }
            }
        }

        return failures;
    }

    /**
     * Validates that types are the same for passed in parameters
     * @param _var variable to test
     * @param type type to check against: use objTypes.[type]
     * @param options various things to test against
     * @returns {object} returns an object of the form: {
     *     valid: boolean
     *     details: string, optional
     * }
     * or throws an error if type is nil
     */
    function ValidateVar(_var, type, options = {}) {
        if (options.enumeration && !Array.isArray(options.enumeration)) {
            const error = new Error('enumeration needs to be an array');
            Error.captureStackTrace(error);
            throw error;
        } else if (options.regexp && !(options.regexp instanceof RegExp)) {
            const error = new Error('regexp needs to be an instance of RegExp');
            Error.captureStackTrace(error);
            throw error;
        }

        if (options.required === undefined) {
            options.required = false;
        }

        if (_this.IsNull(_var)) {
            if (options.required) {
                return { valid: false, details: 'field is required, but is either null or undefined' };
            } else {
                return { valid: true };
            }
        }

        if (!options.required && (_var === 0 || _var === '')) {
            return { valid: true };
        }

        switch (type) {
            case _this.objTypes.array:
                if (!Array.isArray(_var)) {
                    return { valid: false, details: `expected array, but found type [${typeof _var}]` };
                }
                if (options.minLength && _var.length < options.minLength) {
                    return {
                        valid: false,
                        details: `expected array with min length [${options.minLength}], but found array with length [${_var.length}]`,
                    };
                }
                if (options.maxLength && _var.length > options.maxLength) {
                    return {
                        valid: false,
                        details: `expected array with max length [${options.maxLength}], but found array with length [${_var.length}]`,
                    };
                }
                return { valid: true };
            case _this.objTypes.email:
                if (typeof _var === _this.objTypes.string) {
                    if (validator.isEmail(_var)) {
                        return { valid: true };
                    }
                    return { valid: false, details: `string "${_var}" is not in valid email format` };
                }
                return { valid: false, details: `expected email-formatted string, but found type [${typeof _var}]` };
            case _this.objTypes.password:
                if (typeof _var === _this.objTypes.string) {
                    const passwordRegexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[`~!@#$%^&*()-_=+,<.>/?|\[\]{};:'"])[A-Za-zd`~!@#$%^&*()-_=+,<.>/?|\[\]{};:'"]{8,32}$/;
                    if (passwordRegexp.test(_var)) {
                        return { valid: true };
                    }
                    return { valid: false, details: `entered string is not in valid password` };
                }
                return { valid: false, details: `expected password as a string, but found type [${typeof _var}]` };
            case _this.objTypes.uuid:
                if (typeof _var === _this.objTypes.string) {
                    if (validator.isUUID(_var)) {
                        return { valid: true };
                    }
                    return { valid: false, details: `string "${_var}" is not in valid UUID format` };
                }
                return { valid: false, details: `expected UUID-formatted string, but found type [${typeof _var}]` };
            case _this.objTypes.date:
                if (typeof _var === _this.objTypes.string) {
                    if (!isNaN(Date.parse(_var))) {
                        return { valid: true };
                    }
                    return { valid: false, details: `string "${_var}" is not in valid date format` };
                }
                return { valid: false, details: `expected date-formatted string, but found type [${typeof _var}]` };
            case _this.objTypes.mobilePhone:
                if (typeof _var === _this.objTypes.string) {
                    if (validator.isMobilePhone(_var, 'en-US')) {
                        return { valid: true };
                    }
                    return { valid: false, details: `string "${_var}" is not in valid phone number format` };
                }
                return {
                    valid: false,
                    details: `expected phone-number-formatted string, but found type [${typeof _var}]`,
                };
            case _this.objTypes.postalCode:
                if (typeof _var === _this.objTypes.number || typeof _var === _this.objTypes.string) {
                    if (validator.isPostalCode(_var.toString(), 'US')) {
                        return { valid: true };
                    }
                    return {
                        valid: false,
                        details: `${
                            typeof _var === 'number' ? `number [${_var}]` : `string "${_var}"`
                        } is not in valid postal code format`,
                    };
                }
                return {
                    valid: false,
                    details: `expected postal-code-formatted number or string, but found type [${typeof _var}]`,
                };
            case _this.objTypes.url:
                if (typeof _var === _this.objTypes.string) {
                    if (validator.isURL(_var)) {
                        return { valid: true };
                    }
                    return { valid: false, details: `string "${_var}" is not in valid url format` };
                }
                return { valid: false, details: `expected url-formatted string, but found type [${typeof _var}]` };
            case _this.objTypes.string:
                if (typeof _var !== _this.objTypes.string) {
                    return { valid: false, details: `expected string, but found type [${typeof _var}]` };
                }
                if (options.minLength && _var.length < options.minLength) {
                    return {
                        valid: false,
                        details: `expected string with min length [${options.minLength}], but found the string "${_var}" with length [${_var.length}]`,
                    };
                }
                if (options.maxLength && _var.length > options.maxLength) {
                    return {
                        valid: false,
                        details: `expected string with max length [${options.maxLength}], but found the string "${_var}" with length [${_var.length}]`,
                    };
                }
                if (options.enumeration && !options.enumeration.includes(_var)) {
                    return {
                        valid: false,
                        details: `string "${_var}" is not a valid enumerated value from [${options.enumeration}]`,
                    };
                }
                if (options.regexp && !options.regexp.test(_var)) {
                    return { valid: false, details: `string '${_var}' does not match regex [${options.regexp}]` };
                }
                return { valid: true };
            case _this.objTypes.number:
                if (typeof _var !== _this.objTypes.number) {
                    return { valid: false, details: `expected number, but found type [${typeof _var}]` };
                }
                if ((options.min === 0 || options.min) && _var < options.min) {
                    return {
                        valid: false,
                        details: `expected number greater than or equal to [${options.min}], but found the number [${_var}]`,
                    };
                }
                if ((options.max === 0 || options.max) && _var > options.max) {
                    return {
                        valid: false,
                        details: `expected number less than or equal to [${options.max}], but found the number [${_var}]`,
                    };
                }
                return { valid: true };
            case _this.objTypes.mongoId:
                if (typeof _var !== _this.objTypes.string) {
                    return {
                        valid: false,
                        details: `expected mongo id of type string, but found type [${typeof _var}]`,
                    };
                } else if (!validator.isMongoId(_var)) {
                    return { valid: false, details: `string [${_var}] is not a valid mongo id` };
                } else {
                    return { valid: true };
                }
            case _this.objTypes.jwt:
                if (typeof _var !== _this.objTypes.string) {
                    return {
                        valid: false,
                        details: `expected jwt of type string, but found type [${typeof _var}]`,
                    };
                } else if (!validator.isJWT(_var)) {
                    return { valid: false, details: `string [${_var}] is not a valid JWT` };
                } else {
                    return { valid: true };
                }
            default:
                if (typeof _var === type) {
                    return { valid: true };
                }
                return { valid: false, details: `expected value of type [${type}], but found type [${typeof _var}]` };
        }
    }

    /**
     * determines if an input is null or undefined
     * @param obj
     * @return {boolean}
     */
    function IsNull(obj) {
        return obj === null || obj === undefined;
    }

    /**
     * Checks if an obj is a type
     * @param type
     * @return {boolean} true if type is a supported type, false otherwise
     */
    function IsValidType(type) {
        return Object.values(_this.objTypes).includes(type);
    }

    /**
     * Checks to see if the validation rule is an allowed rule
     * @param rule validation rule to check
     * @return {boolean} true if proper validation rule, false otherwise
     */
    function IsValidRule(rule) {
        if (_this.IsNull(rule)) return false;

        const isType = _this.IsValidType(rule);

        if (isType) return true;

        const keys = Object.keys(rule);

        for (let i = 0; i < keys.length; ++i) {
            if (!_this.validationRules.includes(keys[i])) {
                return false;
            }
        }

        return true;
    }

    /**
     * Gets the options for validation rules
     * @param validationRule
     * @param obj the source object to call new Function on as a parameter
     * @return {{regexp: (*), min: *, max: *, minLength: *, enumeration: *, required: *, maxLength: *}}
     */
    function GetOptions(validationRule, obj) {
        return {
            required: Array.isArray(validationRule.required)
                ? new Function(...validationRule.required)(obj)
                : validationRule.required || false,
            enumeration: validationRule.enum,
            regexp: validationRule.regexp ? new RegExp(validationRule.regexp) : undefined,
            min: validationRule.min,
            max: validationRule.max,
            minLength: validationRule.minLength,
            maxLength: validationRule.maxLength,
        };
    }
})();

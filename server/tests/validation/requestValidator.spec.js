(function () {
    'use strict';
    const sinon = require('sinon');
    require('chai').should();

    describe('RequestValidator Test', function () {
        const requestValidator = require('../../src/validation/requestValidator');

        const _classroom = {
            teacher: {
                name: 'Mr. Adeel',
                age: 15,
                qualities: ['developer', 'engineer', 'tester'],
                details: {
                    email: 'adeel@example.com',
                    uuid: 'sd44fgaa-43eb-3d78-92f7-fjss242w563',
                    hiredDate: '2021-9-10',
                    phone: '+49 1234567890',
                },
            },
            students: [
                {
                    name: 'Danial Frank',
                    age: 12,
                    gender: 'male',
                    perfectAttendance: true,
                },
                {
                    name: 'Timo Jarms',
                    age: 11,
                    gender: 'female',
                    perfectAttendance: false,
                },
                {
                    name: 'Faisal Khan',
                    age: 11,
                    gender: 'male',
                    perfectAttendance: true,
                },
            ],
            zip: 12345,
            courseWebPage: 'https://udemy.com',
        };
        const _classroomValidationRules = {
            teacher: {
                required: true,
                type: 'object',
                fields: {
                    name: {
                        type: 'string',
                        required: true,
                        maxLength: 20,
                        regexp: '^Ms. |^Mrs. ',
                    },
                    age: 'number',
                    qualities: {
                        type: 'array',
                        fields: 'string',
                        minLength: 2,
                        maxLength: 20,
                    },
                    details: {
                        type: 'object',
                        required: true,
                        fields: {
                            email: 'email',
                            uuid: {
                                type: 'uuid',
                                required: true,
                            },
                            hiredDate: 'date',
                            phone: 'mobilePhone',
                        },
                    },
                },
            },
            students: {
                type: 'array',
                required: 'true',
                fields: {
                    name: 'string',
                    age: {
                        type: 'number',
                        min: 11,
                        max: 12,
                    },
                    gender: {
                        type: 'string',
                        enum: ['male', 'female', 'other'],
                    },
                    perfectAttendance: 'boolean',
                },
            },
            zip: {
                type: 'postalCode',
                required: ['obj', 'return obj.teacher.name === "Mr. Adeel"'],
            },
            courseWebPage: 'url',
        };

        describe('RequestValidator Module Test', () => {
            let classroom, classroomValidationRules;

            beforeEach(() => {
                classroom = JSON.parse(JSON.stringify(_classroom));
                classroomValidationRules = JSON.parse(JSON.stringify(_classroomValidationRules));
            });

            it('Should successfully validate classroom', async () => {
                const failures = requestValidator.Validate(classroom, classroomValidationRules);

                if (failures.length > 0) {
                    sinon.assert.fail('failed validation');
                }

                failures.length.should.equal(0);
            });

            it('Should correctly return failures', () => {
                classroom.teacher.name = 'Muhammad Adeel';
                classroom.teacher.qualities.push(5);
                classroom.teacher.details.email = 'adeel';
                classroom.students[0].gender = 'Not Interested';

                const failures = requestValidator.Validate(classroom, classroomValidationRules);

                failures.should.deep.equal([
                    "[teacher.name] failed validation: string 'Muhammad Adeel' does not match regex [/^Ms. |^Mrs. /]",
                    '[teacher.qualities[3]] failed validation: expected string, but found type [number]',
                    '[teacher.details.email] failed validation: string "adeel" is not in valid email format',
                    '[students[0].gender] failed validation: string "Not Interested" is not a valid enumerated value from [male,female,other]',
                ]);
            });
        });

        describe('Validate Test', () => {
            let classroom, classroomValidationRules;
            let isNullStub, isValidTypeStub, validateVarStub, getOptionsStub, isValidRuleStub;

            beforeEach(() => {
                classroom = JSON.parse(JSON.stringify(_classroom));
                classroomValidationRules = JSON.parse(JSON.stringify(_classroomValidationRules));
                isNullStub = sinon.stub(requestValidator, 'IsNull');
                isValidTypeStub = sinon.stub(requestValidator, 'IsValidType');
                validateVarStub = sinon.stub(requestValidator, 'ValidateVar');
                getOptionsStub = sinon.stub(requestValidator, 'GetOptions');
                isValidRuleStub = sinon.stub(requestValidator, 'IsValidRule');
            });

            afterEach(() => {
                isNullStub.restore();
                isValidTypeStub.restore();
                validateVarStub.restore();
                getOptionsStub.restore();
                isValidRuleStub.restore();
            });

            it('should throw if obj is either null or undefined', () => {
                isNullStub.returns(true);

                try {
                    requestValidator.Validate(null, {});
                    sinon.assert.fail('function did not throw');
                } catch (e) {
                    e.message.should.equal('obj is either null or undefined');
                }

                isNullStub.calledOnce.should.be.true;
                isValidTypeStub.called.should.be.false;
                validateVarStub.called.should.be.false;
                getOptionsStub.called.should.be.false;
                isValidRuleStub.called.should.be.false;
            });

            it('should throw if validationRules is either null or undefined', () => {
                isNullStub.onFirstCall().returns(false);
                isNullStub.returns(true);

                try {
                    requestValidator.Validate({}, null);
                    sinon.assert.fail('function did not throw');
                } catch (e) {
                    e.message.should.equal('ValidationRules is either null or undefined');
                }

                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.called.should.be.false;
                validateVarStub.called.should.be.false;
                getOptionsStub.called.should.be.false;
                isValidRuleStub.called.should.be.false;
            });

            it('should successfully validate when validationRules is a string', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(true);
                validateVarStub.returns({ valid: true });

                const ret = requestValidator.Validate('Mr. Adeel', 'string');

                ret.length.should.equal(0);
                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.calledTwice.should.be.true;
                validateVarStub.calledOnce.should.be.true;
                getOptionsStub.called.should.be.false;
                isValidRuleStub.called.should.be.false;
            });

            it('should return a failure when validationRules is a string', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(true);
                validateVarStub.returns({ valid: false, details: 'I asked for a string, honey' });

                const ret = requestValidator.Validate(50140, 'string');

                ret.length.should.equal(1);
                ret[0].should.equal('[] failed validation: I asked for a string, honey');
                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.calledTwice.should.be.true;
                validateVarStub.calledOnce.should.be.true;
                getOptionsStub.called.should.be.false;
                isValidRuleStub.called.should.be.false;
            });

            it('should load validationRules from a file and successfully validate when validationRules is a validation object', () => {
                isNullStub.returns(false);
                isValidTypeStub.onCall(0).returns(false); // load from file
                isValidTypeStub.onCall(1).returns(false);
                isValidTypeStub.onCall(2).returns(true);
                getOptionsStub.returns({});
                validateVarStub.returns({ valid: true });

                const ret = requestValidator.Validate('Mr. Adeel', '../../tests/_mockData/validationRules.mock.json');

                ret.length.should.equal(0);
                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.calledThrice.should.be.true;
                validateVarStub.calledOnce.should.be.true;
                getOptionsStub.calledOnce.should.be.true;
                isValidRuleStub.called.should.be.false;
            });

            it('should return a failure when validationRules is a validation object', () => {
                isNullStub.returns(false);
                isValidTypeStub.onCall(0).returns(false);
                isValidTypeStub.onCall(1).returns(false);
                isValidTypeStub.onCall(2).returns(true);
                getOptionsStub.returns({});
                validateVarStub.returns({ valid: false, details: 'This data is very bad :(' });

                const ret = requestValidator.Validate('Ms. ', '../../tests/_mockData/validationRules.mock.json');

                ret.length.should.equal(1);
                ret[0].should.equal('[] failed validation: This data is very bad :(');
                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.calledThrice.should.be.true;
                validateVarStub.calledOnce.should.be.true;
                getOptionsStub.calledOnce.should.be.true;
                isValidRuleStub.called.should.be.false;
            });

            it('should successfully validate when validationRules is collection validation object', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(false);
                isValidRuleStub.returns(true);
                getOptionsStub.returns({});
                validateVarStub.returns({ valid: true });

                const ret = requestValidator.Validate(
                    { a: 'hello', b: 'world', c: '!' },
                    { a: { type: 'string' }, b: { type: 'string' }, c: { type: 'string' } }
                );

                ret.length.should.equal(0);
                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.calledThrice.should.be.true;
                validateVarStub.calledThrice.should.be.true;
                getOptionsStub.calledThrice.should.be.true;
                isValidRuleStub.calledThrice.should.be.true;
            });

            it('should throw when validationRules is a collection validation object', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(false);
                isValidRuleStub.returns(false);

                try {
                    requestValidator.Validate(
                        { a: 'hello', b: 'world', c: '!' },
                        { a: 'stryng', b: { type: 'string' }, c: { type: 'string' } }
                    );
                    sinon.assert.fail('function did not throw');
                } catch (e) {
                    e.message.should.equal(
                        'Rule [a: stryng] is not one of the valid rules [object,array,number,boolean,string,function,email,password,regexp,uuid,date,mobilePhone,postalCode,url,mongoId,jwt,type,required,min,max,minLength,maxLength,regexp,fields,file,enum]'
                    );
                }

                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.calledThrice.should.be.true;
                validateVarStub.called.should.be.false;
                getOptionsStub.called.should.be.false;
                isValidRuleStub.calledOnce.should.be.true;
            });

            it('should return a failure when validationRule is a collection validation object', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(false);
                isValidRuleStub.returns(true);
                getOptionsStub.returns({});
                validateVarStub.onCall(0).returns({ valid: false, details: 'first failure' });
                validateVarStub.onCall(1).returns({ valid: true });
                validateVarStub.onCall(2).returns({ valid: false, details: 'second failure' });

                const ret = requestValidator.Validate(
                    { a: 'hello', b: 'world', c: '!' },
                    { a: 'number', b: { type: 'string' }, c: { type: 'boolean' } }
                );

                ret.should.deep.equal([
                    '[a] failed validation: first failure',
                    '[c] failed validation: second failure',
                ]);
                isNullStub.calledTwice.should.be.true;
                isValidTypeStub.calledThrice.should.be.true;
                isValidRuleStub.calledThrice.should.be.true;
                validateVarStub.calledThrice.should.be.true;
                getOptionsStub.calledThrice.should.be.true;
            });
        });

        describe('ValidateVar Test', () => {
            let isNullStub;

            beforeEach(() => {
                isNullStub = sinon.stub(requestValidator, 'IsNull');
            });

            afterEach(() => {
                isNullStub.restore();
            });

            it('Should throw when enumeration is not an array', () => {
                try {
                    requestValidator.ValidateVar('Southwest', 'string', { enumeration: 'Southwest' });
                    sinon.assert.fail('Function did not throw');
                } catch (e) {
                    e.message.should.equal('enumeration needs to be an array');
                }

                isNullStub.called.should.be.false;
            });

            it('Should throw when regexp is not a regexp', () => {
                try {
                    requestValidator.ValidateVar('Mr. Adeel', 'string', { regexp: '^Ms. |^Mrs. ' });
                    sinon.assert.fail('Function did not throw');
                } catch (e) {
                    e.message.should.equal('regexp needs to be an instance of RegExp');
                }

                isNullStub.called.should.be.false;
            });

            it('Should mark required as false when options.required is undefined', () => {
                isNullStub.returns(true);

                const resp = requestValidator.ValidateVar(null, 'string', { regexp: /^Ms. |^Mrs./ });

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('Should return a failure when options.required and _var is null or undefined', () => {
                isNullStub.returns(true);

                const resp = requestValidator.ValidateVar(null, 'string', { required: true });

                resp.should.deep.equal({ valid: false, details: 'field is required, but is either null or undefined' });
                isNullStub.calledOnce.should.be.true;
            });

            it('Should succeed when !options.required and _var is null or undefined', () => {
                isNullStub.returns(true);

                const resp = requestValidator.ValidateVar(null, 'string', { required: false });

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('Should succeed when !options.required and _var is 0', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(0, 'number', { required: false, min: 3 });

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it("Should succeed when !options.required and _var is ''", () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('', 'string', { required: false, minLength: 5 });

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when type is array, but _var is not an array', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('East, West', 'array');

                resp.should.deep.equal({ valid: false, details: `expected array, but found type [string]` });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return a failure when array is below minLength', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(['East'], 'array', { minLength: 2 });

                resp.should.deep.equal({
                    valid: false,
                    details: `expected array with min length [2], but found array with length [1]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return a failure when array is above maxLength', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(['East', 'North', 'West'], 'array', { maxLength: 2 });

                resp.should.deep.equal({
                    valid: false,
                    details: `expected array with max length [2], but found array with length [3]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate an array', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(['East', 'North'], 'array', { required: true });

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate an email', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('adeel@example.com', 'email', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string is not in valid email format', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('adeelexample.com', 'email', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `string "adeelexample.com" is not in valid email format`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when email is not a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar({ email: 'adeel@example.com' }, 'email', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `expected email-formatted string, but found type [object]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate a password', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('p@ssw0Rd', 'password', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string is not in valid password format', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('password', 'password', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `entered string is not in valid password`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when password is not a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar({}, 'password', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `expected password as a string, but found type [object]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate a uuid', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('bc470d8e-3d78-43eb-92f7-8511c9db996c', 'uuid', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when a string is not in valid uuid format', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('bc470d8e3d7843eb92f78511c9db996c', 'uuid', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `string "bc470d8e3d7843eb92f78511c9db996c" is not in valid UUID format`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when uuid is not a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(['bc470d8e-3d78-43eb-92f7-8511c9db996c', 'asdf'], 'uuid', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `expected UUID-formatted string, but found type [object]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate a date', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('1994-9-10', 'date', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when a string is not in date format', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('June 22nd, 1944', 'date', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `string "June 22nd, 1944" is not in valid date format`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when date is not a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(9 - 25 - 1995, 'date', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `expected date-formatted string, but found type [number]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate a phone number', () => {
                isNullStub.returns(false);
                const numbers = [
                    '+15157058449',
                    '+1 (515) 705-8449',
                    '+1 (515)-705-8449',
                    '+1515-705-8449',
                    '+1 515-705-8449',
                    '+1 515 705 8449',
                    '515 705 8449',
                    '515 705-8449',
                    '515-705-8449',
                    '(515) 705 8449',
                    '(515) 705-8449',
                    '5157058449',
                ];

                for (let i = 0; i < numbers.length; ++i) {
                    const resp = requestValidator.ValidateVar(numbers[i], 'mobilePhone', {});
                    resp.should.deep.equal({ valid: true });
                }
            });

            it('should return invalid when string is not a phone number', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('515-098-1234', 'mobilePhone', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `string "515-098-1234" is not in valid phone number format`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when phone number is not a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(5150981234, 'mobilePhone', {});

                resp.should.deep.equal({
                    valid: false,
                    details: `expected phone-number-formatted string, but found type [number]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate postalCode as a number', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(50014, 'postalCode', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate postalCode as a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('50014', 'postalCode', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string is not in postalCode format', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('zip: 50014', 'postalCode', {});

                resp.should.deep.equal({
                    valid: false,
                    details: 'string "zip: 50014" is not in valid postal code format',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when number is not in postalCode format', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(500145223, 'postalCode', {});

                resp.should.deep.equal({
                    valid: false,
                    details: 'number [500145223] is not in valid postal code format',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is neither a number nor a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar({ zip: '50014' }, 'postalCode', {});

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected postal-code-formatted number or string, but found type [object]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate url', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(
                    'https://en.wikipedia.org/wiki/The_Magic_School_Bus_(TV_series)',
                    'url',
                    {}
                );

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string is not in valid url format', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('The Magic School Bus (TV series)', 'url', {});

                resp.should.deep.equal({
                    valid: false,
                    details: 'string "The Magic School Bus (TV series)" is not in valid url format',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when url is not a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar({}, 'url', {});

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected url-formatted string, but found type [object]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('Mr. Adeel', 'string', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is not a string', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(1234, 'string', {});

                resp.should.deep.equal({ valid: false, details: 'expected string, but found type [number]' });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string is below minLength', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('asd', 'string', { minLength: 5 });

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected string with min length [5], but found the string "asd" with length [3]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string is above maxLength', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('asdfjkl;', 'string', { maxLength: 3 });

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected string with max length [3], but found the string "asdfjkl;" with length [8]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string is not one of the enumerated options', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('Yeast', 'string', {
                    enumeration: ['North', 'East', 'South', 'West'],
                });

                resp.should.deep.equal({
                    valid: false,
                    details: 'string "Yeast" is not a valid enumerated value from [North,East,South,West]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when string does not mach the regexp', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('Mr. Adeel', 'string', { regexp: /^Ms. |^Mrs. / });

                resp.should.deep.equal({
                    valid: false,
                    details: `string 'Mr. Adeel' does not match regex [/^Ms. |^Mrs. /]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should successfully validate a number', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(3, 'number', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is not a number', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('3', 'number', {});

                resp.should.deep.equal({ valid: false, details: 'expected number, but found type [string]' });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is below min', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(-3, 'number', { min: 0 });

                resp.should.deep.equal({
                    valid: false,
                    details: `expected number greater than or equal to [0], but found the number [-3]`,
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is above max', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(3, 'number', { max: 0 });

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected number less than or equal to [0], but found the number [3]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is not a string for mongoid', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(3, 'mongoId');

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected mongo id of type string, but found type [number]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is not a valid mongoid', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('foobar', 'mongoId');

                resp.should.deep.equal({
                    valid: false,
                    details: 'string [foobar] is not a valid mongo id',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return valid when _var is a valid mongoid', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('5ee7ccbda9cfa82c3c5a1808', 'mongoId');

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is not a string for jwt', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(3, 'jwt');

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected jwt of type string, but found type [number]',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return invalid when _var is not a valid jwt', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar('foobar', 'jwt');

                resp.should.deep.equal({
                    valid: false,
                    details: 'string [foobar] is not a valid JWT',
                });
                isNullStub.calledOnce.should.be.true;
            });

            it('should return valid when _var is a jwt', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(
                    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
                    'jwt'
                );

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it('should should successfully validate in the default case when types match', () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(3n, 'bigint', {});

                resp.should.deep.equal({ valid: true });
                isNullStub.calledOnce.should.be.true;
            });

            it("should return invalid in the default case when the types don't match", () => {
                isNullStub.returns(false);

                const resp = requestValidator.ValidateVar(3n, 'null', {});

                resp.should.deep.equal({
                    valid: false,
                    details: 'expected value of type [null], but found type [bigint]',
                });
                isNullStub.calledOnce.should.be.true;
            });
        });

        describe('IsNull Test', () => {
            it('should return true when obj is null', () => {
                const resp = requestValidator.IsNull(null);
                resp.should.equal(true);
            });

            it('should return true when obj is undefined', () => {
                const resp = requestValidator.IsNull(undefined);
                resp.should.equal(true);
            });

            it('should return false when obj is neither', () => {
                const resp = requestValidator.IsNull(0);
                resp.should.equal(false);
            });
        });

        describe('IsValidType Test', () => {
            it('should return true when type is in objTypes', () => {
                const resp = requestValidator.IsValidType('string');
                resp.should.equal(true);
            });

            it('should return false when type is not in objTypes', () => {
                const resp = requestValidator.IsValidType('String');
                resp.should.equal(false);
            });
        });

        describe('IsValidRule Test', () => {
            let isNullStub, isValidTypeStub;

            beforeEach(() => {
                isNullStub = sinon.stub(requestValidator, 'IsNull');
                isValidTypeStub = sinon.stub(requestValidator, 'IsValidType');
            });

            afterEach(() => {
                isNullStub.restore();
                isValidTypeStub.restore();
            });

            it('should return false when rule is null', () => {
                isNullStub.returns(true);

                const resp = requestValidator.IsValidRule(null);

                resp.should.equal(false);
                isNullStub.calledOnce.should.be.true;
                isValidTypeStub.called.should.be.false;
            });

            it('should return true if rule is a valid type', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(true);

                const resp = requestValidator.IsValidRule('number');

                resp.should.equal(true);
                isNullStub.calledOnce.should.be.true;
                isValidTypeStub.calledOnce.should.be.true;
            });

            it('should return true if rule contains valid rules', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(false);

                const resp = requestValidator.IsValidRule({ type: 'number', min: 3 });

                resp.should.equal(true);
                isNullStub.calledOnce.should.be.true;
                isValidTypeStub.calledOnce.should.be.true;
            });

            it('should return false if rule contains one or more invalid rules', () => {
                isNullStub.returns(false);
                isValidTypeStub.returns(false);

                const resp = requestValidator.IsValidRule({ type: 'number', maximum: 3 });

                resp.should.equal(false);
                isNullStub.calledOnce.should.be.true;
                isValidTypeStub.calledOnce.should.be.true;
            });
        });

        describe('GetOptions Test', () => {
            it('should return an options object where required is a function and regexp is a regex', () => {
                const resp = requestValidator.GetOptions(
                    {
                        required: ['obj', 'return obj.approved'],
                        regexp: /^Ms. |^Mrs. /,
                        max: 20,
                        min: 10,
                    },
                    {
                        name: 'Mr. Adeel',
                        approved: true,
                    }
                );

                resp.should.deep.equal({
                    required: true,
                    regexp: /^Ms. |^Mrs. /,
                    enumeration: undefined,
                    max: 20,
                    maxLength: undefined,
                    min: 10,
                    minLength: undefined,
                });
            });

            it('should return an options object where required is a boolean and regex is undefined', () => {
                const resp = requestValidator.GetOptions(
                    {
                        required: true,
                        regexp: undefined,
                        enum: ['North', 'South', 'East', 'West'],
                        maxLength: 5,
                        minLength: 4,
                    },
                    {}
                );

                resp.should.deep.equal({
                    required: true,
                    regexp: undefined,
                    enumeration: ['North', 'South', 'East', 'West'],
                    max: undefined,
                    maxLength: 5,
                    min: undefined,
                    minLength: 4,
                });
            });

            it('should return an options object where validationRule.required is false', () => {
                const resp = requestValidator.GetOptions({}, {});
                resp.should.deep.equal({
                    enumeration: undefined,
                    max: undefined,
                    maxLength: undefined,
                    min: undefined,
                    minLength: undefined,
                    regexp: undefined,
                    required: false,
                });
            });
        });
    });
})();

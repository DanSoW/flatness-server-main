/**
 * @typedef SignUpDto
 * @property {string} email.required
 * @property {string} password.required
 */
class SignUpDto {
    email;
    password;

    constructor(model) {
        for (const key in model) {
            this[key] = model[key];
        }
    }
}

export default SignUpDto;
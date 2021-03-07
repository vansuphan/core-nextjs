export const validateShiftCreate = (form) => {
    const errors = [];
    const requiredArrayFields = [];
    const requiredLanguageFields = ['description'];

    for (const field of requiredArrayFields) {
        if (form[field].length < 1) {
            errors.push(`The ${field} field must be required!`);
        }
    }

    for (const field of requiredLanguageFields) {
        if (form[field].en === '') {
            errors.push(`The ${field} field [EN] must be required!`);
        }

        if (form[field].vi === '') {
            errors.push(`The ${field} field [VI] must be required!`);
        }
    }

    return errors;
}

export const validateShiftEdit = (form) => {
    const errors = [];
    const requiredArrayFields = [];
    const requiredLanguageFields = ['description'];

    for (const field of requiredArrayFields) {
        if (form[field].length < 1) {
            errors.push(`The ${field} field must be required!`);
        }
    }

    for (const field of requiredLanguageFields) {
        if (form[field].en === '') {
            errors.push(`The ${field} field [EN] must be required!`);
        }

        if (form[field].vi === '') {
            errors.push(`The ${field} field [VI] must be required!`);
        }
    }

    return errors;
}
// Validation
(function() {

    // Validation rules
    const constraints = {
        email: {
            presence: true,
            email: {
                message: 'Invalid email address'
            }
        },
        password: {
            presence: true,
            length: {
                minimum: 10
            }
        },
        first: {
            presence: true
        },
        last: {
            presence: true
        },
        street: {
            presence: true
        },
        zip: {
            presence: true
        },
        state: {
            presence: true
        },
        city: {
            presence: true
        },
        country: {
            presence: true
        },
        card: {
            presence: true
        },
        code: {
            presence: true,
            code: true
        },
        'exp-month': {
            presence: {
                message: 'Required'
            }
        },
        'exp-year': {
            presence: {
                message: 'Required'
            }
        }
    }

    // Override default error message for required fields
    validate.validators.presence.message = 'This field is required';

    // Custom validator for credit card security code
    validate.validators.code = function(value, options, key, attributes) {
        if (value === '111') {
            return 'Invalid security code';
        }
    };

    const form = document.querySelector('.form');
    const inputs = form.querySelectorAll('.input, .textarea, .select');

    // Attach validation to form submit
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const errors = validate(form, constraints, {fullMessages: false});

        if (errors) {
            showErrors(form, errors || {});
        } else {
            showSuccess();
        }
    });

    // Attach validation to inputs changes
    inputs.forEach((input) => {
        input.addEventListener('change', () => {
            const errors = validate(form, constraints, {fullMessages: false}) || {};

            showErrorsForInput(input, errors[input.name]);
        });
    });

    // Show form errors
    function showErrors(form, errors) {
        const inputs = form.querySelectorAll('.input, .textarea, .select');

        inputs.forEach((input) => {
            showErrorsForInput(input, errors && errors[input.name]);
        });
    }

    // Shows input errors
    function showErrorsForInput(input, errors) {
        const formGroup = closestParent(input, 'form__group');
        const messageNode = formGroup.querySelector('.form__message');

        // Remove old messages and resets the classes
        resetFormGroup(formGroup);

        if (errors) {
            formGroup.classList.add('form__group_invalid');

            errors.forEach((error) => {
                addError(messageNode, error);
            });
        } else {
            formGroup.classList.add('form__group_valid');
        }
    }

    // Closes parent selector helper
    function closestParent(element, className) {
        if (!element || element == document) {
            return null;
        }
        if (element.classList.contains(className)) {
            return element;
        } else {
            return closestParent(element.parentNode, className);
        }
    }

    function resetFormGroup(formGroup) {
        // Remove the success and error classes
        formGroup.classList.remove('form__group_invalid', 'form__group_valid');

        // Remove error nodes
        formGroup.querySelectorAll('.form__error').forEach((errorBlock) => {
            errorBlock.parentNode.removeChild(errorBlock);
        });
    }

    // Adds error with the following markup
    // <p class='form__error'>[message]</p>
    function addError(container, error) {
        let block = document.createElement('p');
        block.classList.add('form__error');
        block.innerText = error;
        container.appendChild(block);
    }

    function showSuccess() {
        // We made it \:D/
        console.log('Success!');
    }

})();

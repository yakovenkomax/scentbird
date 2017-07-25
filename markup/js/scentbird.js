// Validation
(function() {

    // Validation rules
    const constraints = {
        // gender: {
        //     presence: true,
        //     email: {
        //         message: 'Your gender is required'
        //     }
        // },
        email: {
            presence: true,
            email: {
                message: 'Invalid email address'
            }
        },
        password: {
            presence: true,
            length: {
                minimum: 10,
                message: '10 characters minimum'
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
        // 'b-street': {
        //     presence: true
        // },
        // 'b-zip': {
        //     presence: true
        // },
        // 'b-state': {
        //     presence: true
        // },
        // 'b-city': {
        //     presence: true
        // },
        // 'b-country': {
        //     presence: true
        // },
        card: {
            presence: true,
            card: true
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

    // Custom validator for credit card number
    validate.validators.card = function(value, options, key, attributes) {

        // Credit cards patterns
        const ccTypes = {
            amex: {
                ranges: [{
                    value: 34
                },{
                    value: 37
                }],
                valid_length: [15]
            },
            visa: {
                ranges: [{
                    value: 4
                }],
                valid_length: [13, 14, 15, 16, 17, 18, 19]
            },
            visa_electron: {
                ranges: [{
                    value: 4026
                },{
                    value: 417500
                },{
                    value: 4508
                },{
                    value: 4844
                },{
                    value: 4913
                },{
                    value: 4917
                }],
                valid_length: [16]
            },
            mastercard: {
                ranges: [{
                    from: 51,
                    to: 55
                },{
                    from: 2221,
                    to: 2720
                }],
                valid_length: [16]
            },
            maestro: {
                ranges: [{
                    value: 50
                },{
                    value: 69
                }],
                valid_length: [12, 13, 14, 15, 16, 17, 18, 19]
            },
            discover: {
                ranges: [{
                    value: 6011
                },{
                    from: 622126,
                    to: 622925
                },{
                    from: 644,
                    to: 649
                },{
                    value: 65
                }],
                valid_length: [16]
            }
        }

        const ccType = detectCCType(value, ccTypes);

        // Credit card type detection
        function detectCCType(value, typesObject) {
            let typesArray = [];

            Object.keys(typesObject).forEach((key) => {
                typesObject[key].ranges.forEach((range) => {
                    let rangesArray = [];

                    if (range.hasOwnProperty('value')) {
                        rangesArray.push(range.value);
                    } else {
                        for (let rangeValue = range.from; rangeValue < range.to; rangeValue++) {
                            rangesArray.push(rangeValue);
                        }
                    }

                    rangesArray.forEach((rangeValue) => {
                        let re = new RegExp(`^${rangeValue}`);

                        if (value !== null && value.toString().match(re)) {
                            typesArray.push(key);
                        }
                    });
                });
            });

            if (typesArray.length !== 0) {
                return typesArray[typesArray.length - 1];
            }
        }

        // Validate input value
        if (typeof ccType === 'undefined') {
            return 'Invalid card number';
        } else {
            let valueLength = value.toString().length;
            let lengthMin = ccTypes[ccType].valid_length[0];
            let lengthMax = ccTypes[ccType].valid_length[ccTypes[ccType].valid_length.length - 1];

            if (valueLength < lengthMin || valueLength > lengthMax) {
                return 'Invalid card number';
            }
        }
    };

    // Custom validator for credit card security code
    validate.validators.code = function(value, options, key, attributes) {
        if (value === '111') {
            return 'Invalid security code';
        }
    };

    const form = document.querySelector('.form');
    const inputs = form.querySelectorAll('.input__field');

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
        const inputs = form.querySelectorAll('.input__field');

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
            if (input.value === '') {
                formGroup.classList.add('form__group_empty');
            }

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
        formGroup.classList.remove('form__group_invalid', 'form__group_empty', 'form__group_valid');

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
        alert('Success!');
    }

    // Billing address show/hide
    const billingNode = document.querySelector('.billing');
    const billingInputs = billingNode.querySelectorAll('.input__field');
    const billingCheckbox = document.querySelector('.js-billing');

    billingCheckbox.addEventListener('change', (event) => {
        if (event.target.checked === true) {
            billingNode.classList.add('billing_hidden');
            billingInputs.forEach((input) => {
                input.setAttribute('disabled', '');
            });
        } else {
            billingNode.classList.remove('billing_hidden');
            billingInputs.forEach((input) => {
                input.removeAttribute('disabled');
            });
        }
    });

    // Fill years autocomplete list
    const yearsDataList = document.querySelector('#years');
    const currentYear = (new Date()).getFullYear();

    for (let i = 0; i < 10; i++) {
        let option = document.createElement('option');
        option.value = currentYear + i;
        yearsDataList.appendChild(option);
    }

    // Input fields formatting
    const cleaveCard = new Cleave('.input__field[name="card"]', {
        creditCard: true,
        onCreditCardTypeChanged: function (type) {
            // update UI ...
        }
    });
})();

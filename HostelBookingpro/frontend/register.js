// register.js - UniStay Registration Script

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('UniStay Registration Loaded');
    
    // Get form element
    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        // Add submit event listener
        registerForm.addEventListener('submit', handleRegistration);
        
        // Add real-time validation on input changes
        setupRealTimeValidation();
        
        // Setup registration type switching
        setupRegistrationType();
        
        // Setup password visibility toggle
        setupPasswordToggle();
        
        // Setup modals
        setupModals();
        
        // Setup social login buttons
        setupSocialLogin();
    }
});

/**
 * Setup registration type switching
 */
function setupRegistrationType() {
    const typeOptions = document.querySelectorAll('.type-option');
    
    typeOptions.forEach(option => {
        option.addEventListener('click', function() {
            const type = this.getAttribute('data-type');
            
            // Skip if this is the landlord button (it has onclick for redirect)
            if (type === 'landlord' && this.hasAttribute('onclick')) {
                return; // Let the onclick handle the redirect
            }
            
            // Update active state
            typeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            const forms = document.querySelectorAll('.registration-form');
            forms.forEach(form => {
                if (form.getAttribute('data-type') === type) {
                    form.classList.add('active');
                } else {
                    form.classList.remove('active');
                }
            });
            
            // Update form heading based on type
            const authTitle = document.querySelector('.auth-title');
            if (type === 'landlord') {
                authTitle.textContent = 'Register as Landlord';
                document.querySelector('.auth-subtitle').textContent = 
                    'List your hostels and reach thousands of students';
            } else {
                authTitle.textContent = 'Create Your Account';
                document.querySelector('.auth-subtitle').textContent = 
                    'Join thousands of students finding their perfect accommodation';
            }
        });
    });
}

/**
 * Setup password visibility toggle
 */
function setupPasswordToggle() {
    const toggleButtons = document.querySelectorAll('.toggle-password');
    
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });
}

/**
 * Setup real-time validation
 */
function setupRealTimeValidation() {
    // Password strength checking
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    
    passwordInputs.forEach(input => {
        input.addEventListener('input', function() {
            if (this.value.length > 0) {
                checkPasswordStrength(this.value, this.id);
                
                // Check password match if it's a confirm password field
                if (this.id.includes('confirm')) {
                    validatePasswordMatch(this);
                }
            }
        });
    });
    
    // Email validation on blur
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateEmail(this);
        });
    });
    
    // Phone number validation
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validatePhoneNumber(this);
        });
    });
}

/**
 * Check password strength
 */
function checkPasswordStrength(password, fieldId) {
    // Password requirements
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /[0-9]/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    // Calculate strength score
    const score = Object.values(requirements).filter(Boolean).length;
    const strengthText = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'][score];
    const strengthColors = ['#ff4444', '#ff7744', '#ffaa44', '#44aaff', '#44ff88', '#33cc33'];
    
    // Find the corresponding password strength UI
    const formContainer = document.getElementById(fieldId).closest('.form-group');
    const strengthFill = formContainer.querySelector('.strength-fill');
    const strengthSpan = formContainer.querySelector('.strength-text span');
    
    if (strengthFill && strengthSpan) {
        // Update strength bar
        const percentage = (score / 6) * 100;
        strengthFill.style.width = percentage + '%';
        strengthFill.style.backgroundColor = strengthColors[score];
        
        // Update text
        strengthSpan.textContent = strengthText;
        strengthSpan.style.color = strengthColors[score];
        
        // Update requirement icons
        updateRequirementIcons(formContainer, requirements);
    }
}

/**
 * Update requirement icons
 */
function updateRequirementIcons(container, requirements) {
    Object.keys(requirements).forEach(req => {
        const icon = container.querySelector(`.req-${req} i`);
        if (icon) {
            if (requirements[req]) {
                icon.className = 'fas fa-check-circle';
                icon.style.color = '#33cc33';
            } else {
                icon.className = 'fas fa-circle';
                icon.style.color = '#cccccc';
            }
        }
    });
}

/**
 * Validate password match
 */
function validatePasswordMatch(confirmField) {
    const fieldId = confirmField.id;
    const passwordId = fieldId.replace('confirm', '').replace('Landlord', '').replace('Student', '') + 'Password';
    const passwordField = document.getElementById(passwordId);
    
    if (!passwordField) return;
    
    const password = passwordField.value;
    const confirmPassword = confirmField.value;
    
    const matchContainer = confirmField.closest('.form-group').querySelector('.password-match');
    
    if (matchContainer) {
        if (confirmPassword.length > 0) {
            if (password === confirmPassword) {
                matchContainer.innerHTML = '<i class="fas fa-check"></i><span>Passwords match</span>';
                matchContainer.style.color = '#33cc33';
                confirmField.style.borderColor = '#33cc33';
            } else {
                matchContainer.innerHTML = '<i class="fas fa-times"></i><span>Passwords do not match</span>';
                matchContainer.style.color = '#ff4444';
                confirmField.style.borderColor = '#ff4444';
            }
            matchContainer.style.display = 'flex';
        } else {
            matchContainer.style.display = 'none';
            confirmField.style.borderColor = '';
        }
    }
}

/**
 * Validate email
 */
function validateEmail(emailField) {
    const email = emailField.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email.length > 0 && !emailRegex.test(email)) {
        showFieldError(emailField, 'Please enter a valid email address');
        return false;
    } else {
        clearFieldError(emailField);
        return true;
    }
}

/**
 * Validate phone number
 */
function validatePhoneNumber(phoneField) {
    const phone = phoneField.value.replace(/\s/g, '');
    const phoneRegex = /^\+?[0-9\s\-\(\)]{10,}$/;
    
    if (phone.length > 0 && !phoneRegex.test(phone)) {
        showFieldError(phoneField, 'Please enter a valid phone number');
        return false;
    } else {
        clearFieldError(phoneField);
        return true;
    }
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        field.style.borderColor = '#ff4444';
    }
}

/**
 * Clear field error
 */
function clearFieldError(field) {
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
        field.style.borderColor = '';
    }
}

/**
 * Handle form submission
 */
async function handleRegistration(event) {
    event.preventDefault();
    
    console.log('Registration form submitted');
    
    // Clear previous errors
    clearAllErrors();
    
    // Determine which form is active (only student form is functional now)
    const activeType = document.querySelector('.type-option.active').getAttribute('data-type');
    
    // If landlord is active, show message
    if (activeType === 'landlord') {
        alert('Please use the Landlord button to go to the landlord registration page.');
        return;
    }
    
    // Get student form data
    const formData = {
        userType: 'student',
        email: document.getElementById('studentEmail').value.trim(),
        password: document.getElementById('studentPassword').value,
        confirmPassword: document.getElementById('confirmStudentPassword').value,
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        phone: document.getElementById('phone').value.trim(),
        university: document.getElementById('university').value.trim(),
        termsAgreed: document.getElementById('termsAgreement').checked,
        marketingConsent: document.getElementById('marketingConsent').checked
    };
    
    // Validate form data
    const isValid = validateForm(formData);
    
    if (!isValid) {
        return;
    }
    
    // Show loading state
    setLoadingState(true);
    
    try {
        // Prepare data for API
        const registrationData = {
            ...formData,
            registrationDate: new Date().toISOString()
        };
        
        // Remove confirmPassword as it's not needed for backend
        delete registrationData.confirmPassword;
        
        // In a real app, you would send this to your backend API
        console.log('Registration data:', registrationData);
        
        // Simulate API call with delay
        await simulateAPICall(registrationData);
        
        // Show success or verification
        if (shouldVerifyEmail()) {
            showVerificationModal(registrationData.email);
        } else {
            showSuccessModal(registrationData.userType);
        }
        
    } catch (error) {
        console.error('Registration error:', error);
        showGeneralError('Registration failed. Please try again.');
    } finally {
        setLoadingState(false);
    }
}

/**
 * Validate form data
 */
function validateForm(data) {
    let isValid = true;
    
    // Email validation
    if (!data.email) {
        showFieldErrorById('studentEmail', 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldErrorById('studentEmail', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Password validation
    if (!data.password) {
        showFieldErrorById('studentPassword', 'Password is required');
        isValid = false;
    } else if (data.password.length < 8) {
        showFieldErrorById('studentPassword', 'Password must be at least 8 characters');
        isValid = false;
    }
    
    // Password match validation
    if (data.password !== data.confirmPassword) {
        showFieldErrorById('confirmStudentPassword', 'Passwords do not match');
        isValid = false;
    }
    
    // Name validation
    if (!data.firstName) {
        showFieldErrorById('firstName', 'First name is required');
        isValid = false;
    }
    
    if (!data.lastName) {
        showFieldErrorById('lastName', 'Last name is required');
        isValid = false;
    }
    
    // Phone validation
    if (!data.phone) {
        showFieldErrorById('phone', 'Phone number is required');
        isValid = false;
    }
    
    // University validation
    if (!data.university) {
        showFieldErrorById('university', 'University is required');
        isValid = false;
    }
    
    // Terms agreement
    if (!data.termsAgreed) {
        showGeneralError('You must agree to the Terms of Service and Privacy Policy');
        isValid = false;
    }
    
    return isValid;
}

/**
 * Show field error by ID
 */
function showFieldErrorById(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (field) {
        showFieldError(field, message);
    }
}

/**
 * Clear all errors
 */
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.style.display = 'none';
    });
    
    const formInputs = document.querySelectorAll('.form-control');
    formInputs.forEach(input => {
        input.style.borderColor = '';
    });
}

/**
 * Set loading state
 */
function setLoadingState(isLoading) {
    const submitButton = document.querySelector('#registerForm button[type="submit"]');
    
    if (isLoading) {
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
        submitButton.disabled = true;
    } else {
        submitButton.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
        submitButton.disabled = false;
    }
}

/**
 * Simulate API call
 */
function simulateAPICall(data) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate random success/failure
            const isSuccess = Math.random() > 0.1; // 90% success rate
            
            if (isSuccess) {
                console.log('API call successful:', data);
                resolve({ success: true, message: 'Registration successful' });
            } else {
                console.log('API call failed');
                reject(new Error('Registration failed. Please try again.'));
            }
        }, 1500); // 1.5 second delay
    });
}

/**
 * Check if email verification is needed
 */
function shouldVerifyEmail() {
    // In a real app, this would be based on your business logic
    return true; // Always verify for this demo
}

/**
 * Show verification modal
 */
function showVerificationModal(email) {
    const modal = document.getElementById('verificationModal');
    const emailDisplay = document.getElementById('verificationEmailDisplay');
    
    if (emailDisplay) {
        emailDisplay.textContent = email;
    }
    
    // Setup verification code input
    setupVerificationCode();
    
    // Show modal
    modal.style.display = 'flex';
    
    // Start resend timer
    startResendTimer();
}

/**
 * Setup verification code input
 */
function setupVerificationCode() {
    const codeInputs = document.querySelectorAll('.code-input');
    const hiddenInput = document.getElementById('fullVerificationCode');
    
    codeInputs.forEach((input, index) => {
        // Clear previous values
        input.value = '';
        
        // Handle input
        input.addEventListener('input', function(e) {
            if (this.value.length === 1 && index < 4) {
                codeInputs[index + 1].focus();
            }
            
            // Update hidden input
            updateHiddenCode();
        });
        
        // Handle backspace
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' && this.value.length === 0 && index > 0) {
                codeInputs[index - 1].focus();
            }
        });
    });
    
    // Update hidden input function
    function updateHiddenCode() {
        const code = Array.from(codeInputs).map(input => input.value).join('');
        hiddenInput.value = code;
    }
}

/**
 * Start resend timer
 */
function startResendTimer() {
    const timerElement = document.getElementById('resendTimer');
    const resendButton = document.getElementById('resendCode');
    
    if (!timerElement || !resendButton) return;
    
    let timeLeft = 120; // 2 minutes in seconds
    resendButton.disabled = true;
    
    const timerInterval = setInterval(() => {
        timeLeft--;
        
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerElement.style.display = 'none';
            resendButton.disabled = false;
            resendButton.innerHTML = '<i class="fas fa-redo"></i> Resend Code';
        }
    }, 1000);
}

/**
 * Show success modal
 */
function showSuccessModal(userType) {
    const modal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    
    if (successMessage) {
        successMessage.textContent = `Redirecting to ${userType} dashboard...`;
    }
    
    // Show modal
    modal.style.display = 'flex';
    
    // Setup dashboard button
    const dashboardButton = document.getElementById('goToDashboard');
    if (dashboardButton) {
        dashboardButton.onclick = function() {
            window.location.href = 'student-dashboard.html';
        };
    }
    
    // Auto-redirect after 3 seconds
    setTimeout(() => {
        window.location.href = 'student-dashboard.html';
    }, 3000);
}

/**
 * Show general error
 */
function showGeneralError(message) {
    // Create or find error display
    let errorDisplay = document.getElementById('generalError');
    
    if (!errorDisplay) {
        errorDisplay = document.createElement('div');
        errorDisplay.id = 'generalError';
        errorDisplay.className = 'general-error-message';
        errorDisplay.style.cssText = `
            background-color: #ffebee;
            color: #c62828;
            padding: 12px;
            border-radius: 6px;
            margin-bottom: 20px;
            display: none;
        `;
        
        const form = document.getElementById('registerForm');
        form.parentNode.insertBefore(errorDisplay, form);
    }
    
    errorDisplay.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
    errorDisplay.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        errorDisplay.style.display = 'none';
    }, 5000);
}

/**
 * Setup modals
 */
function setupModals() {
    // Close modals when clicking X
    const closeButtons = document.querySelectorAll('.close-modal');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.style.display = 'none';
            }
        });
    });
    
    // Setup verification button
    const verifyButton = document.getElementById('verifyEmail');
    if (verifyButton) {
        verifyButton.addEventListener('click', function() {
            const code = document.getElementById('fullVerificationCode').value;
            
            if (code.length === 5) {
                // Close verification modal
                document.getElementById('verificationModal').style.display = 'none';
                
                // Show success
                showSuccessModal('student');
            } else {
                alert('Please enter the complete 5-digit code');
            }
        });
    }
    
    // Setup resend code button
    const resendButton = document.getElementById('resendCode');
    if (resendButton) {
        resendButton.addEventListener('click', function() {
            if (!this.disabled) {
                // Simulate resending code
                alert('Verification code has been resent to your email.');
                startResendTimer();
            }
        });
    }
}

/**
 * Setup social login
 */
function setupSocialLogin() {
    const googleBtn = document.getElementById('googleSignup');
    const facebookBtn = document.getElementById('facebookSignup');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            console.log('Google signup clicked');
            // Implement Google OAuth here
            alert('Google signup would be implemented here');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            console.log('Facebook signup clicked');
            // Implement Facebook OAuth here
            alert('Facebook signup would be implemented here');
        });
    }
}

/**
 * Utility: Validate email format
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}
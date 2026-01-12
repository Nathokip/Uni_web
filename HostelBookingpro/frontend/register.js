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
            
            // Update buttons visual state
            typeOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            
            // Update form visibility AND disabled state
            const forms = document.querySelectorAll('.registration-form');
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, select, textarea');
                
                if (form.getAttribute('data-type') === type) {
                    form.classList.add('active');
                    // Enable inputs so they work
                    inputs.forEach(input => input.disabled = false);
                } else {
                    form.classList.remove('active');
                    // Disable inputs so they are ignored by validation
                    inputs.forEach(input => input.disabled = true);
                }
            });
            
            // Update Title Text (Optional, for UX)
            const authTitle = document.querySelector('.auth-title');
            if (authTitle) {
                authTitle.textContent = type === 'landlord' 
                    ? 'Register as Landlord' 
                    : 'Create Your Account';
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
        const maxScore = Object.keys(requirements).length || 1;
        const percentage = (score / maxScore) * 100;
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
/**
 * Handle form submission (Robust Version)
 */
async function handleRegistration(event) {
    event.preventDefault();
    console.log('Registration form submitted');
    
    // 1. Clear previous errors
    const generalError = document.getElementById('generalError');
    if (generalError) generalError.style.display = 'none';

    // 2. Determine active type
    const activeType = document.querySelector('.type-option.active').getAttribute('data-type');
    const isStudent = (activeType === 'student');

    // 3. Helper to get value
    const getVal = (id) => {
        const el = document.getElementById(id);
        return el ? el.value.trim() : '';
    };

    // 4. CONSTRUCT DATA OBJECT FOR VALIDATION
    // We need to build a simple object to pass to your validateForm() function
    const dataToValidate = {
        email: isStudent ? getVal('studentEmail') : getVal('landlordEmail'),
        password: isStudent ? getVal('studentPassword') : getVal('landlordPassword'),
        confirmPassword: isStudent ? getVal('confirmStudentPassword') : getVal('confirmLandlordPassword'),
        firstName: isStudent ? getVal('firstName') : getVal('landlordFirstName'),
        lastName: isStudent ? getVal('lastName') : getVal('landlordLastName'),
        phone: isStudent ? getVal('phone') : getVal('landlordPhone'),
        university: isStudent ? getVal('university') : 'N/A', // Landlords might not need this
        termsAgreed: (document.getElementById('termsCheckbox') ? document.getElementById('termsCheckbox').checked : (document.querySelector('input[type="checkbox"]') ? document.querySelector('input[type="checkbox"]').checked : false))
    };

    // 5. RUN VALIDATION (Crucial Step Added)
    // Clear previous field errors
    clearAllErrors();

    if (!validateForm(dataToValidate, activeType)) {
        console.log('Validation failed');
        return; // Stop execution if validation fails
    }

    // 6. Prepare FormData for Backend
    const formData = new FormData();
    formData.append('role', activeType);
    
    // Append fields based on the validated object
    for (const key in dataToValidate) {
        // Skip confirmPassword and termsAgreed for the backend payload if not needed
        if (key !== 'confirmPassword' && key !== 'termsAgreed') {
            formData.append(key, dataToValidate[key]);
        }
    }
    // Add specific landlord field if needed
    if (!isStudent) {
        formData.append('national_id', getVal('idNumber'));
    }

    // 7. Visual Loading State
    const submitBtn = document.querySelector('#registerForm button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
    submitBtn.disabled = true;
    
    try {
        const response = await fetch('/Uni_web/HostelBookingpro/backend/register.php', {
            method: 'POST',
            body: formData
        });

        const contentType = response.headers.get("content-type");
        
        if (response.ok && contentType && contentType.includes("application/json")) {
            const data = await response.json();
            if (data.status === 'success') {
                // Store the role in localStorage so we know where to redirect later
                localStorage.setItem('userRole', activeType);
                showVerificationModal(data.email);
            } else {
                showGeneralError(data.message || 'Registration failed');
            }
        } else {
            const text = await response.text();
            console.warn('Server Response:', text);
            showGeneralError('Server Error. Check console.');
        }

    } catch (err) {
        console.error('Network Error:', err);
        showGeneralError('Connection failed. Is server running?');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * Validate form data (role-aware)
 */
function validateForm(data, role = 'student') {
    let isValid = true;

    const fieldIdFor = (key) => {
        switch (key) {
            case 'email': return role === 'student' ? 'studentEmail' : 'landlordEmail';
            case 'password': return role === 'student' ? 'studentPassword' : 'landlordPassword';
            case 'confirmPassword': return role === 'student' ? 'confirmStudentPassword' : 'confirmLandlordPassword';
            case 'firstName': return role === 'student' ? 'firstName' : 'landlordFirstName';
            case 'lastName': return role === 'student' ? 'lastName' : 'landlordLastName';
            case 'phone': return role === 'student' ? 'phone' : 'landlordPhone';
            case 'university': return 'university';
            default: return key;
        }
    };

    // Email validation
    if (!data.email) {
        showFieldErrorById(fieldIdFor('email'), 'Email is required');
        isValid = false;
    } else if (!isValidEmail(data.email)) {
        showFieldErrorById(fieldIdFor('email'), 'Please enter a valid email address');
        isValid = false;
    }

    // Password validation
    if (!data.password) {
        showFieldErrorById(fieldIdFor('password'), 'Password is required');
        isValid = false;
    } else if (data.password.length < 8) {
        showFieldErrorById(fieldIdFor('password'), 'Password must be at least 8 characters');
        isValid = false;
    }

    // Password match validation
    if (data.password !== data.confirmPassword) {
        showFieldErrorById(fieldIdFor('confirmPassword'), 'Passwords do not match');
        isValid = false;
    }

    // Name validation
    if (!data.firstName) {
        showFieldErrorById(fieldIdFor('firstName'), 'First name is required');
        isValid = false;
    }

    if (!data.lastName) {
        showFieldErrorById(fieldIdFor('lastName'), 'Last name is required');
        isValid = false;
    }

    // Phone validation
    if (!data.phone) {
        showFieldErrorById(fieldIdFor('phone'), 'Phone number is required');
        isValid = false;
    }

    // University validation (only for students)
    if (role === 'student' && !data.university) {
        showFieldErrorById(fieldIdFor('university'), 'University is required');
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
    // If userType isn't passed, try to get it from storage or DOM
    if (!userType) {
        userType = localStorage.getItem('userRole') || 'student';
    }

    const modal = document.getElementById('successModal');
    const successMessage = document.getElementById('successMessage');
    
    // Determine Dashboard URL based on role
    const dashboardUrl = userType === 'landlord' 
        ? 'landlord-dashboard.html' 
        : 'student-dashboard.html';

    if (successMessage) {
        successMessage.textContent = `Redirecting to ${userType} dashboard...`;
    }
    
    modal.style.display = 'flex';
    
    const dashboardButton = document.getElementById('goToDashboard');
    if (dashboardButton) {
        dashboardButton.onclick = function() {
            window.location.href = dashboardUrl;
        };
    }
    
    setTimeout(() => {
        window.location.href = dashboardUrl;
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
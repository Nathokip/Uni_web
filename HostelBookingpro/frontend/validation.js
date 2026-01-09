// Form Validation for UniStay

class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        this.errors = [];
        this.init();
    }
    
    init() {
        if (!this.form) return;
        
        this.form.addEventListener('submit', (e) => this.validateForm(e));
        this.setupRealTimeValidation();
    }
    
    setupRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        this.clearFieldError(field);
        
        const value = field.value.trim();
        const fieldName = field.getAttribute('name') || field.id;
        
        // Required validation
        if (field.hasAttribute('required') && !value) {
            this.showError(field, `${this.getFieldLabel(field)} is required`);
            return false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                this.showError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        // Phone validation
        if (field.type === 'tel' && value) {
            const phoneRegex = /^[+]?[\d\s\-()]{10,}$/;
            if (!phoneRegex.test(value)) {
                this.showError(field, 'Please enter a valid phone number');
                return false;
            }
        }
        
        // Password validation
        if (field.type === 'password' && value) {
            if (value.length < 8) {
                this.showError(field, 'Password must be at least 8 characters long');
                return false;
            }
            
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                this.showError(field, 'Password must contain uppercase, lowercase, and numbers');
                return false;
            }
        }
        
        // Confirm password validation
        if (field.id.includes('confirm') && value) {
            const passwordField = this.form.querySelector('input[type="password"]:not([id*="confirm"])');
            if (passwordField && value !== passwordField.value) {
                this.showError(field, 'Passwords do not match');
                return false;
            }
        }
        
        // File validation
        if (field.type === 'file') {
            const files = field.files;
            const maxSize = 5 * 1024 * 1024; // 5MB
            const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
            
            if (files.length > 0) {
                for (let file of files) {
                    if (file.size > maxSize) {
                        this.showError(field, `${file.name} is too large. Max size is 5MB`);
                        return false;
                    }
                    
                    if (!allowedTypes.includes(file.type)) {
                        this.showError(field, `${file.name} must be JPG or PNG`);
                        return false;
                    }
                }
            }
        }
        
        return true;
    }
    
    validateForm(e) {
        e.preventDefault();
        this.errors = [];
        
        const fields = this.form.querySelectorAll('input, select, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            this.showSuccess();
            // In a real app, submit the form
            this.submitForm();
        } else {
            this.showFormError('Please fix the errors above');
        }
        
        return isValid;
    }
    
    showError(field, message) {
        // Remove existing error
        this.clearFieldError(field);
        
        // Add error class to field
        field.classList.add('error');
        
        // Create error message element
        const errorEl = document.createElement('div');
        errorEl.className = 'error-message';
        errorEl.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
        
        // Insert after field
        field.parentNode.insertBefore(errorEl, field.nextSibling);
        
        // Add to errors array
        this.errors.push({ field: field.name || field.id, message });
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const errorEl = field.parentNode.querySelector('.error-message');
        if (errorEl) {
            errorEl.remove();
        }
    }
    
    showFormError(message) {
        // Remove existing form error
        const existingError = this.form.querySelector('.form-error');
        if (existingError) existingError.remove();
        
        // Create form error element
        const errorEl = document.createElement('div');
        errorEl.className = 'form-error';
        errorEl.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        // Insert at top of form
        this.form.insertBefore(errorEl, this.form.firstChild);
        
        // Scroll to error
        errorEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    
    showSuccess() {
        // Remove existing success message
        const existingSuccess = this.form.querySelector('.success-message');
        if (existingSuccess) existingSuccess.remove();
        
        // Create success message element
        const successEl = document.createElement('div');
        successEl.className = 'success-message';
        successEl.innerHTML = `<i class="fas fa-check-circle"></i> Form submitted successfully!`;
        
        // Insert at top of form
        this.form.insertBefore(successEl, this.form.firstChild);
        
        // Scroll to success message
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Reset form after 3 seconds
        setTimeout(() => {
            successEl.remove();
            this.form.reset();
        }, 3000);
    }
    
    getFieldLabel(field) {
        const label = field.previousElementSibling;
        if (label && label.tagName === 'LABEL') {
            return label.textContent.replace('*', '').trim();
        }
        return field.placeholder || field.name || 'This field';
    }
    
    async submitForm() {
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        const formData = new FormData(this.form);

        // 1. Show Loading Spinner
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;

        try {
            // 2. CHECK: Is this the Login Form?
            if (this.form.id === 'loginForm') {
                
                const response = await fetch('/Uni_web/HostelBookingpro/backend/login.php', {
                    method: 'POST',
                    body: formData
                });
                
                // Handle the text/json manually to prevent crashes
                const text = await response.text();
                let data;
                try { data = JSON.parse(text); } 
                catch (e) { throw new Error("Server Error: " + text); }

                if (data.status === 'success') {
                    // 1. Show Visual Success (Green checkmark)
                    this.showSuccess(); 
                    
                    // 2. SAVE USER SESSION (Crucial Step!)
                    // This stores the user data in the browser so hostels.js knows you are logged in.
                    if (data.user) {
                        localStorage.setItem('unistay_user', JSON.stringify(data.user));
                    }

                    // 3. Redirect after 1 second
                    setTimeout(() => {
                        if (data.role === 'landlord') {
                            window.location.href = 'landlord-dashboard.html';
                        } else {
                            window.location.href = 'index.html';
                        }
                    }, 1000);
                } else {
                    this.showFormError(data.message || 'Login failed');
                }
            } 
            
            // 3. CHECK: Is this the Registration Form?
            else if (this.form.id === 'registerForm') {
                // If you want validation.js to handle registration too, 
                // you can paste the fetch logic from register.js here.
                // Otherwise, we just return and let register.js handle it.
                console.log('Validation passed. Handing over to register.js...');
            }

        } catch (error) {
            console.error(error);
            this.showFormError('Connection failed. Please check your internet or server.');
        } finally {
            // Restore button if we didn't redirect
            if (this.form.id !== 'loginForm' || !window.location.href.includes('dashboard')) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }
    }
    
    getFormData() {
        const formData = {};
        const fields = this.form.querySelectorAll('input, select, textarea');
        
        fields.forEach(field => {
            if (field.type === 'file') {
                formData[field.name || field.id] = field.files;
            } else {
                formData[field.name || field.id] = field.value;
            }
        });
        
        return formData;
    }
}

// Initialize validators
document.addEventListener('DOMContentLoaded', function() {
    // Initialize form validators
    const forms = ['loginForm', 'registerForm', 'landlordForm', 'contactForm'];
    
    forms.forEach(formId => {
        if (document.getElementById(formId)) {
            new FormValidator(formId);
        }
    });
    
    // Special validation for landlord form
    const landlordForm = document.getElementById('landlordForm');
    if (landlordForm) {
        initLandlordForm();
    }
});

// Landlord form specific validation
// Inside your existing initLandlordForm() function...

function initLandlordForm() {
    // ... existing image preview code ...

    // Drag and drop for upload areas
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        const input = area.querySelector('input[type="file"]');
        const textElement = area.querySelector('p'); // Get the text <p> tag

        // --- 1. MISSING PART: MAKE CLICKING WORK ---
        // If user clicks the div, trigger the hidden input
        area.addEventListener('click', (e) => {
            // Prevent recursive clicking if user somehow hits the input directly
            if (e.target !== input) {
                input.click();
            }
        });

        // --- 2. MISSING PART: UPDATE TEXT ON FILE SELECT ---
        // When a file is chosen via click OR drag, update the text
        if (input) {
            input.addEventListener('change', function() {
                if (this.files && this.files.length > 0) {
                    const count = this.files.length;
                    const fileName = this.files[0].name;
                    
                    // Update the text so user sees what they picked
                    textElement.textContent = count > 1 ? `${count} files selected` : fileName;
                    
                    // Add blue border styling
                    area.style.borderColor = "#2563eb";
                    area.style.backgroundColor = "#eff6ff";
                }
            });
        }
        // ------------------------------------------

        // ... your existing dragover code ...
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        // ... your existing dragleave code ...
        area.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        // ... your existing drop code ...
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            
            if (input) {
                input.files = files;
                input.dispatchEvent(new Event('change')); // This triggers the text update above
            }
        });
    });
}
    
    
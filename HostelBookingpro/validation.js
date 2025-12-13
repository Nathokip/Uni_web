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
    
    submitForm() {
        // In a real app, this would be an AJAX request
        console.log('Form submitted successfully!', this.getFormData());
        
        // Simulate API call
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
        submitBtn.disabled = true;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }, 2000);
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
function initLandlordForm() {
    const imageUpload = document.getElementById('hostelImages');
    const imagePreview = document.getElementById('imagePreview');
    
    if (imageUpload) {
        imageUpload.addEventListener('change', function(e) {
            const files = Array.from(e.target.files).slice(0, 4); // Limit to 4 images
            imagePreview.innerHTML = '';
            
            files.forEach((file, index) => {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const previewItem = document.createElement('div');
                    previewItem.className = 'preview-item';
                    previewItem.innerHTML = `
                        <img src="${e.target.result}" alt="Preview ${index + 1}">
                        <div class="remove-image" data-index="${index}">
                            <i class="fas fa-times"></i>
                        </div>
                    `;
                    
                    imagePreview.appendChild(previewItem);
                    
                    // Add remove functionality
                    previewItem.querySelector('.remove-image').addEventListener('click', function() {
                        previewItem.remove();
                        
                        // Remove file from input
                        const dt = new DataTransfer();
                        const remainingFiles = Array.from(imageUpload.files).filter((_, i) => i != this.dataset.index);
                        remainingFiles.forEach(file => dt.items.add(file));
                        imageUpload.files = dt.files;
                    });
                };
                
                reader.readAsDataURL(file);
            });
        });
    }
    
    // Drag and drop for upload areas
    const uploadAreas = document.querySelectorAll('.upload-area');
    
    uploadAreas.forEach(area => {
        area.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', function() {
            this.classList.remove('dragover');
        });
        
        area.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            const input = this.querySelector('input[type="file"]');
            
            if (input) {
                input.files = files;
                input.dispatchEvent(new Event('change'));
            }
        });
    });
}

// Password strength indicator
function initPasswordStrength() {
    const passwordInput = document.getElementById('password');
    
    if (passwordInput) {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        
        passwordInput.parentNode.appendChild(strengthIndicator);
        
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            
            strengthIndicator.innerHTML = `
                <div class="strength-bar">
                    <div class="strength-fill" style="width: ${strength.percentage}%; background: ${strength.color};"></div>
                </div>
                <span class="strength-text" style="color: ${strength.color};">${strength.text}</span>
            `;
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    
    if (password.length >= 8) score += 25;
    if (/[a-z]/.test(password)) score += 25;
    if (/[A-Z]/.test(password)) score += 25;
    if (/[0-9]/.test(password)) score += 15;
    if (/[^A-Za-z0-9]/.test(password)) score += 10;
    
    if (score >= 80) {
        return { percentage: 100, color: '#10b981', text: 'Strong' };
    } else if (score >= 60) {
        return { percentage: 75, color: '#f59e0b', text: 'Good' };
    } else if (score >= 40) {
        return { percentage: 50, color: '#f59e0b', text: 'Fair' };
    } else {
        return { percentage: 25, color: '#ef476f', text: 'Weak' };
    }
}
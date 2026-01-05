// contact.js - Contact Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
    initChatWidget();
});

// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };
            
            // Validate
            if (!validateContactForm(formData)) {
                return;
            }
            
            // Show loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                // Show success message
                showMessage('success', 'Message sent successfully! We\'ll get back to you within 24 hours.');
                
                // Reset form
                contactForm.reset();
            }, 1500);
        });
    }
}

function validateContactForm(data) {
    // Simple validation
    if (!data.name.trim()) {
        showMessage('error', 'Please enter your name');
        return false;
    }
    
    if (!data.email.trim()) {
        showMessage('error', 'Please enter your email');
        return false;
    }
    
    if (!isValidEmail(data.email)) {
        showMessage('error', 'Please enter a valid email address');
        return false;
    }
    
    if (!data.subject) {
        showMessage('error', 'Please select a subject');
        return false;
    }
    
    if (!data.message.trim()) {
        showMessage('error', 'Please enter your message');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showMessage(type, text) {
    // Remove existing messages
    const existingMsg = document.querySelector('.form-message');
    if (existingMsg) existingMsg.remove();
    
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `form-message ${type}`;
    messageEl.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        <span>${text}</span>
    `;
    
    // Insert after form
    const contactForm = document.getElementById('contactForm');
    contactForm.parentNode.insertBefore(messageEl, contactForm.nextSibling);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        messageEl.remove();
    }, 5000);
}

// FAQ functionality
function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle active class
            this.classList.toggle('active');
            
            // Toggle answer visibility
            if (answer.classList.contains('open')) {
                answer.classList.remove('open');
                answer.style.maxHeight = null;
            } else {
                answer.classList.add('open');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
            
            // Rotate icon
            icon.style.transform = this.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
        });
    });
}

// Chat widget functionality
function initChatWidget() {
    const chatToggle = document.querySelector('.chat-toggle');
    const chatContainer = document.querySelector('.chat-container');
    const closeChat = document.querySelector('.close-chat');
    const sendChatBtn = document.getElementById('sendChat');
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    if (!chatToggle || !chatContainer) return;
    
    // Toggle chat
    chatToggle.addEventListener('click', function() {
        chatContainer.classList.toggle('open');
    });
    
    // Close chat
    closeChat.addEventListener('click', function() {
        chatContainer.classList.remove('open');
    });
    
    // Send message
    if (sendChatBtn && chatInput && chatMessages) {
        sendChatBtn.addEventListener('click', sendChatMessage);
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendChatMessage();
            }
        });
        
        // Add initial bot message
        addChatMessage('bot', 'Hi! I\'m UniStay Support. How can I help you today?');
    }
}

function sendChatMessage() {
    const chatInput = document.getElementById('chatInput');
    const chatMessages = document.getElementById('chatMessages');
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // Add user message
    addChatMessage('user', message);
    chatInput.value = '';
    
    // Simulate bot response after delay
    setTimeout(() => {
        const responses = [
            "Thanks for your message! Our support team will get back to you shortly.",
            "I can help you with booking inquiries, landlord registrations, or general questions.",
            "For urgent matters, please call our support line at +254 700 123 456.",
            "You can also email us at support@unistay.com for detailed assistance."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addChatMessage('bot', randomResponse);
    }, 1000);
}

function addChatMessage(sender, text) {
    const chatMessages = document.getElementById('chatMessages');
    
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message ${sender}`;
    messageEl.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
    `;
    
    chatMessages.appendChild(messageEl);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
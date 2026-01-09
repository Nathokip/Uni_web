// contact.js - Contact Page Functionality

document.addEventListener('DOMContentLoaded', function() {
    initContactForm();
    initFAQ();
    initChatWidget();
});

// Contact form handling
// Contact form handling
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // 1. Get form data using FormData (Handling simpler for PHP)
            const formData = new FormData(contactForm);
            
            // Validate (Manually getting values for your existing validation function)
            const validationData = {
                name: document.getElementById('contactName').value,
                email: document.getElementById('contactEmail').value,
                subject: document.getElementById('contactSubject').value,
                message: document.getElementById('contactMessage').value
            };
            
            if (!validateContactForm(validationData)) {
                return;
            }
            
            // 2. Add keys to FormData because your HTML IDs might not match PHP expectations
            // We ensure the keys match exactly what backend/contact.php expects
            formData.set('name', validationData.name);
            formData.set('email', validationData.email);
            formData.set('subject', validationData.subject);
            formData.set('message', validationData.message);

            // Show loading
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;
            
            try {
                // 3. REAL API CALL
                const response = await fetch('/Uni_web/HostelBookingpro/backend/contact.php', {
                    method: 'POST',
                    body: formData
                });
                
                const data = await response.json();

                if (data.status === 'success') {
                    showMessage('success', 'Message sent successfully! We\'ll get back to you within 24 hours.');
                    contactForm.reset();
                } else {
                    showMessage('error', data.message || 'Failed to send message.');
                }

            } catch (error) {
                console.error(error);
                showMessage('error', 'Connection failed. Please try again later.');
            } finally {
                // Reset button
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
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
    
    const message = chatInput.value.trim();
    if (!message) return;
    
    // 1. Show user message locally
    addChatMessage('user', message);
    chatInput.value = '';
    
    // 2. The Phone Number
    // IMPORTANT: Use format "2547..." (No spaces, no plus sign, no leading zero)
    const phoneNumber = "254742574005"; 
    
    // 3. Encode the message (handles spaces and special characters)
    const encodedMessage = encodeURIComponent(message);
    
    // 4. THE FIX: Use the full API link
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    // 5. Open
    setTimeout(() => {
        addChatMessage('bot', 'Opening WhatsApp...');
        window.open(whatsappUrl, '_blank');
    }, 800);
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
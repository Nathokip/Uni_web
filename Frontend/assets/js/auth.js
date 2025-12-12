document.addEventListener('DOMContentLoaded', function() {
    
    // 1. Password Visibility Toggle
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const passwordIcon = togglePassword.querySelector('i');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        passwordIcon.classList.toggle('fa-eye');
        passwordIcon.classList.toggle('fa-eye-slash');
    });

    // 2. Password Strength Meter
    passwordField.addEventListener('input', function() {
        const password = passwordField.value;
        const strengthBar = document.querySelector('.strength-fill');
        let strength = 0;
        if (password.length >= 8) strength += 25;
        if (/[A-Z]/.test(password)) strength += 25;
        if (/[0-9]/.test(password)) strength += 25;
        if (/[^A-Za-z0-9]/.test(password)) strength += 25;
        
        strengthBar.style.width = `${strength}%`;
        
        if (strength < 50) strengthBar.style.backgroundColor = '#f44336'; // Red
        else if (strength < 75) strengthBar.style.backgroundColor = '#ff9800'; // Orange
        else strengthBar.style.backgroundColor = '#4caf50'; // Green
    });
    
    // 3. THE REAL LOGIN LOGIC
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const btn = document.querySelector('.signin-btn');

        // Show loading state
        const originalText = btn.innerText;
        btn.innerText = "Signing in...";
        btn.disabled = true;

        try {
            // CALL THE BACKEND (Node.js)
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // SUCCESS
                localStorage.setItem('token', data.token); // Save the key
                localStorage.setItem('user', JSON.stringify(data.user)); // Save user info

                alert(`Welcome back, ${data.user.email}!`);
                
                // Redirect based on role
                if (data.user.role === 'landlord') {
                    window.location.href = 'landlord.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                // ERROR (Wrong password)
                alert(data.error || "Login failed");
            }

        } catch (error) {
            console.error(error);
            alert("Cannot connect to server. Is the backend running?");
        } finally {
            // Reset button
            btn.innerText = originalText;
            btn.disabled = false;
        }
    });
});
document.addEventListener('DOMContentLoaded', function() {
    // 1. Extract Email and Code from URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const code = urlParams.get('code');

    // If paramaters are missing, kick user back to start
    if (!email || !code) {
        alert("Invalid Link. Please try resetting again.");
        window.location.href = 'forgot-password.html';
        return; // Stop execution
    }

    // 2. Fill Hidden Inputs automatically
    document.getElementById('email').value = email;
    document.getElementById('otp_code').value = code;

    // 3. Handle Form Submission
    const form = document.getElementById('resetForm');
    const msgBox = document.getElementById('msgBox');

    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const p1 = document.getElementById('newPassword').value;
        const p2 = document.getElementById('confirmPassword').value;

        // Check matching passwords
        if (p1 !== p2) {
            msgBox.textContent = "Passwords do not match!";
            msgBox.style.display = 'block';
            msgBox.style.color = '#dc3545'; // Red
            msgBox.style.background = '#ffe6e6';
            return;
        }

        // Show Loading State
        const btn = form.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Updating...';
        btn.disabled = true;

        const formData = new FormData(form);

        try {
            const response = await fetch('/Uni_web/HostelBookingpro/backend/reset_password.php', {
                method: 'POST',
                body: formData
            });
            
            // Parse JSON safely
            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (err) {
                console.error("Server Raw Response:", text);
                throw new Error("Server Error. Check console.");
            }

            if (data.status === 'success') {
                msgBox.textContent = "Success! Redirecting to login...";
                msgBox.style.color = '#155724'; // Dark Green
                msgBox.style.background = '#d4edda'; // Light Green
                msgBox.style.display = 'block';
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } else {
                msgBox.textContent = data.message;
                msgBox.style.color = '#dc3545';
                msgBox.style.background = '#ffe6e6';
                msgBox.style.display = 'block';
                
                // Restore button on error
                btn.innerHTML = originalText;
                btn.disabled = false;
            }
        } catch (err) {
            console.error(err);
            msgBox.textContent = "Connection failed. Please try again.";
            msgBox.style.color = '#dc3545';
            msgBox.style.background = '#ffe6e6';
            msgBox.style.display = 'block';
            
            // Restore button on error
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });
});
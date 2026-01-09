document.addEventListener('DOMContentLoaded', function() {
    const forgotForm = document.getElementById('forgotPasswordForm');
    const otpForm = document.getElementById('otpForm');
    const msgBox = document.getElementById('messageBox');
    const modal = document.getElementById('otpModal');
    
    // Helper to show messages
    function showMessage(msg, type) {
        msgBox.textContent = msg;
        msgBox.style.display = 'block';
        msgBox.style.backgroundColor = type === 'error' ? '#ffe6e6' : '#e6fffa';
        msgBox.style.color = type === 'error' ? '#dc3545' : '#28a745';
    }

    // 1. Handle "Send Code"
    forgotForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const btn = this.querySelector('button');
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        btn.disabled = true;

        const formData = new FormData(this);

        try {
            const response = await fetch('/Uni_web/HostelBookingpro/backend/forgot_password.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.status === 'success') {
                // Success: Show Modal and pass Email to it
                document.getElementById('hiddenEmail').value = document.getElementById('resetEmail').value;
                modal.style.display = 'block';
                showMessage("Code sent! Check your inbox.", 'success');
            } else {
                showMessage(data.message, 'error');
            }
        } catch (err) {
            console.error(err);
            showMessage("Connection error. Check console.", 'error');
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    // 2. Handle OTP Verification
    otpForm.addEventListener('submit', function(e) {
        e.preventDefault();
        // Redirect to the Reset Password page with email and code in URL
        const email = document.getElementById('hiddenEmail').value;
        const code = document.getElementById('otpCode').value;
        window.location.href = `reset-password.html?email=${email}&code=${code}`;
    });

    // Close Modal Logic
    document.querySelector('.close').onclick = () => modal.style.display = 'none';
});
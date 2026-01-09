document.addEventListener('DOMContentLoaded', function() {
    initFileUploads();
    initHostelImagePreview();
    initFormSubmission();
});

// 1. Handle Drag & Drop + File Selection Visuals
function initFileUploads() {
    const uploadAreas = document.querySelectorAll('.upload-area');

    uploadAreas.forEach(area => {
        const input = area.querySelector('input[type="file"]');
        const textElement = area.querySelector('p');
        const icon = area.querySelector('i');

        // Click to upload
        area.addEventListener('click', (e) => {
            if (e.target !== input) {
                input.click();
            }
        });

        // Update text when file is selected
        input.addEventListener('change', function() {
            updateFileStatus(this, textElement, area, icon);
        });

        // Drag & Drop Visuals
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            area.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        area.addEventListener('dragover', () => area.classList.add('dragover'));
        area.addEventListener('dragleave', () => area.classList.remove('dragover'));

        area.addEventListener('drop', (e) => {
            area.classList.remove('dragover');
            const files = e.dataTransfer.files;
            input.files = files;
            updateFileStatus(input, textElement, area, icon);
            
            // Trigger change event manually for previews
            const event = new Event('change');
            input.dispatchEvent(event);
        });
    });
}

function updateFileStatus(input, textElement, area, icon) {
    if (input.files && input.files.length > 0) {
        const count = input.files.length;
        const fileName = input.files[0].name;
        
        // Update UI to show success
        textElement.innerHTML = `<strong>${count > 1 ? count + ' files' : fileName}</strong> selected`;
        textElement.style.color = '#155724';
        area.style.borderColor = '#28a745';
        area.style.backgroundColor = '#d4edda';
        icon.className = 'fas fa-check-circle';
        icon.style.color = '#28a745';
    }
}

// 2. Specific Logic for Hostel Image Previews (Thumbnails)
function initHostelImagePreview() {
    const imageInput = document.getElementById('hostelImages');
    const previewContainer = document.getElementById('imagePreview');

    if (imageInput && previewContainer) {
        imageInput.addEventListener('change', function(e) {
            previewContainer.innerHTML = ''; // Clear previous
            const files = Array.from(e.target.files).slice(0, 4); // Limit to 4

            files.forEach(file => {
                if (!file.type.startsWith('image/')) return;

                const reader = new FileReader();
                reader.onload = function(e) {
                    const div = document.createElement('div');
                    div.className = 'preview-item';
                    div.style.cssText = 'width: 80px; height: 80px; border-radius: 5px; overflow: hidden; display: inline-block; margin-right: 10px; position: relative; border: 1px solid #ddd;';
                    div.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;">`;
                    previewContainer.appendChild(div);
                };
                reader.readAsDataURL(file);
            });
        });
    }
}

// 3. Handle Form Submission
function initFormSubmission() {
    const form = document.getElementById('landlordForm');
    
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            // Visual Feedback
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Uploading...';
            submitBtn.disabled = true;

            // Create FormData (Automatically handles files)
            const formData = new FormData(form);

            try {
                // Ensure path matches your folder structure
                const response = await fetch('/Uni_web/HostelBookingpro/backend/process_landlord.php', {
                    method: 'POST',
                    body: formData
                });

                const data = await response.json();

                if (data.status === 'success') {
                    // Success UI
                    form.innerHTML = `
                        <div style="text-align: center; padding: 40px;">
                            <i class="fas fa-check-circle" style="font-size: 5rem; color: #28a745; margin-bottom: 20px;"></i>
                            <h2>Application Received!</h2>
                            <p>Thank you, ${data.name}. We have received your documents.</p>
                            <p>Our team will verify your details within 24-48 hours.</p>
                            <a href="index.html" class="btn btn-primary" style="margin-top: 20px;">Return Home</a>
                        </div>
                    `;
                    // Scroll to top
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    alert('Error: ' + data.message);
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }

            } catch (error) {
                console.error(error);
                alert('Connection failed. Please check your internet or server.');
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}
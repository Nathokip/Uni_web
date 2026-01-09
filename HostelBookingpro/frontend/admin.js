document.addEventListener('DOMContentLoaded', loadRequests);

async function loadRequests() {
    try {
        const response = await fetch('/Uni_web/HostelBookingpro/backend/admin_get_requests.php');
        const requests = await response.json();
        
        const container = document.getElementById('requestsList');
        document.getElementById('loading').style.display = 'none';
        container.innerHTML = '';

        if (requests.length === 0) {
            container.innerHTML = '<p>No pending requests.</p>';
            return;
        }

        requests.forEach(req => {
            // Helper to parse JSON file paths
            const parseFiles = (jsonStr) => {
                try { return JSON.parse(jsonStr); } catch(e) { return []; }
            };
            const idFiles = parseFiles(req.id_images);
            
            const html = `
                <div class="request-card" id="card-${req.id}">
                    <div class="req-info">
                        <h3>${req.full_name} <span class="badge">${req.status}</span></h3>
                        <p><strong><i class="fas fa-envelope"></i></strong> ${req.email}</p>
                        <p><strong><i class="fas fa-phone"></i></strong> ${req.phone}</p>
                        <p><strong><i class="fas fa-id-card"></i></strong> ${req.id_number}</p>
                        <hr>
                        <h4>Hostel: ${req.hostel_name}</h4>
                        <p><i class="fas fa-map-marker-alt"></i> ${req.location}</p>
                        <p><i class="fas fa-tag"></i> KES ${parseInt(req.price).toLocaleString()}</p>
                    </div>
                    
                    <div class="req-docs">
                        <h4>Documents</h4>
                        <p>ID Cards:</p>
                        ${idFiles.map(path => `<a href="${path.replace('../', '')}" target="_blank" class="doc-link"><i class="fas fa-file-image"></i> View ID</a>`).join('')}
                    </div>

                    <div class="req-actions">
                        <button onclick="verifyLandlord(${req.id}, 'approved')" class="btn btn-primary" style="background: #28a745; border-color: #28a745;">
                            <i class="fas fa-check"></i> Approve
                        </button>
                        <button onclick="verifyLandlord(${req.id}, 'rejected')" class="btn btn-outline" style="color: #dc3545; border-color: #dc3545;">
                            <i class="fas fa-times"></i> Reject
                        </button>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

    } catch (err) {
        console.error(err);
        document.getElementById('requestsList').innerHTML = '<p style="color:red">Error loading requests.</p>';
    }
}

async function verifyLandlord(id, status) {
    if (!confirm(`Are you sure you want to mark this as ${status}?`)) return;

    try {
        const formData = new FormData();
        formData.append('id', id);
        formData.append('status', status);

        const response = await fetch('/Uni_web/HostelBookingpro/backend/admin_verify.php', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            alert(`Landlord ${status} successfully!`);
            document.getElementById(`card-${id}`).remove(); // Remove from view
        } else {
            alert('Error: ' + data.message);
        }
    } catch (err) {
        alert('Connection error');
    }
}   
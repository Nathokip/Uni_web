// Main JavaScript for UniStay

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavbar();
    initSearch();
    loadFeaturedHostels(); // <-- Updated to fetch from DB
    initMobileMenu();
    initScrollEffects();
});

// 1. Navbar scroll effect
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.classList.add('scrolled');
                
                if (currentScroll > lastScroll && currentScroll > 400) {
                    navbar.style.transform = 'translateY(-100%)'; // Scrolling down
                } else {
                    navbar.style.transform = 'translateY(0)'; // Scrolling up
                }
            } else {
                navbar.classList.remove('scrolled');
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
}

// 2. Search functionality
function initSearch() {
    const searchForm = document.getElementById('searchForm');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const searchBtn = searchForm.querySelector('button[type="submit"]');
            const originalText = searchBtn.innerHTML;
            
            // Visual feedback
            searchBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Searching...';
            searchBtn.disabled = true;
            
            // Gather values
            const location = document.getElementById('location').value;
            const price = document.getElementById('price').value;
            const roommate = document.getElementById('roommate').value;

            // Redirect to hostels page with parameters
            setTimeout(() => {
                const params = new URLSearchParams();
                if (location) params.append('location', location);
                if (price) params.append('price', price);
                if (roommate) params.append('roommate', roommate);
                
                window.location.href = `hostels.html?${params.toString()}`;
            }, 800);
        });
    }
}

// 3. Featured Hostels (Connected to Database)
async function loadFeaturedHostels() {
    const hostelGrid = document.getElementById('featuredHostels');
    
    if (!hostelGrid) return;

    // Show loading skeleton/spinner
    hostelGrid.innerHTML = `
        <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
            <i class="fas fa-spinner fa-spin fa-3x" style="color: var(--primary);"></i>
            <p style="margin-top: 15px; color: #666;">Loading top hostels...</p>
        </div>
    `;

    try {
        // Fetch from backend
        const response = await fetch('../backend/get_hostels.php');
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const allHostels = await response.json();
        
        // Take only the first 3 hostels for the homepage
        const featuredHostels = allHostels.slice(0, 3);

        if (featuredHostels.length === 0) {
            hostelGrid.innerHTML = '<p class="text-center" style="grid-column: 1/-1;">No hostels found.</p>';
            return;
        }

        // Render Cards
        hostelGrid.innerHTML = featuredHostels.map(hostel => createHostelCard(hostel)).join('');

        // Initialize Sliders for the new cards
        initImageSliders();

        // Add Event Delegation for Buttons (Better performance)
        hostelGrid.addEventListener('click', function(e) {
            const bookBtn = e.target.closest('.btn-book');
            const detailsBtn = e.target.closest('.btn-details');

            if (bookBtn) {
                const id = bookBtn.getAttribute('data-id');
                bookHostel(id);
            }
            if (detailsBtn) {
                const id = detailsBtn.getAttribute('data-id');
                viewHostelDetails(id);
            }
        });

    } catch (error) {
        console.error('Error:', error);
        hostelGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; color: #e74c3c;">
                <p>Unable to load hostels. Please try again later.</p>
            </div>
        `;
    }
}

// Helper: Create HTML for a single card
function createHostelCard(hostel) {
    // Process Data Types
    const price = Number(hostel.price) || 0;
    const originalPrice = Number(hostel.originalPrice) || (price + 2000);
    const savings = originalPrice - price;
    const discount = hostel.discount || Math.round((savings / originalPrice) * 100) + '% off';
    
    const rating = Number(hostel.rating) || 4.5;
    const stars = generateStarRating(rating);
    
    const roommateOption = hostel.roommateOption || 'Share with Roommate';
    const roommateIcon = roommateOption.toLowerCase().includes('alone') ? 'fa-user' : 'fa-users';

    // Handle Images (Parse JSON if string, or use placeholder)
    let images = hostel.images;
    if (typeof images === 'string') {
        try { images = JSON.parse(images); } catch(e) { images = []; }
    }
    if (!Array.isArray(images) || images.length === 0) {
        images = ['assets/images/placeholder.jpg'];
    }

    return `
        <div class="hostel-card fade-in" data-id="${hostel.id}">
            <div class="discount-badge">${discount}</div>
            <div class="hostel-images">
                <div class="image-slider" id="slider-${hostel.id}">
                    ${images.map(img => `<img src="${img}" alt="${hostel.name}" onerror="this.src='assets/images/placeholder.jpg'">`).join('')}
                </div>
                ${images.length > 1 ? `
                    <div class="image-nav" id="nav-${hostel.id}">
                        ${images.map((_, i) => `<div class="image-dot ${i === 0 ? 'active' : ''}" data-slide="${i}"></div>`).join('')}
                    </div>
                ` : ''}
            </div>
            
            <div class="hostel-info">
                <div class="hostel-header">
                    <div>
                        <h3 class="hostel-title">${hostel.name}</h3>
                        <p class="hostel-location">
                            <i class="fas fa-map-marker-alt"></i> ${hostel.location}
                        </p>
                    </div>
                </div>
                
                <div class="hostel-price">
                    <span class="current-price">KES ${price.toLocaleString()}</span>
                    <span class="original-price">KES ${originalPrice.toLocaleString()}</span>
                    <span class="save-badge">Save KES ${savings.toLocaleString()}</span>
                </div>
                
                <div class="hostel-meta">
                    <span class="roommate-tag">
                        <i class="fas ${roommateIcon}"></i> ${roommateOption}
                    </span>
                    <div class="rating">
                        ${stars}
                        <span>${rating} (${hostel.reviews || 10})</span>
                    </div>
                </div>
                
                <div class="card-actions">
                    <button class="btn btn-primary btn-book" data-id="${hostel.id}">
                        <i class="fas fa-calendar-check"></i> Book Now
                    </button>
                    <button class="btn btn-outline btn-details" data-id="${hostel.id}">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Helper: Star Rating Generator
function generateStarRating(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    return stars;
}

// 4. Image Slider Logic
function initImageSliders() {
    // Only target sliders that haven't been initialized yet to avoid double-binding if called multiple times
    document.querySelectorAll('.hostel-images').forEach(container => {
        if(container.dataset.initialized) return; 
        container.dataset.initialized = "true";

        const slider = container.querySelector('.image-slider');
        const dots = container.querySelectorAll('.image-dot');
        
        if (!slider || !dots.length) return;

        let currentSlide = 0;
        let slideInterval;

        const startSlide = () => {
            slideInterval = setInterval(() => {
                currentSlide = (currentSlide + 1) % dots.length;
                updateSlider(slider, dots, currentSlide);
            }, 5000);
        };

        startSlide();
        
        // Dot clicks
        dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent card click
                currentSlide = index;
                updateSlider(slider, dots, currentSlide);
                clearInterval(slideInterval);
                startSlide();
            });
        });
        
        // Hover effects
        container.addEventListener('mouseenter', () => clearInterval(slideInterval));
        container.addEventListener('mouseleave', startSlide);
    });
}

function updateSlider(slider, dots, slideIndex) {
    if(!slider) return;
    slider.style.transform = `translateX(-${slideIndex * 100}%)`;
    if(dots.length > 0) {
        dots.forEach(dot => dot.classList.remove('active'));
        if(dots[slideIndex]) dots[slideIndex].classList.add('active');
    }
}

// 5. Mobile Menu
function initMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    
    if (menuBtn && navLinks && authButtons) {
        menuBtn.addEventListener('click', function() {
            const isVisible = navLinks.style.display === 'flex';
            
            if (isVisible) {
                navLinks.style.display = 'none';
                authButtons.style.display = 'none';
            } else {
                // Apply inline styles for mobile view
                navLinks.style.display = 'flex';
                navLinks.style.flexDirection = 'column';
                navLinks.style.position = 'absolute';
                navLinks.style.top = '70px'; // Adjusted top
                navLinks.style.left = '0';
                navLinks.style.right = '0';
                navLinks.style.backgroundColor = '#fff';
                navLinks.style.padding = '2rem';
                navLinks.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
                navLinks.style.zIndex = '100';
                
                authButtons.style.display = 'flex';
                authButtons.style.flexDirection = 'column';
                authButtons.style.position = 'absolute';
                authButtons.style.top = '300px'; // Rough estimate, css classes are better
                authButtons.style.left = '0';
                authButtons.style.right = '0';
                authButtons.style.backgroundColor = '#fff';
                authButtons.style.padding = '0 2rem 2rem 2rem';
                authButtons.style.zIndex = '100';
                authButtons.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            }
        });
    }
}

// 6. Scroll Animations
function initScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    // Elements to animate
    document.querySelectorAll('.feature-card, .hostel-card').forEach(card => {
        observer.observe(card);
    });
}

// Navigation Actions
function bookHostel(hostelId) {
    // Redirect to login or booking flow
    // Ideally check login status via API or Token
    const isLoggedIn = localStorage.getItem('unistay_user') !== null;
    if (!isLoggedIn) {
        window.location.href = `login.html?redirect=booking&hostel=${hostelId}`;
    } else {
        // If you have a dedicated booking page:
        // window.location.href = `booking.html?hostel=${hostelId}`;
        
        // If you want to use the modal on hostels.html:
        window.location.href = `hostels.html?action=book&id=${hostelId}`;
    }
}

function viewHostelDetails(hostelId) {
    window.location.href = `hostel-details.html?id=${hostelId}`;
}

// CSS Injection for Animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .fade-in { animation: fadeIn 0.6s ease-out forwards; opacity: 0; }
`;
document.head.appendChild(style);
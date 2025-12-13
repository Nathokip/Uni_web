// Data
const founders = [
    {
        id: 1,
        name: "Symon Onoka",
        role: "CEO & Event planner",
        quote: "I coded our first prototype from a hostel system from a wreck system. That's where I realized how broken the hostel discovery process was.",
        bio: "Computer Science student in Dedan Kimathi University. Symon brings a remarkable experience in building scalable platforms. He oversees our technical architecture and product vision.",
        contribution: "Technical Architecture & Product Strategy",
        icon: "fas fa-code",
        color: "#2979ff",
        img: "images/symon.jpg"
    },
    {
        id: 2,
        name: "Nathan Kipyegon",
        role: "COO & Hostel Relations",
        quote: "A hostel isn't just accommodation—it's a community. Our job is to help students settle with ease.",
        bio: "Having served as a hostel captain, Nathan intimately understands hostel operations and guest experience design.",
        contribution: "Operations & Partnership Development",
        icon: "fas fa-hands-helping",
        color: "#4fc3f7"
    },
    {
        id: 3,
        name: "Bravin Oduor",
        role: "CCO & Community Builder",
        quote: "Settling is just at its best if the environment fits you well. We're just building more of those opportunities.",
        bio: "Social media blogger with a lot of knowledge of customer satisfaction. Bravo connects with modern backpackers and ensures our platform stays authentic to people",
        contribution: "Community Growth & Brand Voice",
        icon: "fas fa-users",
        color: "#bb86fc"
    }
];

const values = [
    {
        title: "Authenticity First",
        description: "We prioritize genuine experiences over students traps. Every hostel on our platform is vetted for its unique character and community vibe.",
        icon: "fas fa-heart",
        color: "#ff5252"
    },
    {
        title: "Community Driven",
        description: "We believe neighbourhood is better together. Our platform fosters connections between students and helps hostels build loyal communities.",
        icon: "fas fa-users",
        color: "#4fc3f7"
    },
    {
        title: "Transparency",
        description: "No hidden fees, no fake reviews. We provide clear information so students and can make informed decisions about their stays.",
        icon: "fas fa-eye",
        color: "#2979ff"
    },
    {
        title: "Sustainable ",
        description: "We promote eco-friendly hostels and encourage responsible travel practices that benefit local communities.",
        icon: "fas fa-leaf",
        color: "#00c853"
    },
    {
        title: "Innovation",
        description: "We constantly improve our platform based on user feedback, implementing cutting-edge features that enhance the hostel experience.",
        icon: "fas fa-rocket",
        color: "#ff9100"
    },
    {
        title: "Global Perspective",
        description: "Born from international friendships, we celebrate cultural exchange and make hostel travel accessible worldwide.",
        icon: "fas fa-globe-americas",
        color: "#651fff"
    }
];

const travelerFeatures = [
    {
        title: "Vibe-Based Search",
        description: "Filter hostels by atmosphere: party, quiet, digital nomad, eco-friendly, LGBTQ+ friendly, and more.",
        icon: "fas fa-search",
        color: "#2979ff"
    },
    {
        title: "Authentic Reviews",
        description: "Verified reviews from real students with photos and detailed feedback about the community vibe.",
        icon: "fas fa-star",
        color: "#ffd600"
    },
    {
        title: "Instant Booking",
        description: "Secure, hassle-free booking with real-time availability and instant confirmation.",
        icon: "fas fa-bolt",
        color: "#00c853"
    },
    {
        title: "Community Events",
        description: "See what events hostels are hosting during your stay—from pub crawls to cooking classes.",
        icon: "fas fa-calendar-alt",
        color: "#ff5252"
    },
    {
        title: "Digital Check-In",
        description: "Skip the front desk queue with our digital check-in system available at partner hostels.",
        icon: "fas fa-mobile-alt",
        color: "#651fff"
    },
    {
        title: "Student Community",
        description: "Connect with other students staying at the same hostel before you even arrive.",
        icon: "fas fa-comments",
        color: "#4fc3f7"
    }
];

const hostelFeatures = [
    {
        title: "Smart Management",
        description: "Intuitive dashboard to manage bookings, availability, and rates across all platforms.",
        icon: "fas fa-chart-line",
        color: "#2979ff"
    },
    {
        title: "Direct Communication",
        description: "Chat directly with guests before arrival to personalize their experience.",
        icon: "fas fa-comment-dots",
        color: "#00c853"
    },
    {
        title: "Marketing Tools",
        description: "Showcase your hostel's unique vibe with professional photos, videos, and event listings.",
        icon: "fas fa-bullhorn",
        color: "#ff9100"
    },
    {
        title: "Performance Analytics",
        description: "Detailed insights into your occupancy, revenue, and guest demographics.",
        icon: "fas fa-chart-pie",
        color: "#651fff"
    },
    {
        title: "Secure Payments",
        description: "Reliable, on-time payouts with transparent fees and multiple currency support.",
        icon: "fas fa-shield-alt",
        color: "#4caf50"
    },
    {
        title: "Community Building",
        description: "Tools to engage with past guests and build a loyal community.",
        icon: "fas fa-hands-helping",
        color: "#ff5252"
    }
];

// App State
let currentFounderIndex = 0;
let isGridView = false;
let activeTab = 'travelers';

// DOM Elements
const carouselTrack = document.getElementById('carousel-track');
const founderGrid = document.getElementById('founder-grid');
const founderCurrent = document.getElementById('founder-current');
const founderTotal = document.getElementById('founder-total');
const prevBtn = document.getElementById('prev-founder');
const nextBtn = document.getElementById('next-founder');
const toggleViewBtn = document.getElementById('toggle-view');
const valuesContainer = document.getElementById('values-container');
const travelerFeaturesContainer = document.getElementById('traveler-features');
const hostelFeaturesContainer = document.getElementById('hostel-features');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanes = document.querySelectorAll('.tab-pane');

// Initialize Application
document.addEventListener('DOMContentLoaded', function() {
    initFounderCarousel();
    renderValues();
    renderFeatures();
    setupEventListeners();
    updateCurrentYear();
    startCounterAnimations();
});

// Founder Carousel Functions
function initFounderCarousel() {
    founderTotal.textContent = founders.length;
    
    // Render carousel cards
    carouselTrack.innerHTML = founders.map(founder => `
        <div class="founder-card">
            <div class="founder-image" style="background: linear-gradient(135deg, ${founder.color}22, ${founder.color}44);">
                <div class="founder-avatar" style="background: ${founder.color}22; color: ${founder.color};">
                    <i class="${founder.icon}"></i>
                </div>
            </div>
            <div class="founder-info">
                <h3 class="founder-name">${founder.name}</h3>
                <div class="founder-role">${founder.role}</div>
                <p class="founder-quote">"${founder.quote}"</p>
                <p class="founder-bio">${founder.bio}</p>
                <div class="founder-contribution">
                    <div class="contribution-tag" style="background: ${founder.color}">
                        <i class="fas fa-trophy"></i> ${founder.contribution}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    // Render grid view
    founderGrid.innerHTML = founders.map(founder => `
        <div class="founder-card">
            <div class="founder-image" style="background: linear-gradient(135deg, ${founder.color}22, ${founder.color}44);">
                <div class="founder-avatar" style="background: ${founder.color}22; color: ${founder.color};">
                    <i class="${founder.icon}"></i>
                </div>
            </div>
            <div class="founder-info">
                <h3 class="founder-name">${founder.name}</h3>
                <div class="founder-role">${founder.role}</div>
                <p class="founder-quote">"${founder.quote}"</p>
                <div class="founder-contribution">
                    <div class="contribution-tag" style="background: ${founder.color}">
                        <i class="fas fa-trophy"></i> ${founder.contribution}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    updateCarouselPosition();
}

function updateCarouselPosition() {
    const cardWidth = document.querySelector('.founder-card').offsetWidth + 32; // width + gap
    carouselTrack.style.transform = `translateX(-${currentFounderIndex * cardWidth}px)`;
    founderCurrent.textContent = currentFounderIndex + 1;
}

function toggleView() {
    isGridView = !isGridView;
    
    if (isGridView) {
        carouselTrack.style.display = 'none';
        founderGrid.style.display = 'grid';
        toggleViewBtn.innerHTML = '<i class="fas fa-user"></i> Single View';
    } else {
        carouselTrack.style.display = 'flex';
        founderGrid.style.display = 'none';
        toggleViewBtn.innerHTML = '<i class="fas fa-th"></i> Grid View';
        updateCarouselPosition();
    }
}

// Render Values
function renderValues() {
    valuesContainer.innerHTML = values.map(value => `
        <div class="value-card">
            <div class="value-icon" style="color: ${value.color}">
                <i class="${value.icon}"></i>
            </div>
            <h3>${value.title}</h3>
            <p>${value.description}</p>
        </div>
    `).join('');
}

// Render Features
function renderFeatures() {
    // Traveler features
    travelerFeaturesContainer.innerHTML = travelerFeatures.map(feature => `
        <div class="feature-item">
            <div class="feature-icon" style="color: ${feature.color}">
                <i class="${feature.icon}"></i>
            </div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `).join('');
    
    // Hostel features
    hostelFeaturesContainer.innerHTML = hostelFeatures.map(feature => `
        <div class="feature-item">
            <div class="feature-icon" style="color: ${feature.color}">
                <i class="${feature.icon}"></i>
            </div>
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `).join('');
}

// Tab Switching
function switchTab(tabName) {
    activeTab = tabName;
    
    // Update tab buttons
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update tab panes
    tabPanes.forEach(pane => {
        if (pane.id === `${tabName}-tab`) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });
}

// Counter Animations
function startCounterAnimations() {
    const counters = {
        'hostel-count': 1200,
        'traveler-count': 85000,
        'country-count': 64
    };
    
    Object.keys(counters).forEach(id => {
        const element = document.getElementById(id);
        const target = counters[id];
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target.toLocaleString() + '+';
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current).toLocaleString() + '+';
            }
        }, 30);
    });
}

// Update Current Year
function updateCurrentYear() {
    document.getElementById('current-year').textContent = new Date().getFullYear();
}

// Event Listeners
function setupEventListeners() {
    // Founder navigation
    prevBtn.addEventListener('click', () => {
        currentFounderIndex = (currentFounderIndex - 1 + founders.length) % founders.length;
        updateCarouselPosition();
    });
    
    nextBtn.addEventListener('click', () => {
        currentFounderIndex = (currentFounderIndex + 1) % founders.length;
        updateCarouselPosition();
    });
    
    // View toggle
    toggleViewBtn.addEventListener('click', toggleView);
    
    // Tab switching
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchTab(btn.dataset.tab);
        });
    });
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Keyboard navigation for founders
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Auto-advance carousel
setInterval(() => {
    if (!isGridView) {
        currentFounderIndex = (currentFounderIndex + 1) % founders.length;
        updateCarouselPosition();
    }
}, 5000);

// Export for debugging
window.HostelHubAbout = {
    founders,
    values,
    travelerFeatures,
    hostelFeatures,
    currentFounderIndex,
    isGridView,
    activeTab
};
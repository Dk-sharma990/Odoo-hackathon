// app.js - SPA Logic and Component Loader

let currentUser = null;
let activeTripId = null;
const API_URL = 'http://localhost:3000/api';
const components = {
    'header': 'components/header.html',
    'login': 'components/login.html',
    'dashboard': 'components/dashboard.html',
    'search-results': 'components/search-results.html',
    'create-trip': 'components/create-trip.html',
    'my-trips': 'components/my-trips.html',
    'itinerary-builder': 'components/itinerary-builder.html',
    'itinerary-view': 'components/itinerary-view.html',
    'city-search': 'components/city-search.html',
    'budget': 'components/budget.html',
    'checklist': 'components/checklist.html',
    'public-itinerary': 'components/public-itinerary.html',
    'profile': 'components/profile.html',
    'notes': 'components/notes.html',
    'admin': 'components/admin.html',
    'about': 'components/about.html',
    'modal-add-stop': 'components/modal-add-stop.html',
    'booking': 'components/booking.html',
    'destination-details': 'components/destination-details.html',
    'experiences': 'components/experiences.html'
};

const mockDestinations = {
    'jaipur': {
        name: 'Jaipur, India',
        desc: 'The Pink City, known for its royal heritage and vibrant culture.',
        image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'Hawa Mahal', price: '₹50 (Indian) / ₹200 (Foreigner)', icon: 'fa-archway' },
            { name: 'Amer Fort', price: '₹100 (Indian) / ₹500 (Foreigner)', icon: 'fa-chess-rook' },
            { name: 'City Palace', price: '₹200 (Indian) / ₹500 (Foreigner)', icon: 'fa-chess-king' },
            { name: 'Jantar Mantar', price: '₹50 (Indian) / ₹200 (Foreigner)', icon: 'fa-compass' }
        ]
    },
    'paris': {
        name: 'Paris, France',
        desc: 'The city of light, famous for the Eiffel Tower, art, and gastronomy.',
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'Eiffel Tower', price: '€28', icon: 'fa-monument' },
            { name: 'Louvre Museum', price: '€17', icon: 'fa-palette' },
            { name: 'Palace of Versailles', price: '€19.50', icon: 'fa-chess-king' }
        ]
    },
    'newyork': {
        name: 'New York, USA',
        desc: 'The Big Apple, a global hub of culture, fashion, and finance.',
        image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'Statue of Liberty', price: '$24.50', icon: 'fa-monument' },
            { name: 'Empire State Building', price: '$44', icon: 'fa-building' },
            { name: 'Central Park', price: 'Free', icon: 'fa-tree' }
        ]
    },
    'tokyo': {
        name: 'Tokyo, Japan',
        desc: 'A bustling metropolis combining the ultramodern and the traditional.',
        image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'Tokyo Tower', price: '¥1200', icon: 'fa-tower-broadcast' },
            { name: 'Sensō-ji Temple', price: 'Free', icon: 'fa-vihara' },
            { name: 'Shibuya Crossing', price: 'Free', icon: 'fa-street-view' }
        ]
    },
    'bali': {
        name: 'Bali, Indonesia',
        desc: 'An Indonesian island known for its forested volcanic mountains and beaches.',
        image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'Uluwatu Temple', price: '50,000 IDR', icon: 'fa-vihara' },
            { name: 'Sacred Monkey Forest', price: '80,000 IDR', icon: 'fa-tree' },
            { name: 'Mount Batur Sunrise', price: '500,000 IDR', icon: 'fa-mountain' }
        ]
    },
    'rome': {
        name: 'Rome, Italy',
        desc: 'The capital of Italy, featuring nearly 3,000 years of globally influential art and architecture.',
        image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'Colosseum', price: '€16', icon: 'fa-monument' },
            { name: 'Vatican Museums', price: '€17', icon: 'fa-building-columns' },
            { name: 'Pantheon', price: 'Free (Weekdays)', icon: 'fa-landmark-dome' }
        ]
    },
    'dubai': {
        name: 'Dubai, UAE',
        desc: 'A city of skyscrapers, luxury shopping, and ultramodern architecture.',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'Burj Khalifa', price: '169 AED', icon: 'fa-building' },
            { name: 'Dubai Mall', price: 'Free', icon: 'fa-bag-shopping' },
            { name: 'Desert Safari', price: '200 AED', icon: 'fa-car' }
        ]
    },
    'london': {
        name: 'London, UK',
        desc: 'The capital of England and the United Kingdom, a 21st-century city with history stretching back to Roman times.',
        image: 'https://images.unsplash.com/photo-1520986606214-8b456906c813?auto=format&fit=crop&w=1920&q=80',
        places: [
            { name: 'London Eye', price: '£30', icon: 'fa-eye' },
            { name: 'Tower of London', price: '£33.60', icon: 'fa-chess-rook' },
            { name: 'British Museum', price: 'Free', icon: 'fa-building-columns' }
        ]
    }
};

async function loadComponent(name, targetId) {
    try {
        const response = await fetch(components[name]);
        if (!response.ok) throw new Error(`Failed to load ${name}`);
        const html = await response.text();
        document.getElementById(targetId).innerHTML = html;
        bindEvents(name);
    } catch (err) {
        console.error(err);
    }
}

async function initApp() {
    // Load top navigation into app-container
    const headerContainer = document.createElement('div');
    headerContainer.id = 'header-container';
    document.getElementById('app-container').prepend(headerContainer);
    await loadComponent('header', 'header-container');

    // Load all views into main-content
    const mainContent = document.getElementById('main-content');
    
    // We can pre-load all of them or load on demand. 
    // For simplicity given the vanilla nature, we will pre-load containers.
    const viewsToLoad = [
        'login', 'dashboard', 'search-results', 'create-trip', 'my-trips',
        'itinerary-builder', 'itinerary-view', 'city-search', 'budget',
        'checklist', 'public-itinerary', 'profile', 'notes', 'admin', 'about',
        'booking', 'destination-details', 'experiences'
    ];

    for (let view of viewsToLoad) {
        const section = document.createElement('section');
        section.id = `view-${view}`;
        section.className = 'view';
        if (view === 'login') section.classList.add('active'); // Default active view
        mainContent.appendChild(section);
        await loadComponent(view, `view-${view}`);
    }

    // Load modals
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    document.body.appendChild(modalContainer);
    await loadComponent('modal-add-stop', 'modal-container');
    
    // Initial bindings
    setupGlobalBindings();
}

function navigateTo(viewName) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    const target = document.getElementById(`view-${viewName}`);
    if (target) {
        target.classList.add('active');
        if (viewName === 'dashboard' && window.myMap) {
            setTimeout(() => {
                window.myMap.invalidateSize();
            }, 100);
        }
    }
}

function bindEvents(componentName) {
    // Reattach event listeners dynamically based on component loaded
    const container = document.getElementById(`view-${componentName}`) || document.getElementById('header-container') || document.getElementById('modal-container');
    
    // Remove old inline onclicks and add event listeners
    if (componentName === 'header') {
        const planTripBtn = container.querySelector('button.btn-primary.btn-pill');
        if (planTripBtn) planTripBtn.addEventListener('click', () => navigateTo('create-trip'));
        
        container.querySelectorAll('li[data-target]').forEach(li => {
            li.addEventListener('click', (e) => {
                navigateTo(e.target.getAttribute('data-target'));
            });
        });
    }
    
    if (componentName === 'login') {
        let authMode = 'login'; // 'login', 'signup', 'reset'
        
        const updateUI = () => {
            const nameGroup = document.getElementById('name-group');
            const submitBtn = document.getElementById('auth-submit-btn');
            const forgotLink = document.getElementById('forgot-password-link');
            const passLabel = document.getElementById('auth-password-label');
            const subtitle = document.getElementById('auth-subtitle');
            const switchContainer = document.getElementById('auth-switch-container');
            const backContainer = document.getElementById('back-to-login-container');
            
            if (authMode === 'login') {
                nameGroup.style.display = 'none';
                forgotLink.style.display = 'block';
                submitBtn.innerText = 'Login';
                passLabel.innerText = 'Password';
                subtitle.innerText = 'Plan, budget, and share your dream trips.';
                switchContainer.style.display = 'block';
                switchContainer.innerHTML = `Don't have an account? <span id="switch-auth-mode" style="color: #38bdf8; font-weight: 600; cursor: pointer;">Sign up</span>`;
                backContainer.style.display = 'none';
                
                document.getElementById('switch-auth-mode').addEventListener('click', () => { authMode = 'signup'; updateUI(); });
            } else if (authMode === 'signup') {
                nameGroup.style.display = 'block';
                forgotLink.style.display = 'none';
                submitBtn.innerText = 'Sign Up';
                passLabel.innerText = 'Password';
                subtitle.innerText = 'Create an account to get started.';
                switchContainer.style.display = 'block';
                switchContainer.innerHTML = `Already have an account? <span id="switch-auth-mode" style="color: #38bdf8; font-weight: 600; cursor: pointer;">Login</span>`;
                backContainer.style.display = 'none';
                
                document.getElementById('switch-auth-mode').addEventListener('click', () => { authMode = 'login'; updateUI(); });
            } else if (authMode === 'reset') {
                nameGroup.style.display = 'none';
                forgotLink.style.display = 'none';
                submitBtn.innerText = 'Reset Password';
                passLabel.innerText = 'New Password';
                subtitle.innerText = 'Enter your email and a new password.';
                switchContainer.style.display = 'none';
                backContainer.style.display = 'block';
            }
        };
        
        updateUI(); // Initial setup

        const forgotLink = document.getElementById('forgot-password-link');
        if (forgotLink) {
            forgotLink.addEventListener('click', (e) => {
                e.preventDefault();
                authMode = 'reset';
                updateUI();
            });
        }
        
        const backToLogin = document.getElementById('back-to-login');
        if (backToLogin) {
            backToLogin.addEventListener('click', () => {
                authMode = 'login';
                updateUI();
            });
        }

        const authForm = container.querySelector('#auth-form');
        if (authForm) {
            authForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = document.getElementById('auth-email').value;
                const password = document.getElementById('auth-password').value;
                const name = document.getElementById('auth-name') ? document.getElementById('auth-name').value : '';
                
                if (authMode === 'reset') {
                    try {
                        const res = await fetch(`${API_URL}/reset-password`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ email, newPassword: password })
                        });
                        const data = await res.json();
                        if (res.ok) {
                            alert("Password reset successfully! You can now log in.");
                            authMode = 'login';
                            updateUI();
                            document.getElementById('auth-password').value = '';
                        } else {
                            alert(data.error);
                        }
                    } catch (err) {
                        console.error(err);
                        alert("Failed to connect to server");
                    }
                    return;
                }

                // Regular login/signup
                const endpoint = authMode === 'signup' ? `${API_URL}/signup` : `${API_URL}/login`;
                const body = authMode === 'signup' ? { name, email, password } : { email, password };
                
                try {
                    const res = await fetch(endpoint, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(body)
                    });
                    const data = await res.json();
                    if (res.ok) {
                        currentUser = data;
                        navigateTo('dashboard');
                    } else {
                        alert(data.error);
                    }
                } catch (err) {
                    console.error(err);
                    alert("Failed to connect to server");
                }
            });
        }
    }

    if (componentName === 'create-trip') {
        const createForm = container.querySelector('#create-trip-form');
        if (createForm) {
            createForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!currentUser) return alert("Please log in first.");
                
                const type = document.querySelector('input[name="trip-type"]:checked').value;
                const name = document.getElementById('trip-name').value;
                const start = document.getElementById('trip-start').value;
                const end = document.getElementById('trip-end').value;
                const desc = document.getElementById('trip-desc').value;
                
                try {
                    const res = await fetch(`${API_URL}/trips`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ user_id: currentUser.id, trip_type: type, name, start_date: start, end_date: end, description: desc })
                    });
                    if (res.ok) {
                        const data = await res.json();
                        activeTripId = data.id;
                        alert("Trip created! Let's explore places to add to your itinerary.");
                        navigateTo('city-search');
                    } else {
                        alert("Failed to create trip");
                    }
                } catch (err) {
                    console.error(err);
                }
            });
        }
    }

    if (componentName === 'my-trips') {
        if(window.loadMyTrips) window.loadMyTrips();
    }

    if (componentName === 'city-search') {
        const results = document.getElementById('city-results');
        if (results) {
            results.innerHTML = '';
            for (const [key, data] of Object.entries(mockDestinations)) {
                results.innerHTML += `
                    <div class="swipe-card" style="background-image: url('${data.image}'); cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="openDestinationDetails('${key}')">
                        <div class="card-overlay">
                            <h3>${data.name}</h3>
                            <button class="btn-primary btn-small mt-2" onclick="event.stopPropagation(); openDestinationDetails('${key}')"><i class="fa-solid fa-eye"></i> View Details</button>
                        </div>
                    </div>
                `;
            }
        }
    }

    if (componentName === 'dashboard') {
        initMap();
    }
    
    // Navigation back buttons
    container.querySelectorAll('.btn-back').forEach(btn => {
        // Look at inline onclick to determine where to go, or set a generic back
        const onclickAttr = btn.getAttribute('onclick');
        if (onclickAttr) {
            btn.removeAttribute('onclick');
            const target = onclickAttr.match(/'([^']+)'/)[1];
            btn.addEventListener('click', () => navigateTo(target));
        }
    });

    // We can add other specific bindings here as needed.
}

function setupGlobalBindings() {
    // Add global functions if called from within components that haven't been decoupled yet
    window.navigateTo = navigateTo;
    
    window.loadBudget = async () => {
        const container = document.getElementById('budget-items-container');
        const totalEl = document.getElementById('total-budget');
        if (!container || !totalEl) return;

        if (!activeTripId) {
            container.innerHTML = '<p class="text-muted">No active trip selected. Create a trip first.</p>';
            totalEl.innerText = '0';
            return;
        }

        try {
            const res = await fetch(`${API_URL}/trip-places/${activeTripId}`);
            const places = await res.json();
            
            container.innerHTML = '';
            let total = 0;

            if (places.length === 0) {
                container.innerHTML = '<p class="text-muted">No places added to this trip yet.</p>';
            } else {
                places.forEach(p => {
                    let cost = 0;
                    const match = p.price.match(/\d+/);
                    if (match) {
                        cost = parseInt(match[0], 10);
                        total += cost;
                    }
                    
                    container.innerHTML += `
                        <div class="flex-between" style="border-bottom: 1px solid rgba(255,255,255,0.1); padding: 0.8rem 0;">
                            <span><i class="fa-solid fa-check text-primary"></i> ${p.place_name}</span>
                            <span style="font-weight: 600;">${p.price}</span>
                        </div>
                    `;
                });
            }
            totalEl.innerText = `${total} Units`;
        } catch(err) {
            console.error(err);
        }
    };

    window.viewTripBudget = () => {
        if(window.loadBudget) window.loadBudget();
        navigateTo('budget');
    };
    window.viewChecklist = () => navigateTo('checklist');
    window.viewNotes = () => navigateTo('notes');
    window.viewItinerary = () => navigateTo('itinerary-view');
    window.showAddStopModal = () => document.getElementById('modal-add-stop-el').style.display = 'block';
    window.closeModal = (id) => document.getElementById(id).style.display = 'none';
    window.shareTrip = () => alert("Sharing trip...");
    window.saveNote = () => alert("Note saved!");

    window.addPlaceToTrip = async (placeName, price) => {
        if (!activeTripId) {
            alert("You need to create an active trip first to add places to it.");
            navigateTo('create-trip');
            return;
        }
        try {
            const res = await fetch(`${API_URL}/trip-places`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ trip_id: activeTripId, place_name: placeName, price: price })
            });
            if (res.ok) {
                alert(`Successfully added ${placeName} to your trip!`);
            } else {
                alert("Failed to add place.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    window.loadMyTrips = async () => {
        const container = document.getElementById('trips-container');
        if (!container) return;
        
        if (!currentUser) {
            container.innerHTML = '<p class="text-muted">Please log in to see your trips.</p>';
            return;
        }
        
        try {
            const res = await fetch(`${API_URL}/trips?user_id=${currentUser.id}`);
            const trips = await res.json();
            container.innerHTML = '';
            
            if (trips.length === 0) {
                container.innerHTML = '<p class="text-muted">You have no trips planned yet. Click "New" to start!</p>';
                return;
            }
            
            trips.forEach(trip => {
                container.innerHTML += `
                    <div class="glass-panel" style="padding: 1.5rem; cursor: pointer; transition: transform 0.3s;" onmouseover="this.style.transform='scale(1.02)'" onmouseout="this.style.transform='scale(1)'" onclick="navigateTo('itinerary-view')">
                        <h3 class="text-primary" style="margin-bottom: 0.5rem;">${trip.name} <span class="premium-label" style="float:right; text-transform: capitalize;">${trip.trip_type}</span></h3>
                        <p class="text-small text-muted"><i class="fa-regular fa-calendar"></i> ${trip.start_date} to ${trip.end_date}</p>
                        <p class="mt-2" style="font-size: 0.95rem;">${trip.description}</p>
                    </div>
                `;
            });
        } catch (err) {
            console.error(err);
        }
    };

    window.switchBookingTab = (type) => {
        const tabs = document.querySelectorAll('.booking-tabs .tab-btn');
        tabs.forEach(t => {
            t.classList.remove('btn-primary');
            t.classList.add('btn-secondary');
        });
        const clicked = event.currentTarget;
        clicked.classList.remove('btn-secondary');
        clicked.classList.add('btn-primary');

        const title = document.getElementById('booking-form-title');
        const classGroup = document.getElementById('class-group');
        const fromGroup = document.getElementById('from-group');
        const toLabel = document.getElementById('to-label');
        const toInput = document.getElementById('to-input');
        
        if(type === 'flights') { 
            title.innerHTML = '<i class="fa-solid fa-plane"></i> Search Flights'; 
            classGroup.style.display = 'flex'; 
            fromGroup.style.display = 'flex';
            toLabel.innerText = 'To';
            toInput.placeholder = 'Destination City or Airport';
        }
        if(type === 'trains') { 
            title.innerHTML = '<i class="fa-solid fa-train"></i> Search Trains'; 
            classGroup.style.display = 'flex'; 
            fromGroup.style.display = 'flex';
            toLabel.innerText = 'To';
            toInput.placeholder = 'Destination City or Station';
        }
        if(type === 'buses') { 
            title.innerHTML = '<i class="fa-solid fa-bus"></i> Search Buses'; 
            classGroup.style.display = 'none'; 
            fromGroup.style.display = 'flex';
            toLabel.innerText = 'To';
            toInput.placeholder = 'Destination City';
        }
        if(type === 'hotels') { 
            title.innerHTML = '<i class="fa-solid fa-hotel"></i> Search Hotels'; 
            classGroup.style.display = 'none'; 
            fromGroup.style.display = 'none';
            toLabel.innerText = 'Destination';
            toInput.placeholder = 'City, Area, or Property Name';
        }
    };

    window.openDestinationDetails = (cityKey) => {
        const data = mockDestinations[cityKey];
        if(!data) return;

        document.getElementById('dest-hero').style.backgroundImage = `url('${data.image}')`;
        document.getElementById('dest-title').innerText = data.name;
        document.getElementById('dest-desc').innerText = data.desc;

        const placesContainer = document.getElementById('dest-places');
        placesContainer.innerHTML = '';
        data.places.forEach(place => {
            placesContainer.innerHTML += `
                <div class="glass-panel flex-between" style="background: rgba(255,255,255,0.08);">
                    <div>
                        <h3><i class="fa-solid ${place.icon} text-primary"></i> ${place.name}</h3>
                        <p class="mt-2 text-accent" style="font-weight:600;"><i class="fa-solid fa-ticket"></i> Entry: ${place.price}</p>
                    </div>
                    <button class="btn-primary btn-small" onclick="addPlaceToTrip('${place.name.replace(/'/g, "\\'")}', '${place.price}')"><i class="fa-solid fa-plus"></i> Add to Trip</button>
                </div>
            `;
        });
        
        navigateTo('destination-details');
    };
}

function initMap() {
    const mapContainer = document.getElementById('leaflet-map');
    if (mapContainer && !window.myMap && typeof L !== 'undefined') {
        // Create map centered on a global view
        const map = L.map('leaflet-map').setView([20, 0], 2);
        window.myMap = map;

        // Add a dark modern tile layer
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        // Highlight popular destinations
        const destinations = [
            { name: "Paris, France", coords: [48.8566, 2.3522], desc: "The city of light, famous for the Eiffel Tower and Louvre." },
            { name: "Tokyo, Japan", coords: [35.6762, 139.6503], desc: "A bustling metropolis combining the ultramodern and the traditional." },
            { name: "New York, USA", coords: [40.7128, -74.0060], desc: "The Big Apple, featuring Times Square and Central Park." },
            { name: "Bali, Indonesia", coords: [-8.4095, 115.1889], desc: "Island paradise known for its beaches, temples, and coral reefs." },
            { name: "Rome, Italy", coords: [41.9028, 12.4964], desc: "Historic capital famous for the Colosseum and Vatican City." }
        ];

        // Custom icon matching the dark theme
        const customIcon = L.divIcon({
            className: 'custom-map-marker',
            html: '<div style="background-color: #38bdf8; width: 14px; height: 14px; border-radius: 50%; box-shadow: 0 0 10px #38bdf8; border: 2px solid white;"></div>',
            iconSize: [14, 14],
            iconAnchor: [7, 7]
        });

        destinations.forEach(dest => {
            const marker = L.marker(dest.coords, { icon: customIcon }).addTo(map);
            marker.bindPopup(`<b style="color: #0f172a;">${dest.name}</b><br><span style="color: #333;">${dest.desc}</span>`);
        });
        
        // Ensure map resizes correctly
        setTimeout(() => {
            map.invalidateSize();
        }, 500);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

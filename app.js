document.addEventListener('DOMContentLoaded', () => {
    const reviewsGrid = document.getElementById('reviews-grid');
    const citySelect = document.getElementById('city-select');

    // State
    const DATA_CACHE = {}; // Cache for fetched city data
    let currentCityData = [];

    // Map Configuration
    const CITY_CONFIG = {
        madurai: {
            dataFile: 'data/madurai/mdy_data.json',
            coords: [9.9252, 78.1198]
        },
        coimbatore: {
            dataFile: 'data/coimbatore/cbe_data.json',
            coords: [11.0168, 76.9558]
        },
        chennai: {
            dataFile: 'data/chennai/chennai_data.json',
            coords: [13.0827, 80.2707]
        }
    };

    // Elements
    const searchInput = document.getElementById('search-input');
    const openNowFilter = document.getElementById('open-now-filter');

    // Map Initialization
    if (typeof L !== 'undefined') {
        try {
            // Re-assign global map variable
            map = L.map('map');
            markersLayer = L.layerGroup().addTo(map);
            initializeMap();
        } catch (error) {
            console.error("Map init failed:", error);
        }
    }

    // Initial Render
    initialize();

    // Event Listeners
    citySelect.addEventListener('change', async () => {
        const city = citySelect.value;
        const heroCity = document.getElementById('hero-city');

        // Update hero text
        heroCity.innerText = city.charAt(0).toUpperCase() + city.slice(1);

        // Update Map Center
        updateMapCenter(city);

        // Fetch and Render
        await loadCityData(city);
    });

    searchInput.addEventListener('input', applyFilters);
    openNowFilter.addEventListener('change', applyFilters);

    async function initialize() {
        // Load default city (Madurai)
        await loadCityData('madurai');
    }

    async function loadCityData(city) {
        if (DATA_CACHE[city]) {
            currentCityData = DATA_CACHE[city];
            applyFilters();
            return;
        }

        // Show Loading State
        reviewsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 4rem;">
                <i class="fa-solid fa-spinner fa-spin fa-2x" style="color: var(--primary-color);"></i>
                <p style="margin-top: 1rem; color: var(--text-light);">Finding best spots...</p>
            </div>
        `;

        try {
            const config = CITY_CONFIG[city];
            if (!config) throw new Error(`No config for city: ${city}`);

            const response = await fetch(config.dataFile);
            if (!response.ok) throw new Error('Failed to load data');

            const data = await response.json();
            DATA_CACHE[city] = data;
            currentCityData = data;

            applyFilters();
        } catch (error) {
            console.error("Data Load Error:", error);
            reviewsGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-light);">
                    <h3>Oops! Could not load data.</h3>
                    <p>Please make sure you are running a local server (e.g., live-server or http-server) to avoid CORS issues.</p>
                </div>
            `;
        }
    }

    function applyFilters() {
        const city = citySelect.value;
        let filteredReviews = currentCityData || [];
        const searchTerm = searchInput.value.toLowerCase();
        const isOpenNowChecked = openNowFilter.checked;

        // 1. Search Filter
        if (searchTerm) {
            filteredReviews = filteredReviews.filter(review => {
                const nameMatch = review.location_name.toLowerCase().includes(searchTerm);
                const categoryMatch = review.category.toLowerCase().includes(searchTerm);
                const menuMatch = review.menu_highlights.some(m => m.item.toLowerCase().includes(searchTerm));

                return nameMatch || categoryMatch || menuMatch;
            });
        }

        // 2. Open Now Filter
        if (isOpenNowChecked) {
            filteredReviews = filteredReviews.filter(review => isOpen(review.operating_hours));
        }

        renderReviews(filteredReviews, reviewsGrid);
        updateMapMarkers(filteredReviews);
    }

    function initializeMap() {
        // Default to Madurai
        map.setView([9.9252, 78.1198], 13);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);
    }

    function updateMapCenter(city) {
        if (!map) return;
        const coords = {
            madurai: [9.9252, 78.1198],
            coimbatore: [11.0168, 76.9558],
            chennai: [13.0827, 80.2707]
        };

        if (coords[city]) {
            map.flyTo(coords[city], 13);
        }
    }

    // Update map markers when filtering
    function updateMapMarkers(reviews) {
        if (!markersLayer) return;
        markersLayer.clearLayers();

        reviews.forEach(review => {
            const lat = review.location_coordinates.lat;
            const lng = review.location_coordinates.lng;

            if (lat && lng) {
                const marker = L.marker([lat, lng]);

                // OWASP: Prevent XSS by escaping dynamic data
                const safeName = escapeHTML(review.location_name);
                const safeCategory = escapeHTML(review.category);
                const safeType = escapeHTML(review.business_type);

                const popupContent = `
                    <div class="popup-content">
                        <div class="popup-title">${safeName}</div>
                        <div class="popup-type">${safeCategory} • ${safeType}</div>
                        <a href="https://www.google.com/maps/search/?api=1&query=${lat},${lng}" target="_blank" class="popup-btn">
                            View on Google Maps <i class="fa-solid fa-arrow-right"></i>
                        </a>
                    </div>
                `;

                marker.bindPopup(popupContent);
                markersLayer.addLayer(marker);
            }
        });
    }

});

// ==========================================
// Helper Functions (Exported for Testing)
// ==========================================

function renderReviews(reviews, container) {
    if (!container) return; // Guard
    container.innerHTML = '';

    if (reviews.length === 0) {
        container.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 2rem; color: var(--text-light);">
                <h3>No spots found matching your criteria.</h3>
                <p>Try adjusting your search or filters.</p>
            </div>
        `;
        return;
    }

    reviews.forEach(review => {
        const card = createReviewCard(review);
        container.appendChild(card);
    });
}

function createReviewCard(review) {
    const div = document.createElement('div');
    div.className = 'review-card';

    // Determine category class for styling
    const categoryClass = `category-${review.category.toLowerCase().replace(/\s+/g, '-')}` || 'category-default';

    // Vlogger initials for avatar
    const vloggerInitials = review.social_proof.top_vlogger.split(' ').map(n => n[0]).join('').substring(0, 2);

    div.innerHTML = `
        <div class="card-header">
            <div class="card-top">
                <span class="category-badge ${categoryClass}">${escapeHTML(review.category)}</span>
                <div class="sentiment-badge">
                    <i class="fa-solid fa-star"></i>
                    <span>${review.social_proof.sentiment_score}</span>
                </div>
            </div>
            <h3 class="location-name">${escapeHTML(review.location_name)}</h3>
            <p class="business-type">${escapeHTML(review.business_type)}</p>
        </div>
        
        <div class="card-body">
            <div class="info-row">
                <i class="fa-regular fa-clock"></i>
                <span class="operating-hours">${review.operating_hours}</span>
            </div>
            
            <div class="menu-highlights">
                <span class="menu-title">Must Try</span>
                ${review.menu_highlights.map(item => `
                    <div class="menu-item">
                        <span>${escapeHTML(item.item)}</span>
                        <span class="menu-price">₹${item.price_estimate}</span>
                    </div>
                `).join('')}
            </div>

            <div class="social-proof">
                <div class="vlogger-info">
                    <div class="vlogger-avatar">${vloggerInitials}</div>
                    <span>${escapeHTML(review.social_proof.top_vlogger)}</span>
                </div>
                <p class="community-note">"${escapeHTML(review.social_proof.community_note)}"</p>
            </div>
        </div>

        <div class="card-footer">
            <a href="https://www.google.com/maps/search/?api=1&query=${review.location_coordinates.lat},${review.location_coordinates.lng}" 
                target="_blank" class="map-link">
                View Location <i class="fa-solid fa-arrow-right"></i>
            </a>
        </div>
    `;

    return div;
}

function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function isOpen(hoursString) {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const ranges = hoursString.split(/,\s*/);

    return ranges.some(range => {
        const [startStr, endStr] = range.split(/\s*-\s*/);
        if (!startStr || !endStr) return false;

        const start = parseTime(startStr);
        let end = parseTime(endStr);

        if (end < start) {
            end += 24 * 60;
            if (currentMinutes < end - 24 * 60) {
                return currentMinutes >= start || currentMinutes <= (end - 1440);
            }
        }

        return currentMinutes >= start && currentMinutes <= end;
    });
}

function parseTime(timeStr) {
    const [time, modifier] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier === 'PM' && hours < 12) hours += 12;
    if (modifier === 'AM' && hours === 12) hours = 0;

    return hours * 60 + minutes;
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isOpen,
        parseTime,
        escapeHTML,
        createReviewCard,
        renderReviews
    };
}



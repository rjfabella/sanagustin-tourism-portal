document.addEventListener('DOMContentLoaded', () => {
    // 1. Sticky Header
    const header = document.querySelector('header');
    
    // Check initial scroll position
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Navigation Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navUl = document.querySelector('nav ul');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navUl.classList.toggle('show');
        });
    }

    // 3. Scroll Animations (Intersection Observer)
    const fadeElements = document.querySelectorAll('.fade-in');

    const appearOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const appearOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target);
            }
        });
    }, appearOptions);

    fadeElements.forEach(element => {
        appearOnScroll.observe(element);
    });

    // 4. Tabs System for Learn More Page
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked
                btn.classList.add('active');
                
                // Show corresponding content
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(tabId).classList.add('active');
            });
        });
    }
    // 5. Initialize Leaflet Map (Locations Page)
    const mapContainer = document.getElementById('romblon-map');
    if (mapContainer) {
        // Set map background color to resemble water
        mapContainer.style.backgroundColor = '#aadaff';

        // Initialize map centered roughly on Romblon province
        const map = L.map('romblon-map', {
            zoomControl: true,
            minZoom: 9,
            maxZoom: 13
        }).setView([12.5516, 122.1287], 10);

        // Load GeoJSON data from the included script (romblonGeoJSON)
        if (typeof romblonGeoJSON !== 'undefined') {
            const geojson = L.geoJSON(romblonGeoJSON, {
                style: function (feature) {
                    return {
                        fillColor: '#4CAF50',
                        weight: 2,
                        opacity: 1,
                        color: 'white',
                        dashArray: '3',
                        fillOpacity: 0.8
                    };
                },
                onEachFeature: function (feature, layer) {
                    // Extract municipality name from properties
                    const name = feature.properties.NAME_3 || feature.properties.NAME_2 || feature.properties.name || "Municipality";
                    
                    layer.bindTooltip(`<b>${name}</b>`, {
                        permanent: false, 
                        direction: 'top',
                        className: 'map-tooltip'
                    });

                    // Add hover effects
                    layer.on({
                        mouseover: function(e) {
                            const layer = e.target;
                            layer.setStyle({
                                weight: 3,
                                color: '#666',
                                dashArray: '',
                                fillOpacity: 0.9,
                                fillColor: '#8BC34A' // Lighter green on hover
                            });
                            layer.bringToFront();
                        },
                        mouseout: function(e) {
                            geojson.resetStyle(e.target);
                        },
                        click: function(e) {
                            map.fitBounds(e.target.getBounds());
                        }
                    });
                }
            }).addTo(map);

            // Fit map to the bounds of the GeoJSON features
            map.fitBounds(geojson.getBounds());
        } else {
            console.error('GeoJSON data (romblonGeoJSON) is not defined.');
        }
    }
});

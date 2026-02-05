// =====================================================
// ATHLETIC GYM - INTERACTIVE JAVASCRIPT
// =====================================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all features
    initMobileMenu();
    initSmoothScroll();
    initScrollAnimations();
    initNavbarScroll();
    initFormValidation();
});

// =====================================================
// MOBILE MENU TOGGLE
// =====================================================

function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function () {
            navMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function (event) {
            const isClickInside = navMenu.contains(event.target) || mobileToggle.contains(event.target);
            if (!isClickInside && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }
        });
    }
}

// =====================================================
// SMOOTH SCROLLING & ACTIVE NAV LINKS
// =====================================================

function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Only handle internal links
            if (targetId.startsWith('#')) {
                e.preventDefault();
                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    const navbarHeight = document.getElementById('navbar').offsetHeight;
                    const targetPosition = targetSection.offsetTop - navbarHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Update active state
                    updateActiveNavLink(this);
                }
            }
        });
    });

    // Update active link on scroll
    window.addEventListener('scroll', debounce(updateActiveNavLinkOnScroll, 100));
}

function updateActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    activeLink.classList.add('active');
}

function updateActiveNavLinkOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navbarHeight = document.getElementById('navbar').offsetHeight;
    const scrollPosition = window.scrollY + navbarHeight + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) {
                updateActiveNavLink(activeLink);
            }
        }
    });
}

// =====================================================
// SCROLL ANIMATIONS (INTERSECTION OBSERVER)
// =====================================================

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: stop observing after reveal for performance
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements with reveal-on-scroll class
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    revealElements.forEach(element => {
        observer.observe(element);
    });
}

// =====================================================
// NAVBAR SCROLL EFFECT
// =====================================================

function initNavbarScroll() {
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', debounce(function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10));
}

// =====================================================
// FORM VALIDATION
// =====================================================

function initFormValidation() {
    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Get form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const plan = document.getElementById('plan').value;

            // Validate
            let isValid = true;
            let errorMessage = '';

            if (name.length < 2) {
                isValid = false;
                errorMessage += 'Por favor ingresa un nombre válido.\n';
            }

            if (!isValidEmail(email)) {
                isValid = false;
                errorMessage += 'Por favor ingresa un email válido.\n';
            }

            if (phone.length < 7) {
                isValid = false;
                errorMessage += 'Por favor ingresa un teléfono válido.\n';
            }

            if (!plan) {
                isValid = false;
                errorMessage += 'Por favor selecciona un plan.\n';
            }

            if (isValid) {
                // Show success message
                showFormMessage('success', '¡Gracias! Te estamos redirigiendo a WhatsApp...');

                // Creates WhatsApp Message
                const message = `Hola Athletic Gym, mi nombre es ${name}. Me interesa el ${plan} (Plan Básico/Premium/Elite). ${document.getElementById('message').value}`;
                const encodedMessage = encodeURIComponent(message);
                const whatsappUrl = `https://wa.me/593969476858?text=${encodedMessage}`;

                // Redirect after short delay
                setTimeout(() => {
                    window.open(whatsappUrl, '_blank');
                    contactForm.reset();
                }, 1500);

            } else {
                // Show error message
                showFormMessage('error', errorMessage);
            }
        });
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showFormMessage(type, message) {
    // Remove existing message if any
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message form-message-${type}`;
    // Inline styles removed - moving to CSS class if needed or keeping simple
    messageDiv.style.cssText = `
        padding: 1rem 1.5rem;
        margin-top: 1rem;
        border-radius: 0.5rem;
        font-weight: 500;
        animation: slideDown 0.3s ease;
        ${type === 'success'
            ? 'background: #d1fae5; color: #065f46; border: 1px solid #6ee7b7;'
            : 'background: #fee2e2; color: #991b1b; border: 1px solid #fca5a5;'}
    `;
    messageDiv.textContent = message;

    // Insert after form
    const contactForm = document.getElementById('contactForm');
    contactForm.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => messageDiv.remove(), 300);
    }, 5000);
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================

// Debounce function to limit function calls
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// =====================================================
// LAZY LOADING IMAGES (Optional Enhancement)
// =====================================================

function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// =====================================================
// SCROLL TO TOP BUTTON (Optional)
// =====================================================

function initScrollToTop() {
    // Create button if it doesn't exist
    let scrollBtn = document.getElementById('scrollToTop');

    if (!scrollBtn) {
        scrollBtn = document.createElement('button');
        scrollBtn.id = 'scrollToTop';
        scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollBtn.setAttribute('aria-label', 'Scroll to top');
        // CSS is now in styles.css
        document.body.appendChild(scrollBtn);

        scrollBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Show/hide button on scroll
    window.addEventListener('scroll', debounce(() => {
        if (window.scrollY > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    }, 100));
}

// Initialize scroll to top button
initScrollToTop();

// =====================================================
// ANIMATIONS CSS (Removed - moved to styles.css)
// =====================================================

// =====================================================
// CONSOLE MESSAGE
// =====================================================

console.log('%c🏋️ Athletic Gym Website', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cTransformando vidas desde 2014', 'font-size: 14px; color: #764ba2;');

// =====================================================
// VIDEO GALLERY INTERACTION
// =====================================================

function toggleVideo(overlay) {
    const videoItem = overlay.parentElement;
    const video = videoItem.querySelector('video');

    // Hide overlay
    overlay.classList.add('hidden');

    // Play video
    video.play();
    video.controls = true;

    // Optional: Pause other videos
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(v => {
        if (v !== video) {
            v.pause();
            // Reset other overlays if needed, but keeping it simple for now
        }
    });

    // Show overlay again when video ends
    video.onended = function () {
        overlay.classList.remove('hidden');
        video.controls = false;
        video.load(); // Reset to poster
    };

    // Show overlay if paused manually (optional UX choice)
    /*
    video.onpause = function() {
        if (!video.seeking) {
            overlay.classList.remove('hidden');
            video.controls = false;
        }
    };
    */
}


// =====================================================
// BMI CALCULATOR LOGIC
// =====================================================

function initBMICalculator() {
    const bmiForm = document.getElementById('bmiForm');

    if (bmiForm) {
        bmiForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const weight = parseFloat(document.getElementById('weight').value);
            const heightCm = parseFloat(document.getElementById('height').value);

            if (weight > 0 && heightCm > 0) {
                // Calculate BMI
                const heightM = heightCm / 100;
                const bmi = weight / (heightM * heightM);
                const bmiRounded = bmi.toFixed(1);

                // Determine Category
                let category, message, statusClass, meterWidth, planLink;

                if (bmi < 18.5) {
                    category = "Bajo Peso";
                    statusClass = "underweight";
                    message = "Es importante ganar masa muscular y fuerza. Nuestro <strong>Plan de Hipertrofia</strong> en la Zona de Pesas es ideal para ti.";
                    meterWidth = "20%";
                    planLink = "trimestral";
                } else if (bmi >= 18.5 && bmi < 24.9) {
                    category = "Peso Normal";
                    statusClass = "normal";
                    message = "¡Estás en un excelente estado! Mantén tu salud con nuestro <strong>CrossFit & Entrenamiento Funcional</strong>.";
                    meterWidth = "50%";
                    planLink = "semestral";
                } else if (bmi >= 25 && bmi < 29.9) {
                    category = "Sobrepeso";
                    statusClass = "overweight";
                    message = "Podemos ayudarte a transformar esa energía extra en músculo. ¡Prueba nuestras clases de <strong>Intense Cycling</strong>!";
                    meterWidth = "80%";
                    planLink = "anual";
                } else {
                    category = "Obesidad";
                    statusClass = "obese";
                    message = "Tu salud es lo primero. Nuestros entrenadores diseñarán un plan de <strong>pérdida de grasa seguro y efectivo</strong> para ti.";
                    meterWidth = "100%";
                    planLink = "anual";
                }

                // Update UI
                const resultSection = document.getElementById('bmiResult');
                const bmiValueEl = document.getElementById('bmiValue');
                const bmiStatusEl = document.getElementById('bmiStatus');
                const bmiMessageEl = document.getElementById('bmiMessage');
                const bmiMarker = document.getElementById('bmiMarker');

                // Reset classes
                bmiStatusEl.className = 'bmi-status';
                bmiStatusEl.classList.add(statusClass);

                bmiValueEl.textContent = bmiRounded;
                bmiStatusEl.textContent = category;
                bmiMessageEl.innerHTML = message;

                // Animate Marker Position (0% to 100% mapped to BMI 10 to 40)
                // Min BMI 14 (0%), Max BMI 40 (100%)
                let markerPos = ((bmi - 14) / (40 - 14)) * 100;
                if (markerPos < 0) markerPos = 0;
                if (markerPos > 100) markerPos = 100;

                bmiMarker.style.left = `${markerPos}%`;

                // Show Result
                resultSection.classList.remove('hidden');
            }
        });
    }
}

// Initialize BMI Logic
document.addEventListener('DOMContentLoaded', function () {
    initBMICalculator();
});

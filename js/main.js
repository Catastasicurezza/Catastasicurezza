// ===== MAIN.JS - Tutto il JavaScript del tuo sito =====

// Cache dei selettori DOM per performance
const navLinks = document.querySelector('.nav-links');
const header = document.querySelector('header');
const coursesOverlay = document.getElementById('coursesOverlay');

// Debounce function per limitare chiamate eccessive
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

// ===== INIZIALIZZAZIONE =====
document.addEventListener('DOMContentLoaded', function() {
    initSmoothScrolling();
    initIntersectionObserver();
    initEventListeners();
});

// ===== SMOOTH SCROLLING =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== MOBILE MENU =====
function toggleMobileMenu() {
    navLinks.classList.toggle('mobile-active');
}

// ===== NAVIGATION =====
function scrollToContact() {
    document.querySelector('#contact').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// ===== MODAL FUNCTIONS =====
function openCoursesModal() {
    coursesOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCoursesModal() {
    coursesOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openCoursesModalAndExpand(courseId) {
    openCoursesModal();
    
    // Usa requestAnimationFrame per animazioni smooth
    requestAnimationFrame(() => {
        const courseElement = document.getElementById(courseId);
        if (courseElement) {
            // Chiudi altri corsi
            document.querySelectorAll('.course-item.active').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.course-toggle').textContent = '+';
            });
            
            // Apri corso specifico
            courseElement.classList.add('active');
            courseElement.querySelector('.course-toggle').textContent = '×';
            
            // Scroll ottimizzato
            setTimeout(() => {
                courseElement.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start'
                });
            }, 100);
        }
    });
}

// ===== COURSE TOGGLE =====
function toggleCourse(courseItem) {
    if (event.target.classList.contains('course-request-info')) return;
    
    const isActive = courseItem.classList.contains('active');
    const toggle = courseItem.querySelector('.course-toggle');
    
    // Chiudi tutti gli altri
    document.querySelectorAll('.course-item.active').forEach(item => {
        if (item !== courseItem) {
            item.classList.remove('active');
            item.querySelector('.course-toggle').textContent = '+';
        }
    });
    
    // Toggle corrente
    if (!isActive) {
        courseItem.classList.add('active');
        toggle.textContent = '×';
    } else {
        courseItem.classList.remove('active');
        toggle.textContent = '+';
    }
}

// ===== NOTIFICHE OTTIMIZZATE - Sostituisci nel main.js =====

function showSuccessMessage(message) {
    createToast(message, 'success');
}

function showErrorMessage(message) {
    createToast(message, 'error');
}

function createToast(message, type) {
    // Rimuovi toast esistenti dello stesso tipo
    const existingToasts = document.querySelectorAll(`.toast-${type}`);
    existingToasts.forEach(toast => toast.remove());
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✅' : '⚠️'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Animazione entrata
    setTimeout(() => toast.classList.add('show'), 10);
    
    // Auto-remove dopo 4 secondi
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 4000);
    
    // Click per chiudere
    toast.addEventListener('click', () => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    });
}

// ===== FUNZIONE HANDLESUBMIT PULITA =====
async function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('.submit-btn');
    
    // ⚠️ SOSTITUISCI CON LA TUA CHIAVE VERA ⚠️
    formData.append("access_key", "bf0d33b6-e48d-4211-b01f-c9ae1b57dea9");
    
    // Campi per personalizzazione email
    formData.append("subject", "Nuova richiesta da Catasta Sicurezza");
    formData.append("from_name", "Sito Catasta Sicurezza");
    
    // Loading state
    const originalText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Invio...';
    submitBtn.style.opacity = '0.7';
    
    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            body: formData
        });
        
        const data = await response.json();
        
        // Debug temporaneo - rimuovi dopo che funziona
        console.log('Response:', data);
        
        if (data.success) {
            showSuccessMessage('Messaggio inviato! Ti risponderemo presto.');
            form.reset();
        } else {
            // Mostra l'errore specifico per debug
            console.error('Web3Forms error:', data.message);
            showErrorMessage('Errore: ' + (data.message || 'Riprova o usa WhatsApp.'));
        }
    } catch (error) {
        console.error('Network error:', error);
        showErrorMessage('Problema di connessione. Riprova tra poco.');
    } finally {
        // Ripristina pulsante
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        submitBtn.style.opacity = '1';
    }
}

// ===== SCROLL EFFECTS =====
const debouncedScroll = debounce(function() {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
    } else {
        header.style.background = 'var(--white)';
        header.style.backdropFilter = 'none';
    }
}, 10);

// ===== INTERSECTION OBSERVER per animazioni =====
function initIntersectionObserver() {
    if (!window.IntersectionObserver) return;
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing dopo animazione
            }
        });
    }, observerOptions);

    // Osserva elementi per animazioni
    const elementsToAnimate = document.querySelectorAll('.service-card, .course-compact-card');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        observer.observe(el);
    });
}

// ===== EVENT LISTENERS =====
function initEventListeners() {
    // Scroll event con debounce
    window.addEventListener('scroll', debouncedScroll, { passive: true });
    
    // Mobile menu
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
    
    // Modal close events
    if (coursesOverlay) {
        coursesOverlay.addEventListener('click', function(e) {
            if (e.target === this) closeCoursesModal();
        });
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeCoursesModal();
    });
}

// ===== UTILITY FUNCTIONS =====

// Funzione per validare email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Funzione per validare telefono
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,}$/;
    return phoneRegex.test(phone);
}

// Funzione per mostrare notifiche (future)
function showNotification(message, type = 'success') {
    // TODO: Implementare sistema notifiche toast
    console.log(`${type.toUpperCase()}: ${message}`);
}

// ===== ANALYTICS (opzionale) =====
function trackEvent(eventName, properties = {}) {
    // TODO: Integrare con Google Analytics o altri
    console.log('Event tracked:', eventName, properties);
}

// ===== PERFORMANCE MONITORING =====
window.addEventListener('load', function() {
    // Log performance metrics
    const perfData = performance.getEntriesByType('navigation')[0];
    console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
});

// ===== PULSANTE TORNA SU =====

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Funzione per mostrare/nascondere il pulsante
function toggleBackToTopButton() {
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
}

// Aggiungi alle inizializzazioni esistenti
function initEventListeners() {
    // ... i tuoi event listeners esistenti ...
    
    // Scroll event per pulsante torna su
    window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
}

// Se non hai già initEventListeners, aggiungi questo:
document.addEventListener('DOMContentLoaded', function() {
    window.addEventListener('scroll', toggleBackToTopButton, { passive: true });
});

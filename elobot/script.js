document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const body = document.body;
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('nav-links');
    const themeBtns = document.querySelectorAll('.theme-btn');
    const backToTop = document.getElementById('back-to-top');
    const newsletterForm = document.getElementById('newsletter-form');
    const contactForm = document.getElementById('contact-form');
    
    // --- Theme Toggle ---
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
    }

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
        });
    });

    // --- Mobile Menu ---
    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);
    });
    // Close menu on link click
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // --- Back to Top ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    // --- Active Navigation Highlighting (Intersection Observer) ---
    const sections = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');
    
    const observerOptions = { rootMargin: '-50% 0px -50% 0px' };
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navAnchors.forEach(anchor => {
                    anchor.classList.remove('active');
                    if(anchor.getAttribute('href') === `#${id}`) {
                        anchor.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.channel-card, .review-card, .content-block, .stat-item, .section-hero, .about-grid, .creator-layout');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        revealObserver.observe(el);
    });

    // --- Review Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const reviewCards = document.querySelectorAll('.review-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            
            reviewCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    // Re-trigger fade in visual
                    card.style.opacity = '0';
                    setTimeout(() => { card.style.opacity = '1'; }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // --- Animated Counters (Stats) ---
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                const increment = target / 50; // speed
                let current = 0;

                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        stat.textContent = Math.ceil(current) + (stat.parentElement.querySelector('.stat-label').textContent.includes('K') ? 'K' : '+');
                        requestAnimationFrame(updateCounter);
                    } else {
                        stat.textContent = target + (stat.parentElement.querySelector('.stat-label').textContent.includes('K') ? 'K' : '+');
                    }
                };
                updateCounter();
            });
        }
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.about-stats');
    if(statsSection) counterObserver.observe(statsSection);

    // --- Newsletter Form Validation ---
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        const msgBox = document.getElementById('newsletter-msg');
        const email = emailInput.value;

        if (validateEmail(email)) {
            msgBox.style.color = '#9dff00';
            msgBox.textContent = 'Success! You are now subscribed.';
            emailInput.value = '';
        } else {
            msgBox.style.color = '#ff6b8b';
            msgBox.textContent = 'Please enter a valid email address.';
        }
    });

    // --- Contact Form Validation ---
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('c-name').value;
        const email = document.getElementById('c-email').value;
        const message = document.getElementById('c-message').value;
        const msgBox = document.getElementById('contact-msg');

        if (name && email && message && validateEmail(email)) {
            msgBox.style.color = '#9dff00';
            msgBox.textContent = 'Thank you! Your message has been sent. We will get back to you soon.';
            contactForm.reset();
        } else {
            msgBox.style.color = '#ff6b8b';
            msgBox.textContent = 'Please fill in all required fields with valid data.';
        }
    });

    // --- Helper Function for Email Validation ---
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
});
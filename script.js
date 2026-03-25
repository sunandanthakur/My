/* Minimalist & clean interactions */

document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if(hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        document.querySelectorAll('.nav-links li a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                if (hamburger.querySelector('i')) {
                    hamburger.querySelector('i').classList.add('fa-bars');
                    hamburger.querySelector('i').classList.remove('fa-times');
                }
            });
        });
    }

    // Scroll active link updates
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').includes(current) && current !== '') {
                item.classList.add('active');
            }
        });
    });

    // Fade-in on scroll (Apple-style smooth reveal)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in-section').forEach((el) => {
        observer.observe(el);
    });

    // Typing Effect for Hero Section
    const typeWords = ['build.', 'design.', 'innovate.', 'scale.'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingTextElement = document.querySelector('.typing-text');
    
    function typeEffect() {
        if (!typingTextElement) return;
        
        const currentWord = typeWords[wordIndex];
        
        if (isDeleting) {
            typingTextElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingTextElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
        }
        
        let typeSpeed = isDeleting ? 100 : 200;
        
        if (!isDeleting && charIndex === currentWord.length) {
            typeSpeed = 2000; // Pause at end of word
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % typeWords.length;
            typeSpeed = 500; // Pause before typing next word
        }
        
        setTimeout(typeEffect, typeSpeed);
    }
    
    if (typingTextElement) {
        // Init typing effect
        setTimeout(typeEffect, 1000);
    }

    // Modal logic
    const modal = document.getElementById('personal-info-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    // Check if the URL has the hash on load to open the modal
    if (window.location.hash === '#personal-info' && modal) {
        modal.classList.add('active');
    }
    
    // Add click listeners to logos
    document.querySelectorAll('.logo').forEach(logo => {
        logo.addEventListener('click', (e) => {
            // Only modal behavior on index.html
            const path = window.location.pathname;
            if (path.endsWith('index.html') || path === '/' || path.endsWith('/')) {
                e.preventDefault();
                if(modal) modal.classList.add('active');
                history.pushState(null, null, '#personal-info');
            }
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            history.pushState(null, null, window.location.pathname + window.location.search);
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                history.pushState(null, null, window.location.pathname + window.location.search);
            }
        });
    }

});

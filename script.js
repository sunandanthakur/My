/* Minimalist & clean interactions */

document.addEventListener('DOMContentLoaded', () => {

    // Split Hero Interaction (Opening Join Animation + Interactive Split)
    const splitHero = document.querySelector('.split-hero');
    const btfBase = document.querySelector('.btf-base');
    const btfTopImg = document.getElementById('btf-top-img');

    if (splitHero && btfBase && btfTopImg) {
        let isOpening = true;

        // Initial setup for animation
        btfBase.classList.add('preparing');
        btfTopImg.classList.add('preparing');

        // Start join animation after a short delay
        setTimeout(() => {
            btfBase.classList.remove('preparing');
            btfTopImg.classList.remove('preparing');
            btfBase.classList.add('joined');
            btfTopImg.classList.add('joined');
        }, 100);

        // Enable interaction after animation finishes
        setTimeout(() => {
            isOpening = false;
            // Remove transition from top image clip-path for instant mouse response
            btfTopImg.style.transition = 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease';
        }, 1400);

        splitHero.addEventListener('mousemove', (e) => {
            if (isOpening) return;

            const x = e.clientX;
            const btfContainer = btfTopImg.parentElement;
            const rect = btfContainer.getBoundingClientRect();
            
            let clipX = x - rect.left;
            
            if (clipX < 0) clipX = 0;
            if (clipX > rect.width) clipX = rect.width;

            // Get text elements for fading
            const textDesigner = document.getElementById('text-designer');
            const textCoder = document.getElementById('text-coder');

            // Normal butterfly (btf-top) reveals from 0 to clipX (Left side)
            btfTopImg.style.clipPath = `polygon(0 0, ${clipX}px 0, ${clipX}px 100%, 0 100%)`;

            // Slowly fade words based on split position
            // Normalized position (0 to 1)
            const p = clipX / rect.width;
            
            // If we move to the Left (Designer side), Coder should disappear.
            // When p = 0.5 (center), Coder opacity = 1. When p = 0.25 (on Designer word), Coder opacity = 0.
            let coderOpacity = (p - 0.25) / 0.25;
            if (coderOpacity < 0) coderOpacity = 0;
            if (coderOpacity > 1) coderOpacity = 1;

            // If we move to the Right (Coder side), Designer should disappear.
            // When p = 0.5 (center), Designer opacity = 1. When p = 0.75 (on Coder word), Designer opacity = 0.
            let designerOpacity = (0.75 - p) / 0.25;
            if (designerOpacity < 0) designerOpacity = 0;
            if (designerOpacity > 1) designerOpacity = 1;

            if (textDesigner) textDesigner.style.opacity = designerOpacity;
            if (textCoder) textCoder.style.opacity = coderOpacity;
        });

        // Reset to center on leaving the hero
        splitHero.addEventListener('mouseleave', () => {
            if (isOpening) return;
            btfTopImg.classList.add('joined');
            btfTopImg.style.clipPath = ''; // Respect the 'joined' class clip-path
            
            const textDesigner = document.getElementById('text-designer');
            const textCoder = document.getElementById('text-coder');
            if (textDesigner) textDesigner.style.opacity = 1;
            if (textCoder) textCoder.style.opacity = 1;
        });
    }

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

    // Personal info modal
    const modal = document.getElementById('personal-info-modal');
    const closeBtn = document.querySelector('.close-modal');
    const aboutLinks = document.querySelectorAll('a[href="#personal-info"]');
    const isIndexPage = window.location.pathname.endsWith('index.html')
        || window.location.pathname === '/'
        || window.location.pathname.endsWith('/portfolio/');

    const openModal = () => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        history.replaceState(null, '', '#personal-info');
    };

    const closeModal = () => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
        history.replaceState(null, '', window.location.pathname + window.location.search);
    };

    if (isIndexPage && window.location.hash === '#personal-info') {
        openModal();
    }

    aboutLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            if (!isIndexPage) return;
            e.preventDefault();
            openModal();
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeModal();
        }
    });

    // Interactive hover cards for education page
    document.querySelectorAll('.cert-item, .timeline-node, .achievement-box').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const rotateY = ((x / rect.width) - 0.5) * 6;
            const rotateX = (0.5 - (y / rect.height)) * 5;

            card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
            card.style.setProperty('--spot-x', `${x}px`);
            card.style.setProperty('--spot-y', `${y}px`);
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.removeProperty('--spot-x');
            card.style.removeProperty('--spot-y');
        });
    });
});

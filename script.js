/* ===== Main JavaScript for Vignesh Kumar Portfolio ===== */

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initCursorGlow();
    initNavbar();
    initTypingEffect();
    initScrollAnimations();
    initCounterAnimation();
    initContactForm();
    initSmoothScroll();
});

/* ===== Particle Background ===== */
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.2) * 0.2;
            this.opacity = Math.random() * 0.12 + 0.03;
            this.hue = Math.random() > 0.5 ? 255 : 180; // purple or teal
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.hue === 255 ? '108, 92, 231' : '0, 206, 201'}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles
    const numParticles = Math.min(80, Math.floor(window.innerWidth / 20));
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle());
    }

    function drawLines() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(108, 92, 231, ${0.06 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLines();
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

/* ===== Cursor Glow ===== */
function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');

    if (window.matchMedia('(pointer: fine)').matches) {
        document.addEventListener('mousemove', (e) => {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        });
    } else {
        glow.style.display = 'none';
    }
}

/* ===== Navbar ===== */
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');
    const links = navLinks.querySelectorAll('.nav-link');

    // Scroll behavior
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile nav on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    function updateActiveLink() {
        let path = window.location.pathname.split('/').pop();
        if (path === '' || path === '/' || !path) {
            path = 'index.html';
        }
        links.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === path) {
                link.classList.add('active');
            }
        });
    }

    updateActiveLink();
}

/* ===== Typing Effect ===== */
function initTypingEffect() {
    const element = document.getElementById('typingText');
    if (!element) return;
    const roles = [
        'Embedded Systems Developer',
        'EV Innovator',
        'Mechatronics Engineer',
        'IoT Enthusiast',
        'PCB Designer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 80;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            element.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 40;
        } else {
            element.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 80;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            typingSpeed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next
        }

        setTimeout(type, typingSpeed);
    }

    type();
}

/* ===== Scroll Animations ===== */
function initScrollAnimations() {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        }
    );

    const animatedElements = document.querySelectorAll(
        '.section-header, .about-grid, .skill-category, .timeline-item, .project-card, .education-card, .award-card, .contact-grid'
    );

    animatedElements.forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.05}s`;
        observer.observe(el);
    });
}

/* ===== Counter Animation ===== */
function initCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    let animated = false;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !animated) {
                    animated = true;
                    counters.forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        animateCounter(counter, target);
                    });
                }
            });
        },
        { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        observer.observe(statsSection);
    }

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 40;
        const duration = 1500;
        const stepTime = duration / 40;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = Math.round(current);
        }, stepTime);
    }
}

/* ===== Contact Form ===== */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = form.querySelector('button[type="submit"]');
        const originalContent = btn.innerHTML;

        // Set button to sending state
        btn.innerHTML = '<span>Sending Message...</span><i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const name = document.getElementById('formName').value;
        const email = document.getElementById('formEmail').value;
        const subject = document.getElementById('formSubject').value;
        const message = document.getElementById('formMessage').value;

        // Free Access Key from web3forms.com
        const accessKey = "YOUR_ACCESS_KEY_HERE";

        if (accessKey === "YOUR_ACCESS_KEY_HERE") {
            // If the access key is not set, use the mailto fallback immediately
            sendMailtoFallback(name, email, subject, message, btn, originalContent);
            return;
        }

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    access_key: accessKey,
                    name: name,
                    email: email,
                    subject: `Portfolio Contact: ${subject}`,
                    message: `From: ${name} (${email})\nSubject: ${subject}\n\nMessage:\n${message}`,
                    replyto: email
                })
            });

            const result = await response.json();

            if (result.success) {
                btn.innerHTML = '<span>Message Sent!</span><i class="fas fa-check"></i>';
                btn.style.background = 'linear-gradient(135deg, #0d9488, #4f46e5)';
                form.reset();
            } else {
                throw new Error(result.message || "Failed to submit form");
            }
        } catch (error) {
            console.warn("API mail submission failed, falling back to mailto client:", error);
            sendMailtoFallback(name, email, subject, message, btn, originalContent);
        }

        setTimeout(() => {
            btn.innerHTML = originalContent;
            btn.style.background = '';
            btn.disabled = false;
        }, 3500);
    });
}

function sendMailtoFallback(name, email, subject, message, btn, originalContent) {
    const toEmail = "vignesh9585k@gmail.com";
    const bodyContent = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoUrl = `mailto:${toEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(bodyContent)}`;

    // Open system mail client
    window.location.href = mailtoUrl;

    btn.innerHTML = '<span>Opening Mail Client...</span><i class="fas fa-envelope-open"></i>';
    btn.style.background = 'var(--accent-warm)';
}

/* ===== Smooth Scroll ===== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.scrollY - offset;

                window.scrollTo({
                    top: position,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ===== Project Details & Modal System ===== */
const projectData = {
    railway: {
        title: "Railway Track Crack Detection System",
        category: "Embedded Systems",
        image: "images/railway-project.png",
        description: "An automated rover-type inspection system engineered to enhance railway safety by identifying cracks, structural bends, and alignment faults along railroad tracks in real-time.",
        objective: "To mitigate train derailments by automating track inspection using multiple sensor inputs and a portable autonomous vehicle.",
        features: [
            "Autonomous Track Navigation: Custom rover design built to sit and travel along standard track rails.",
            "Multi-Sensor Array: Ultrasonic sensors detect structural breaks, while infrared sensors map bends/misalignments.",
            "Real-Time Alerts: Instantly relays geographical coordinates and fault telemetry to nearest control station.",
            "Efficient Power Management: Built-in sleep and active cycles to maximize inspection run-times."
        ],
        tech: ["Embedded C", "Arduino/ESP32", "Ultrasonic & IR Sensors", "GPS Module", "GSM Module"],
        outcome: "Successfully demonstrated a fully working laboratory prototype capable of detection with 95% accuracy under simulated track faults."
    },
    leakage: {
        title: "Earth Leakage Detection System",
        category: "Smart India Hackathon",
        image: "images/earth-leakage-project.png",
        description: "A highly sensitive electrical safety system designed to detect low-level earth leakage currents and prevent hazardous electrical shocks in domestic and industrial environments.",
        objective: "To design a smart, real-time current sensor-based circuit breaker alternative that alerts operators before critical failure occurs.",
        features: [
            "Current Leakage Monitoring: Uses high-precision current transformers to measure imbalances between phase and neutral lines.",
            "Microcontroller Analysis: Continuous AD conversions to identify waveforms signaling insulation degradation.",
            "Wireless Notifications: IoT enabled interface showing system status on dashboard.",
            "Instant Trip Relay: High-speed solid-state relay trips power within milliseconds of exceeding safety thresholds."
        ],
        tech: ["Microcontrollers", "Current Sensors (CT)", "Relay Modules", "Wi-Fi Module (ESP8266)", "Blynk IoT Cloud"],
        outcome: "Earned national recognition as a finalist at the Smart India Hackathon 2024, demonstrating safety-critical response times under 30ms."
    }
};

function openProjectModal(projectId) {
    const data = projectData[projectId];
    if (!data) return;

    const modal = document.getElementById('projectModal');
    document.getElementById('modalImage').src = data.image;
    document.getElementById('modalImage').alt = data.title;
    document.getElementById('modalBadge').textContent = data.category;
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalObjective').textContent = data.objective;
    document.getElementById('modalOutcome').textContent = data.outcome;

    // Populate features
    const featuresList = document.getElementById('modalFeatures');
    featuresList.innerHTML = '';
    data.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresList.appendChild(li);
    });

    // Populate tech stack
    const techContainer = document.getElementById('modalTech');
    techContainer.innerHTML = '';
    data.tech.forEach(techItem => {
        const span = document.createElement('span');
        span.innerHTML = `<i class="fas fa-microchip"></i> ${techItem}`;
        techContainer.appendChild(span);
    });

    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Disable page scrolling
}

// Close Modal logic
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('modalClose');

    if (modal && closeBtn) {
        // Close on button click
        closeBtn.addEventListener('click', () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });

        // Close on overlay click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
});

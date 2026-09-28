/* ==========================================================================
   Dr. Siddhant Navik Portfolio Website - Premium Custom JS Logic
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Theme Switcher System
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    // Establish theme from local storage or user preference
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeToggle.checked = true;
        }
    } else {
        const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
        if (prefersDarkScheme.matches) {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeToggle.checked = true;
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            themeToggle.checked = false;
        }
    }

    // Listener for theme switch
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // 2. Sticky Header & Active Link Highlighting
    const navbar = document.querySelector('.navbar-custom');
    const backToTop = document.querySelector('.back-to-top');

    window.addEventListener('scroll', () => {
        // Sticky Header scroll trigger
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button scroll trigger
        if (window.scrollY > 600) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // Back to top smooth scrolling click event
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 3. Hero Text Typing Animation
    const typeTarget = document.getElementById('typed-text');
    if (typeTarget) {
        const words = [
            'Consultant Spine Surgeon',
            'Minimally Invasive Spine Specialist',
            'Endoscopic Spine Care Expert',
            'Fellow in Spine Surgery (FISS)',
            'Fellow in MIS Spine Surgery (FMISS)'
        ];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typeTarget.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Speed up deletion
            } else {
                typeTarget.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 150; // Regular typing speed
            }

            if (!isDeleting && charIndex === currentWord.length) {
                // Pause at complete word
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500; // Pause before next word starts typing
            }

            setTimeout(type, typeSpeed);
        }
        setTimeout(type, 1000);
    }

    // 3b. Timeline Dual-Tab Switcher
    const timelineTabBtns = document.querySelectorAll('.timeline-tab-btn');
    const timelinePanels = document.querySelectorAll('.timeline-panel');

    if (timelineTabBtns.length > 0) {
        timelineTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');

                timelineTabBtns.forEach(b => b.classList.remove('active'));
                timelinePanels.forEach(panel => panel.classList.remove('active'));

                btn.classList.add('active');
                const activePanel = document.getElementById(`panel-${targetTab}`);
                if (activePanel) {
                    activePanel.classList.add('active');
                }
            });
        });
    }

    // 4. Counter Up Animation for Stats
    const statsSection = document.getElementById('about');
    const counters = document.querySelectorAll('.hero-stats-num');
    let hasCounted = false;

    const runCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const rawText = counter.innerText;
                const hasPlus = rawText.includes('+');
                const count = +rawText.replace('+', '');
                
                // Calculate increment speed
                const speed = 100;
                const increment = Math.max(1, target / speed);

                if (count < target) {
                    counter.innerText = Math.ceil(count + increment) + (hasPlus ? '+' : '');
                    setTimeout(updateCount, 15);
                } else {
                    counter.innerText = target + (hasPlus ? '+' : '');
                }
            };
            updateCount();
        });
    };

    // Scroll trigger for counter animation
    const handleScrollCounter = () => {
        if (!statsSection) return;
        const rect = statsSection.getBoundingClientRect();
        const elemTop = rect.top;
        const elemBottom = rect.bottom;

        // Check if statsSection is visible in viewport
        if (elemTop < window.innerHeight && elemBottom >= 0 && !hasCounted) {
            hasCounted = true;
            runCounters();
            window.removeEventListener('scroll', handleScrollCounter);
        }
    };
    window.addEventListener('scroll', handleScrollCounter);
    // Trigger check immediately in case elements are already visible
    handleScrollCounter();

    // 5. Booking Form Validation & Submission
    const bookingForm = document.getElementById('booking-form');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Check HTML5 validation
            if (!bookingForm.checkValidity()) {
                e.stopPropagation();
                bookingForm.classList.add('was-validated');
                return;
            }

            // Custom validation checks
            const phoneInput = document.getElementById('bookPhone');
            const dateInput = document.getElementById('bookDate');
            let isValid = true;

            // Simple phone format validation
            const phonePattern = /^\+?[0-9\s-]{10,15}$/;
            if (!phonePattern.test(phoneInput.value)) {
                phoneInput.setCustomValidity('Please enter a valid phone number (minimum 10 digits).');
                isValid = false;
            } else {
                phoneInput.setCustomValidity('');
            }

            // Ensure booking date is not in the past
            const selectedDate = new Date(dateInput.value);
            const today = new Date();
            today.setHours(0,0,0,0);
            if (selectedDate < today) {
                dateInput.setCustomValidity('Appointment date cannot be in the past.');
                isValid = false;
            } else {
                dateInput.setCustomValidity('');
            }

            if (!isValid) {
                bookingForm.classList.add('was-validated');
                return;
            }

            // Form is valid - Extract values for WhatsApp
            const name = document.getElementById('bookName').value;
            const email = document.getElementById('bookEmail').value;
            const phone = document.getElementById('bookPhone').value;
            const locationEl = document.getElementById('bookLocation');
            const locationText = locationEl.options[locationEl.selectedIndex].text;
            const date = document.getElementById('bookDate').value;
            const timeEl = document.getElementById('bookTime');
            const timeText = timeEl.options[timeEl.selectedIndex].text;
            const notes = document.getElementById('bookNotes').value;

            // Format message for WhatsApp
            const wsMessage = `Hello Dr. Siddhant Navik,\n\nI would like to book a spine consultation appointment.\n\n*Patient Details:*\n• *Name:* ${name}\n• *Email:* ${email}\n• *Phone:* ${phone}\n• *Location:* ${locationText}\n• *Preferred Date:* ${date}\n• *Time Slot:* ${timeText}\n${notes ? `• *Chief Symptoms/Notes:* ${notes}\n` : ''}\nThank you!`;

            // Doctor's WhatsApp number
            const doctorWhatsappNum = '918668234393';
            const encodedText = encodeURIComponent(wsMessage);
            const whatsappApiUrl = `https://api.whatsapp.com/send?phone=${doctorWhatsappNum}&text=${encodedText}`;

            // Trigger success toast feedback
            showToastSuccess();

            // Redirect to WhatsApp after 1.5 seconds so the user sees the toast
            setTimeout(() => {
                window.open(whatsappApiUrl, '_blank');
            }, 1500);

            bookingForm.reset();
            bookingForm.classList.remove('was-validated');
        });
    }

    // 6. Interactive Toast Notification Function
    function showToastSuccess() {
        // Create toast elements
        const toastContainer = document.createElement('div');
        toastContainer.style.position = 'fixed';
        toastContainer.style.bottom = '30px';
        toastContainer.style.left = '30px';
        toastContainer.style.zIndex = '9999';
        
        const toast = document.createElement('div');
        toast.className = 'glass-panel p-4 d-flex align-items-center gap-3 animate-fade-in-up';
        toast.style.borderRadius = '16px';
        toast.style.borderLeft = '6px solid #25d366';
        toast.style.maxWidth = '380px';
        toast.style.boxShadow = '0 10px 45px rgba(0, 0, 0, 0.2)';
        
        toast.innerHTML = `
            <div style="font-size: 1.8rem; color: #25d366;">
                <i class="bi bi-whatsapp"></i>
            </div>
            <div>
                <h6 class="mb-1" style="font-weight: 700; color: var(--text-primary);">Opening WhatsApp...</h6>
                <p class="mb-0" style="font-size: 0.85rem; color: var(--text-secondary);">Redirecting to send your booking details directly to Dr. Siddhant Navik.</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        document.body.appendChild(toastContainer);
        
        // Remove toast after 5 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            toast.style.transition = 'all 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(toastContainer);
            }, 500);
        }, 5000);
    }

    // 7. Patient Video Review - Auto-hide overlay on native play
    ['review-video-1', 'review-video-2'].forEach(videoId => {
        const vid = document.getElementById(videoId);
        const overlayId = videoId.replace('video', 'overlay');
        const overlay = document.getElementById(overlayId);
        if (vid && overlay) {
            vid.addEventListener('play', () => overlay.classList.add('hidden'));
            vid.addEventListener('pause', () => overlay.classList.remove('hidden'));
            vid.addEventListener('ended', () => overlay.classList.remove('hidden'));
        }
    });
});

/**
 * Play a patient review video and hide its overlay.
 * Called from the inline onclick on the overlay play button.
 * @param {string} videoId   - ID of the <video> element
 * @param {string} overlayId - ID of the overlay <div>
 */
function playReviewVideo(videoId, overlayId) {
    const video = document.getElementById(videoId);
    const overlay = document.getElementById(overlayId);
    if (video && overlay) {
        overlay.classList.add('hidden');
        video.play();
    }
}

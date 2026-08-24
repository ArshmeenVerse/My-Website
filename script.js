/**
 * ARSHMEEN — PORTFOLIO INTERACTIONS & CONTROLS
 * Neo-Bento Interactive Engine
 * BS in Data Science & Applications • IIT Madras
 */

document.addEventListener('DOMContentLoaded', () => {
  initCustomCursor();
  initPhotoManager();
  initProjectFiltersAndModal();
  initSkillsPreview();
  initCopyEmail();
  initContactForm();
  initLoFiPlayer();
  initNavScrollSpy();
  initMobileMenu();
});

/* ==========================================================
   1. CUSTOM CURSOR
   ========================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('customCursor');
  const follower = document.getElementById('cursorFollower');

  if (!cursor || !follower) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let followerX = mouseX;
  let followerY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(renderFollower);
  }
  requestAnimationFrame(renderFollower);

  // Hover states on interactive elements
  const interactiveEls = document.querySelectorAll(
    'a, button, input, textarea, .bento-card, .tech-pill, .filter-pill, .social-pill-link, .sound-toggle-pill, .nav-resume-btn'
  );

  interactiveEls.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ==========================================================
   2. PHOTO CUSTOMIZER & LOCAL STORAGE PERSISTENCE
   ========================================================== */
function initPhotoManager() {
  const photoModal = document.getElementById('photoModal');
  const openModalBtn = document.getElementById('openPhotoModal');
  const openModalMobileBtn = document.getElementById('openPhotoModalMobile');
  const closeModalBtn = document.getElementById('closePhotoModal');
  const fileInput = document.getElementById('photoFileInput');
  const resetBtn = document.getElementById('resetDefaultPhoto');
  const heroImg = document.getElementById('heroProfileImg');
  const modalPreviewImg = document.getElementById('modalPreviewImg');
  const presetBtns = document.querySelectorAll('.preset-option');

  const STORAGE_KEY = 'arshmeen_custom_profile_photo';
  const DEFAULT_AVATAR = 'assets/profile.png';

  // Load saved photo from localStorage if exists (unless it was old svg default)
  let savedPhoto = localStorage.getItem(STORAGE_KEY);
  if (savedPhoto === 'assets/profile-art.svg') {
    localStorage.removeItem(STORAGE_KEY);
    savedPhoto = null;
  }
  if (savedPhoto && heroImg && modalPreviewImg) {
    heroImg.src = savedPhoto;
    modalPreviewImg.src = savedPhoto;
  }

  function openModal() {
    if (photoModal) photoModal.classList.add('active');
  }

  function closeModal() {
    if (photoModal) photoModal.classList.remove('active');
  }

  if (openModalBtn) openModalBtn.addEventListener('click', openModal);
  if (openModalMobileBtn) openModalMobileBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

  // Close on backdrop click
  if (photoModal) {
    photoModal.addEventListener('click', (e) => {
      if (e.target === photoModal) closeModal();
    });
  }

  // Handle local image file upload
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select a valid image file (PNG, JPG, WebP)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Img = event.target.result;
        if (heroImg) heroImg.src = base64Img;
        if (modalPreviewImg) modalPreviewImg.src = base64Img;
        
        try {
          localStorage.setItem(STORAGE_KEY, base64Img);
          showToast('✨ Photo updated & saved successfully!');
        } catch (err) {
          showToast('✨ Photo updated for this session!');
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Handle Preset Avatar Selection
  presetBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      presetBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const avatarType = btn.dataset.src;
      let targetSrc = DEFAULT_AVATAR;

      if (avatarType === 'avatar-yellow') {
        targetSrc = createColorAvatarSVG('#FFE500', '#AB92F9', 'A');
      } else if (avatarType === 'avatar-minimal') {
        targetSrc = createColorAvatarSVG('#111111', '#FAF7BF', 'A');
      }

      if (heroImg) heroImg.src = targetSrc;
      if (modalPreviewImg) modalPreviewImg.src = targetSrc;
      localStorage.setItem(STORAGE_KEY, targetSrc);
      showToast('Avatar theme applied!');
    });
  });

  // Reset to default
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      if (heroImg) heroImg.src = DEFAULT_AVATAR;
      if (modalPreviewImg) modalPreviewImg.src = DEFAULT_AVATAR;
      presetBtns.forEach((b, idx) => b.classList.toggle('active', idx === 0));
      showToast('Reset to default portrait.');
    });
  }
}

function createColorAvatarSVG(bg, fg, initial) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400">
    <rect width="400" height="400" fill="${bg}"/>
    <circle cx="200" cy="160" r="80" fill="${fg}" stroke="#111111" stroke-width="8"/>
    <path d="M70 360 C70 260, 330 260, 330 360" fill="${fg}" stroke="#111111" stroke-width="8"/>
    <text x="200" y="190" font-family="Plus Jakarta Sans, sans-serif" font-size="80" font-weight="bold" fill="#111111" text-anchor="middle">${initial}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* ==========================================================
   3. PROJECTS FILTER & CASE STUDY MODAL
   ========================================================== */
const PROJECT_DATABASE = {
  trekking: {
    title: 'Trekking Management Application',
    tag: 'Full-Stack Multi-Role Platform',
    year: '2026',
    client: 'Expedition & Adventure Logistics',
    desc: 'An end-to-end trekking management web application built with Python, Flask, Jinja2, SQLAlchemy, and Bootstrap 5. It features 3 distinct role-based dashboards tailored for Administrators, Staff/Guides, and Trekkers.',
    highlights: [
      '👑 Admin Dashboard: Centralized portal to schedule expeditions, assign mountain guides, manage participant manifests, and view booking analytics.',
      '🎒 Staff / Guide Dashboard: Allows tour leaders to view upcoming assigned treks, update live daily itinerary statuses, and log equipment inventories.',
      '🥾 Trekker Portal: Seamless user experience for explorers to search scenic trails, book trips, download packing checklists, and view schedule updates.',
      'Data Integrity: Built using SQLAlchemy ORM with relational schema handling users, treks, bookings, and payments.',
      'Clean UI: Styled with Bootstrap 5 and customized modern responsive CSS for flawless mobile and desktop experience.'
    ],
    tech: ['Python', 'Flask', 'Jinja2', 'SQLAlchemy', 'Bootstrap 5', 'HTML5', 'CSS3', 'SQLite / PostgreSQL'],
    liveUrl: '#',
    githubUrl: 'https://github.com/ArshmeenVerse'
  },
  aianalytics: {
    title: 'AI Predictive Analytics Hub',
    tag: 'Machine Learning & Web App',
    year: '2026',
    client: 'Data Science Innovation',
    desc: 'An intelligent analytical web application that bridges machine learning predictive models with interactive data visualization dashboards for real-time trend forecasting.',
    highlights: [
      'Engineered data processing pipelines using Pandas, NumPy, and Scikit-Learn',
      'REST API backend built in Python to serve instant ML inference queries',
      'Dynamic charts and statistical distribution views for actionable insights'
    ],
    tech: ['Python', 'Scikit-Learn', 'Pandas', 'Flask API', 'Chart.js', 'Bootstrap'],
    liveUrl: '#',
    githubUrl: 'https://github.com/ArshmeenVerse'
  },
  minthackathon: {
    title: 'Mint Hackathon Finalist Prototype',
    tag: 'Top 20 Finalist Build',
    year: '2026',
    client: 'Mint Hackathon (1,000+ Participants)',
    desc: 'An award-winning rapid prototype built during the prestigious Mint Hackathon, ranking in the Top 20 out of over 1,000 student developers nationwide for architectural speed and polished user flow.',
    highlights: [
      'Selected in Top 20 among 1,000+ competitors nationwide',
      'Delivered full database modeling, authentication, and frontend in under 36 hours',
      'Optimized query performance and clean separation of concerns'
    ],
    tech: ['Python', 'Flask', 'SQLAlchemy', 'Bootstrap', 'REST APIs', 'Git'],
    liveUrl: '#',
    githubUrl: 'https://github.com/ArshmeenVerse'
  }
};

function initProjectFiltersAndModal() {
  const filterPills = document.querySelectorAll('.filter-pill');
  const projectCards = document.querySelectorAll('.project-card');
  const projectModal = document.getElementById('projectModal');
  const closeProjectModalBtn = document.getElementById('closeProjectModal');
  const modalProjectContent = document.getElementById('modalProjectContent');
  const modalProjectTag = document.getElementById('modalProjectTag');

  // Filter functionality
  filterPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const filter = pill.dataset.filter;
      projectCards.forEach((card) => {
        const cat = card.dataset.category;
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.animation = 'modalPopIn 0.35s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal open on "View Details / Architecture" click
  const viewBtns = document.querySelectorAll('.view-project-btn');
  viewBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const projectId = btn.dataset.projectId;
      const data = PROJECT_DATABASE[projectId];
      if (!data || !projectModal || !modalProjectContent) return;

      if (modalProjectTag) modalProjectTag.textContent = data.tag;

      modalProjectContent.innerHTML = `
        <h2 style="font-size: 1.8rem; font-weight: 800; margin-bottom: 8px;">${data.title}</h2>
        <div style="display: flex; gap: 12px; font-size: 0.85rem; font-weight: 700; color: #555; margin-bottom: 20px;">
          <span><i class="fa-solid fa-calendar"></i> ${data.year}</span>
          <span>•</span>
          <span><i class="fa-solid fa-user-group"></i> ${data.client}</span>
        </div>
        <p style="font-size: 1.05rem; line-height: 1.6; color: #2A2A2A; margin-bottom: 20px;">${data.desc}</p>
        
        <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 10px;">Key Engineering Highlights:</h4>
        <ul style="margin-left: 20px; margin-bottom: 24px; display: flex; flex-direction: column; gap: 8px; font-size: 0.95rem; color: #333;">
          ${data.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>

        <h4 style="font-size: 1.05rem; font-weight: 800; margin-bottom: 10px;">Technologies Used:</h4>
        <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 28px;">
          ${data.tech.map(t => `<span class="pill-badge outline-pill" style="font-size: 0.75rem;">${t}</span>`).join('')}
        </div>

        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="${data.githubUrl}" target="_blank" rel="noopener noreferrer" class="bento-btn primary-btn">
            <i class="fa-brands fa-github"></i> Visit GitHub Profile (@ArshmeenVerse)
          </a>
          <button class="bento-btn outline-btn" onclick="document.getElementById('projectModal').classList.remove('active')">
            Close Preview
          </button>
        </div>
      `;

      projectModal.classList.add('active');
    });
  });

  if (closeProjectModalBtn) {
    closeProjectModalBtn.addEventListener('click', () => {
      projectModal.classList.remove('active');
    });
  }

  if (projectModal) {
    projectModal.addEventListener('click', (e) => {
      if (e.target === projectModal) projectModal.classList.remove('active');
    });
  }
}

/* ==========================================================
   4. SKILLS HOVER DETAIL PREVIEW
   ========================================================== */
const SKILL_DETAILS = {
  'Python & Backend': 'Python application development, clean modular code, OOP architecture, scripting & automation.',
  'Flask & Jinja2': 'Flask microframework, Jinja2 template inheritance, custom filters, session management, routing.',
  'SQLAlchemy & Databases': 'ORM modeling, relational schema design, SQLite / PostgreSQL query optimization, migrations.',
  'Bootstrap 5 & Tailwind': 'Responsive grid systems, modern cards, navbars, modals, mobile-first utility classes.',
  'HTML5 & Modern CSS3': 'Semantic markup, custom variables, fluid typography, Flexbox, CSS Grid, micro-animations.',
  'JavaScript (ES6+)': 'DOM manipulation, async/await, API fetching, event handling, interactive UI widgets.',
  'AI & Machine Learning': 'Model evaluation, classification, regression, Scikit-Learn pipelines, feature engineering.',
  'Data Science & Analytics': 'Exploratory Data Analysis (EDA), Pandas, NumPy, statistical testing, Matplotlib/Seaborn.',
  'Git & Version Control': 'Branching, commit conventions, collaborative pull requests, GitHub workflow (@ArshmeenVerse).',
  'RESTful APIs Architecture': 'HTTP methods, JSON serialization, token authentication, endpoint error handling.',
  'UI/UX & Prototyping': 'Modern neo-bento aesthetic design, wireframing, color theory, typography hierarchy.'
};

function initSkillsPreview() {
  const pills = document.querySelectorAll('.tech-pill');
  const previewBox = document.getElementById('techDetailPreview');

  if (!previewBox) return;

  pills.forEach((pill) => {
    const techName = pill.dataset.tech;
    pill.addEventListener('mouseenter', () => {
      const detail = SKILL_DETAILS[techName] || `Expertise in ${techName}`;
      previewBox.innerHTML = `<strong>${techName}:</strong> &nbsp;${detail}`;
      previewBox.style.backgroundColor = 'var(--color-yellow-light)';
    });

    pill.addEventListener('mouseleave', () => {
      previewBox.innerHTML = 'Hover over any skill to see mastery details.';
      previewBox.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    });
  });
}

/* ==========================================================
   5. COPY EMAIL BUTTON WITH INSTANT FEEDBACK
   ========================================================== */
function initCopyEmail() {
  const copyBtn = document.getElementById('copyEmailBtn');
  const emailInput = document.getElementById('emailToCopy');
  const copyBtnText = document.getElementById('copyBtnText');

  if (!copyBtn || !emailInput) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailInput.value;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(email);
      } else {
        emailInput.select();
        document.execCommand('copy');
      }

      if (copyBtnText) copyBtnText.textContent = 'Copied!';
      copyBtn.style.backgroundColor = '#10B981';
      copyBtn.style.borderColor = '#10B981';

      showToast('📋 Email copied to clipboard: ' + email);

      setTimeout(() => {
        if (copyBtnText) copyBtnText.textContent = 'Copy';
        copyBtn.style.backgroundColor = '';
        copyBtn.style.borderColor = '';
      }, 2500);
    } catch (err) {
      showToast('Copied: ' + email);
    }
  });
}

/* ==========================================================
   6. CONTACT FORM VALIDATION & SUBMISSION
   ========================================================== */
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const nameInput = document.getElementById('userName');
    const emailInput = document.getElementById('userEmail');
    const subjectInput = document.getElementById('userSubject');
    const messageInput = document.getElementById('userMessage');

    // Name check
    if (!nameInput.value.trim()) {
      nameInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      nameInput.closest('.form-group').classList.remove('has-error');
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      emailInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      emailInput.closest('.form-group').classList.remove('has-error');
    }

    // Message check
    if (!messageInput.value.trim()) {
      messageInput.closest('.form-group').classList.add('has-error');
      isValid = false;
    } else {
      messageInput.closest('.form-group').classList.remove('has-error');
    }

    if (!isValid) {
      showToast('⚠️ Please fill out all required fields properly.');
      return;
    }

    const submitBtn = document.getElementById('submitFormBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

    try {
      const formData = new FormData(form);
      formData.append('_captcha', 'false');
      formData.append('_template', 'table');
      formData.append('_subject', subjectInput && subjectInput.value.trim() 
        ? `[Portfolio Contact] ${subjectInput.value.trim()}` 
        : `[Portfolio Contact] New message from ${nameInput.value.trim()}`);

      // Send to FormSubmit AJAX endpoint for arshmeenverse@gmail.com
      const response = await fetch('https://formsubmit.co/ajax/arshmeenverse@gmail.com', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok || data.success === 'true' || data.success === true) {
        submitBtn.innerHTML = `<span>Sent Successfully!</span> <i class="fa-solid fa-check"></i>`;
        showToast('🎉 Message sent successfully! I will get back to you soon.');
        form.reset();
      } else {
        throw new Error(data.message || 'Form submission failed');
      }
    } catch (err) {
      console.warn('Form submission encountered an issue:', err);
      submitBtn.innerHTML = `<span>Opening Mail...</span> <i class="fa-solid fa-envelope"></i>`;
      showToast('⚠️ Opening default email client to send message...');

      // Direct mailto fallback so no message is ever lost
      const mailSubject = encodeURIComponent(subjectInput && subjectInput.value.trim() 
        ? `[Portfolio Contact] ${subjectInput.value.trim()}` 
        : `[Portfolio Contact] Message from ${nameInput.value.trim()}`);
      const mailBody = encodeURIComponent(
        `Name: ${nameInput.value.trim()}\nEmail: ${emailInput.value.trim()}\n\nMessage:\n${messageInput.value.trim()}`
      );
      window.location.href = `mailto:arshmeenverse@gmail.com?subject=${mailSubject}&body=${mailBody}`;
    } finally {
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Send Message</span> <span class="btn-arrow-circle"><i class="fa-solid fa-paper-plane"></i></span>`;
      }, 4000);
    }
  });
}

/* ==========================================================
   7. LO-FI AUDIO PLAYER / AMBIENT FOCUS VIBE
   ========================================================== */
function initLoFiPlayer() {
  const soundBtn = document.getElementById('soundToggleBtn');
  const audio = document.getElementById('lofiAudio');

  if (!soundBtn || !audio) return;

  let isPlaying = false;

  soundBtn.addEventListener('click', async () => {
    if (!isPlaying) {
      try {
        await audio.play();
        isPlaying = true;
        soundBtn.classList.add('playing');
        showToast('🎵 Lo-Fi Focus Mode Activated');
      } catch (err) {
        // Fallback tone synthesizer if audio playback is blocked
        playSynthesizedLoFiTone();
        isPlaying = true;
        soundBtn.classList.add('playing');
        showToast('🎵 Ambient Sound Activated');
      }
    } else {
      audio.pause();
      isPlaying = false;
      soundBtn.classList.remove('playing');
      showToast('Audio Paused');
    }
  });
}

function playSynthesizedLoFiTone() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    function playChord() {
      const frequencies = [261.63, 329.63, 392.00, 523.25]; // C Major
      frequencies.forEach(freq => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 3);
      });
    }
    playChord();
  } catch (e) {
    console.log('Synthesizer unavailable');
  }
}

/* ==========================================================
   8. NAVIGATION SCROLL SPY
   ========================================================== */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ==========================================================
   9. MOBILE MENU TOGGLE
   ========================================================== */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenu');
  const links = document.querySelectorAll('.mobile-nav-link');

  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  links.forEach(l => {
    l.addEventListener('click', () => {
      menu.classList.remove('open');
    });
  });
}

/* ==========================================================
   10. TOAST NOTIFICATION HELPER
   ========================================================== */
function showToast(message) {
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast-message';
  toast.innerHTML = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3200);
}

// Galaxy animation
const canvas = document.getElementById('galaxy');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const createParticles = () => {
    // Moins de particules pour réduire la charge CPU
    particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      z: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.6 + 0.2,
    }));
  };
  createParticles();

  // Limiter le nombre de rafraîchissements pour réduire la consommation CPU
  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS;
  let lastTime = 0;

  const draw = (time = 0) => {
    // Throttle du rafraîchissement
    if (time - lastTime < FRAME_INTERVAL) {
      requestAnimationFrame(draw);
      return;
    }
    lastTime = time;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      ctx.beginPath();
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      ctx.fillStyle = isLight 
        ? `rgba(0, 110, 255, ${p.z})`
        : `rgba(93, 245, 255, ${p.z})`;
      ctx.arc(p.x, p.y, p.z * 2, 0, Math.PI * 2);
      ctx.fill();
      p.y -= p.speed;
      if (p.y < -10) {
        p.y = canvas.height + 10;
        p.x = Math.random() * canvas.width;
      }
    });
    requestAnimationFrame(draw);
  };
  draw();
}

// Theme toggle - Initialisation
(function() {
  'use strict';
  
  // Fonction pour mettre à jour l'icône et le texte
  function updateThemeUI(theme, toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    const text = toggleBtn.querySelector('span');
    if (icon) {
      icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
    if (text) {
      text.textContent = theme === 'dark' ? 'Mode sombre' : 'Mode clair';
    }
  }
  
  // Fonction d'initialisation
  function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) {
      // Réessayer après un court délai si le bouton n'est pas encore disponible
      setTimeout(initThemeToggle, 100);
      return;
    }
    
    const html = document.documentElement;
    
    // Charger le thème sauvegardé ou utiliser celui du HTML par défaut
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      html.setAttribute('data-theme', savedTheme);
    }
    const currentTheme = html.getAttribute('data-theme') || 'dark';
    updateThemeUI(currentTheme, themeToggle);
    
    // Écouter les clics
    themeToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const current = html.getAttribute('data-theme') || 'dark';
      const newTheme = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
      updateThemeUI(newTheme, themeToggle);
    });
  }
  
  // Démarrer l'initialisation
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeToggle);
  } else {
    initThemeToggle();
  }
})();

// Counter animation
const counters = document.querySelectorAll('[data-counter]');
if (counters.length > 0) {
  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.counter);
      const duration = 1800;
      const start = performance.now();
      
      const animate = (time) => {
        const progress = Math.min((time - start) / duration, 1);
        el.textContent = Math.round(progress * target);
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
      observer.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach((counter) => counterObserver.observe(counter));
}

// Tilt effect
const tiltElements = document.querySelectorAll('[data-tilt]');
tiltElements.forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    const rotateY = ((x / width) - 0.5) * 12;
    const rotateX = ((y / height) - 0.5) * -12;
    card.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
  });
});

// Mobile menu toggle
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const icon = navToggle.querySelector('i');
    if (icon) {
      icon.className = navLinks.classList.contains('open') 
        ? 'fas fa-times' 
        : 'fas fa-bars';
    }
  });
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href === '#top') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Close mobile menu if open
      if (navLinks && navLinks.classList.contains('open')) {
        navLinks.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    }
  });
});

// Form submission avec mailto comme solution
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim() || 'Contact depuis le portfolio';
    const message = document.getElementById('message').value.trim();
    
    // Validation
    if (!name || !email || !message) {
      alert('Veuillez remplir tous les champs obligatoires (*)');
      return;
    }
    
    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Veuillez entrer une adresse email valide');
      return;
    }
    
    // Créer le lien mailto avec le message
    const mailtoSubject = encodeURIComponent(subject);
    const mailtoBody = encodeURIComponent(
      `Bonjour Max,\n\n` +
      `Je vous contacte depuis votre portfolio.\n\n` +
      `Nom: ${name}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}\n\n` +
      `---\nCe message a été envoyé depuis le formulaire de contact de votre portfolio.`
    );
    
    const mailtoLink = `mailto:maxsogbossi@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;
    
    // Ouvrir le client email
    window.location.href = mailtoLink;
    
    // Afficher un message de confirmation
    setTimeout(() => {
      alert('Votre client email devrait s\'ouvrir. Si ce n\'est pas le cas, envoyez votre message directement à maxsogbossi@gmail.com\n\n' +
            `Sujet: ${subject}\n\n` +
            `Message: ${message}`);
      contactForm.reset();
    }, 500);
  });
}


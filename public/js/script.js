/**
 * Blood Donor Finder System - Main JavaScript File
 * Handles client-side interactions and animations
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all functions when DOM is loaded
  initNavbar();
  initScrollToTop();
  initSmoothScroll();
  initAnimations();
  initMobileMenu();
});

/**
 * Navbar scroll effect
 * Changes navbar appearance on scroll
 */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      navbar.classList.add('navbar-scrolled');
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    } else {
      navbar.classList.remove('navbar-scrolled');
      navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
    }
  });
}

/**
 * Scroll to top button functionality
 * Shows button when scrolled down, hides when at top
 */
function initScrollToTop() {
  // Create scroll to top button
  const scrollTopBtn = document.createElement('button');
  scrollTopBtn.id = 'scrollTop';
  scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
  document.body.appendChild(scrollTopBtn);
  
  // Show/hide button on scroll
  window.addEventListener('scroll', function() {
    if (window.scrollY > 300) {
      scrollTopBtn.classList.add('show');
    } else {
      scrollTopBtn.classList.remove('show');
    }
  });
  
  // Scroll to top when clicked
  scrollTopBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Smooth scroll for navigation links
 * Enables smooth scrolling to sections
 */
function initSmoothScroll() {
  const navLinks = document.querySelectorAll('a[href^="#"]');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      // Skip if it's just "#"
      if (href === '#') return;
      
      const targetElement = document.querySelector(href);
      
      if (targetElement) {
        e.preventDefault();
        
        // Calculate offset for fixed navbar
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse);
          bsCollapse.hide();
        }
      }
    });
  });
}

/**
 * Initialize animations on scroll
 * Uses Intersection Observer for performance
 */
function initAnimations() {
  // Elements to animate
  const animatedElements = document.querySelectorAll(
    '.why-card, .feature-card, .stat-card, .about-content, .about-image'
  );
  
  // Create intersection observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  // Observe each element
  animatedElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(element);
  });
}

/**
 * Mobile menu functionality
 * Handles mobile menu interactions
 */
function initMobileMenu() {
  const navbarToggler = document.querySelector('.navbar-toggler');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  // Close menu when clicking outside
  document.addEventListener('click', function(e) {
    if (!navbarToggler.contains(e.target) && 
        !navbarCollapse.contains(e.target) &&
        navbarCollapse.classList.contains('show')) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  });
  
  // Close menu on window resize
  window.addEventListener('resize', function() {
    if (window.innerWidth > 991 && navbarCollapse.classList.contains('show')) {
      const bsCollapse = new bootstrap.Collapse(navbarCollapse);
      bsCollapse.hide();
    }
  });
}

/**
 * Active navigation link highlighting
 * Updates active state based on scroll position
 */
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let currentSection = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;
    
    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      currentSection = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${currentSection}`) {
      link.classList.add('active');
    }
  });
}

// Add scroll event listener for active link highlighting
window.addEventListener('scroll', updateActiveNavLink);

/**
 * Counter animation for statistics
 * Animates numbers counting up
 */
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target.toLocaleString() + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start).toLocaleString();
    }
  }, 16);
}

/**
 * Initialize counter animations when statistics section is visible
 */
function initCounterAnimation() {
  const statSection = document.querySelector('.statistics-section');
  const statNumbers = statSection.querySelectorAll('.display-4');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          const target = parseInt(stat.textContent.replace(/,/g, '').replace('+', ''));
          animateCounter(stat, target);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  observer.observe(statSection);
}

// Initialize counter animation
initCounterAnimation();

/**
 * Form validation helper
 * Validates form inputs
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input, select, textarea');
  let isValid = true;
  
  inputs.forEach(input => {
    if (input.hasAttribute('required') && !input.value.trim()) {
      isValid = false;
      input.classList.add('is-invalid');
    } else {
      input.classList.remove('is-invalid');
    }
  });
  
  return isValid;
}

/**
 * Show alert message
 * Displays bootstrap alert with message
 */
function showAlert(message, type = 'success') {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const container = document.querySelector('.container');
  if (container) {
    container.insertBefore(alertDiv, container.firstChild);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
      const bsAlert = new bootstrap.Alert(alertDiv);
      bsAlert.close();
    }, 5000);
  }
}

/**
 * Loading spinner
 * Shows/hides loading spinner
 */
function showLoading(show = true) {
  let spinner = document.querySelector('.spinner-overlay');
  
  if (show) {
    if (!spinner) {
      spinner = document.createElement('div');
      spinner.className = 'spinner-overlay';
      spinner.innerHTML = `
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      `;
      document.body.appendChild(spinner);
    }
    spinner.style.display = 'flex';
  } else {
    if (spinner) {
      spinner.style.display = 'none';
    }
  }
}

// Export functions for use in other files (if needed)
window.BloodDonorApp = {
  validateForm,
  showAlert,
  showLoading
};

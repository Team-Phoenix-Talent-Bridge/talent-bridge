// ============================================================
// SCROLL REVEAL — IntersectionObserver
// Adds .reveal--visible to any .reveal element when it enters
// the viewport, triggering the CSS opacity/transform transition.
// ============================================================
const revealElements = document.querySelectorAll('.reveal')

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal--visible')
        revealObserver.unobserve(entry.target) // animate once only
      }
    })
  },
  {
    threshold: 0.1 // trigger when 10% of element is visible
  }
)

revealElements.forEach(el => revealObserver.observe(el))

// ============================================================
// HERO IMAGE — Mouse tilt parallax
// ============================================================
const imageCard = document.querySelector('.hero__image-card')

if (imageCard) {
  imageCard.addEventListener('mousemove', e => {
    const rect = imageCard.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    imageCard.style.transform = `
      perspective(800px)
      rotateY(${x * 10}deg)
      rotateX(${-y * 10}deg)
      scale(1.02)
    `
  })

  imageCard.addEventListener('mouseleave', () => {
    imageCard.style.transform = ''
  })
}

// ============================================================
// HERO IMAGE — Scroll-based parallax shift
// ============================================================
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY
  if (imageCard) {
    imageCard.style.setProperty('--scroll-shift', `${scrollY * 0.08}px`)
  }
})

// ============================================================
// BUTTON — Ripple effect on click
// ============================================================
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span')
    const rect = this.getBoundingClientRect()

    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255,255,255,0.35);
      width: 100px;
      height: 100px;
      top: ${e.clientY - rect.top - 50}px;
      left: ${e.clientX - rect.left - 50}px;
      transform: scale(0);
      animation: ripple 0.5s linear;
      pointer-events: none;
    `

    this.appendChild(ripple)
    setTimeout(() => ripple.remove(), 500)
  })
})

// ============================================================
// RIPPLE keyframe — injected into <head> once
// ============================================================
const rippleStyle = document.createElement('style')
rippleStyle.textContent = `
  @keyframes ripple {
    to { transform: scale(3); opacity: 0; }
  }
`
document.head.appendChild(rippleStyle)

// ============================================================
// LIVE JOBS API SECTION
// ============================================================

const jobList = document.getElementById('job-list')

if (jobList) {
  jobList.innerHTML = `
    <p class="job-loading">Loading latest remote jobs...</p>
  `

  fetch('https://remotive.com/api/remote-jobs')
    .then(response => response.json())
    .then(data => {
      jobList.innerHTML = ''

      const jobs = data.jobs.slice(0, 6)

      jobs.forEach(job => {
        const jobCard = document.createElement('article')

        jobCard.classList.add('job-card')

        jobCard.innerHTML = `
          <h3>${job.title}</h3>

          <div class="job-meta">
            <i class="fa-solid fa-building"></i>
            <span>${job.company_name}</span>
          </div>

          <div class="job-meta">
            <i class="fa-solid fa-location-dot"></i>
            <span>${job.candidate_required_location}</span>
          </div>

          <p class="job-location">
            Apply for this remote opportunity and work with global teams.
          </p>

          <a 
            href="${job.url}" 
            target="_blank" 
            rel="noopener noreferrer"
            class="job-link"
          >
            Apply Now →
          </a>
        `

        jobList.appendChild(jobCard)
      })
    })
    .catch(error => {
      console.log('Error fetching jobs:', error)

      jobList.innerHTML = `
        <p class="job-error">
          Unable to load jobs right now. Please try again later.
        </p>
      `
    })
}

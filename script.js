/* ================= CONFIG ================= */
const isMobile = window.matchMedia("(max-width: 768px)").matches;
const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

const FEATURES = {
  glow: !isMobile && !reduceMotion,
  magnetic: !isMobile && !reduceMotion,
  typing: true,
  parallax: !isMobile && !reduceMotion
};

/* ================= UTIL ================= */
function throttle(fn, delay = 100) {
  let last = 0;
  return (...args) => {
    const now = Date.now();
    if (now - last >= delay) {
      last = now;
      fn(...args);
    }
  };
}
document.addEventListener("DOMContentLoaded", () => {
  feather.replace();

  activeNavbar();
  lazyReveal();
  typingEffect();
  buttonFeedback();
});

/* ================= DOM READY ================= */
document.addEventListener("DOMContentLoaded", () => {
  activeNavbar();
  lazyReveal();
  if (FEATURES.typing) typingEffect();
  buttonFeedback();
  themeToggle();
  scrollProgress();

  if ("requestIdleCallback" in window) {
    requestIdleCallback(initIdleFeatures);
  } else {
    setTimeout(initIdleFeatures, 800);
  }

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/sw.js");
  }

  if (reduceMotion) {
    document.documentElement.classList.add("reduce-motion");
  }
});

/* ================= IDLE FEATURES ================= */
function initIdleFeatures() {
  if (FEATURES.glow) initGlow();
  if (FEATURES.magnetic) magneticButtons();
  if (FEATURES.parallax) parallaxHero();
}

/* ================= ACTIVE NAV ================= */
function activeNavbar() {
  const sections = document.querySelectorAll("section");
  const links = document.querySelectorAll(".nav-links a");

  window.addEventListener(
    "scroll",
    throttle(() => {
      let current = "";
      sections.forEach(sec => {
        if (window.scrollY >= sec.offsetTop - 150) {
          current = sec.id;
        }
      });

      links.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${current}`
        );
      });
    }, 120)
  );
}

/* ================= CINEMATIC REVEAL ================= */
function lazyReveal() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const items = entry.target.querySelectorAll(
          ".hero-text, .hero-image, .exp-card, .project-card"
        );

        items.forEach((el, i) => {
          el.style.transitionDelay = `${i * 160}ms`;
          el.classList.add("show");
        });

        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.25, rootMargin: "0px 0px -80px 0px" }
  );

  document.querySelectorAll("section").forEach(s => observer.observe(s));
}

/* ================= TYPING ================= */
function typingEffect() {
  const el = document.querySelector(".typing");
  if (!el) return;

  const texts = ["Software Engineer", "Web Developer", "Data Analyst","Data Scientic"];
  let t = 0,
    c = 0,
    del = false;

  (function loop() {
    el.textContent = texts[t].slice(0, del ? c-- : ++c);

    if (!del && c === texts[t].length) {
      setTimeout(() => (del = true), 1200);
    }
    if (del && c === 0) {
      del = false;
      t = (t + 1) % texts.length;
    }

    setTimeout(loop, del ? 80 : 120);
  })();
}

/* ================= GLOW ================= */
function initGlow() {
  const glow = document.createElement("div");
  glow.className = "mouse-glow";
  document.body.appendChild(glow);

  let x = 0,
    y = 0;

  document.addEventListener("mousemove", e => {
    x = e.clientX;
    y = e.clientY;
  });

  (function animate() {
    glow.style.transform = `translate(${x - 150}px, ${y - 150}px)`;
    requestAnimationFrame(animate);
  })();
}

/* ================= MAGNETIC BUTTON ================= */
function magneticButtons() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });

    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
    });
  });
}

/* ================= BUTTON FEEDBACK ================= */
function buttonFeedback() {
  document.querySelectorAll(".btn").forEach(btn => {
    btn.addEventListener("click", () => {
      btn.classList.add("clicked");
      setTimeout(() => btn.classList.remove("clicked"), 300);
    });
  });
}

/* ================= SCROLL PROGRESS ================= */
function scrollProgress() {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  window.addEventListener(
    "scroll",
    throttle(() => {
      const h =
        document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = `${(window.scrollY / h) * 100}%`;
    }, 60)
  );
}

/* ================= PARALLAX ================= */
function parallaxHero() {
  const hero = document.querySelector(".hero-image");
  if (!hero) return;

  window.addEventListener(
    "scroll",
    throttle(() => {
      hero.style.transform = `translateY(${window.scrollY * 0.15}px)`;
    }, 60)
  );
}

/* ================= THEME TOGGLE ================= */
function themeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn) return;

  const saved = localStorage.getItem("theme");
  if (saved === "light") {
    document.body.classList.add("light");
    btn.textContent = "☀️";
  }

  btn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    const light = document.body.classList.contains("light");
    localStorage.setItem("theme", light ? "light" : "dark");
    btn.textContent = light ? "☀️" : "🌙";
  });
}


document.querySelectorAll(".exp-card, .project-card").forEach(el => {
  el.classList.add("skeleton");
});

window.addEventListener("load", () => {
  document.querySelectorAll(".skeleton").forEach(el => {
    el.classList.remove("skeleton");
  });
});


const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

if (prefersReducedMotion || navigator.connection?.saveData) {
  document.documentElement.classList.add("reduce-motion");
}

const observer = new MutationObserver(() => {
  feather.replace();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});


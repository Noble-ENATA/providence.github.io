// Configuration du site
const SITE_CONFIG = {
  siteName: "SpaceCongo",
  siteUrl: window.location.origin,
  currentPage: window.location.pathname.split("/").pop() || "index.html",
};

// Initialisation de l'application
document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initScrollEffects();
  initAnimations();
  initForms();
  setActiveNavigation();

  console.log(`${SITE_CONFIG.siteName} - Site web professionnel initialisé`);
});

// Navigation mobile
function initNavigation() {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function () {
      mainNav.classList.toggle("active");
      this.innerHTML = mainNav.classList.contains("active")
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
    });

    // Fermer le menu mobile en cliquant sur un lien
    document.querySelectorAll(".nav-menu a").forEach((link) => {
      link.addEventListener("click", function () {
        if (window.innerWidth <= 992) {
          mainNav.classList.remove("active");
          menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
        }
      });
    });

    // Dropdown mobile
    const dropdowns = document.querySelectorAll(".dropdown");
    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector("a");

      trigger.addEventListener("click", function (e) {
        if (window.innerWidth <= 992) {
          e.preventDefault();
          dropdown.classList.toggle("active");

          // Fermer les autres dropdowns
          dropdowns.forEach((other) => {
            if (other !== dropdown) {
              other.classList.remove("active");
            }
          });
        }
      });
    });

    // Fermer le menu en cliquant à l'extérieur
    document.addEventListener("click", function (event) {
      if (
        !mainNav.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        mainNav.classList.remove("active");
        menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  }
}

// Effets de scroll
function initScrollEffects() {
  const header = document.getElementById("header");

  if (header) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }

  // Gestion des ancres
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (href !== "#" && href.startsWith("#")) {
        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          window.scrollTo({
            top: target.offsetTop - 100,
            behavior: "smooth",
          });

          // Mettre à jour l'URL sans recharger la page
          history.pushState(null, null, href);
        }
      }
    });
  });
}

// Animations
function initAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animated");
      }
    });
  }, observerOptions);

  // Observer les éléments avec animation
  document
    .querySelectorAll(
      ".feature-card, .solution-card, .service-card, .team-card, .blog-card"
    )
    .forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(el);
    });

  // Animation des statistiques
  const stats = document.querySelectorAll(".stat-value");
  if (stats.length > 0) {
    stats.forEach((stat) => {
      const originalValue = stat.textContent;
      stat.textContent = "0";

      observer.observe(stat);

      const countUp = () => {
        const target = parseInt(originalValue);
        const current = parseInt(stat.textContent);
        const increment = Math.ceil(target / 50);

        if (current < target) {
          stat.textContent =
            current + increment > target ? target : current + increment;
          setTimeout(countUp, 30);
        }
      };

      stat.addEventListener("animationstart", countUp);
    });
  }
}

// Formulaires
function initForms() {
  const forms = document.querySelectorAll("form");

  forms.forEach((form) => {
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // Validation simple
      let isValid = true;
      const requiredFields = this.querySelectorAll("[required]");

      requiredFields.forEach((field) => {
        if (!field.value.trim()) {
          isValid = false;
          field.style.borderColor = "var(--warning, #e74c3c)";
        } else {
          field.style.borderColor = "var(--light-blue)";
        }
      });

      if (isValid) {
        // Simuler l'envoi du formulaire
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML =
          '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
        submitBtn.disabled = true;

        setTimeout(() => {
          alert(
            "Merci ! Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais."
          );
          this.reset();
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        }, 1500);
      } else {
        alert("Veuillez remplir tous les champs obligatoires.");
      }
    });
  });
}

// Navigation active
function setActiveNavigation() {
  const currentPage = SITE_CONFIG.currentPage;
  const navLinks = document.querySelectorAll(".nav-menu a");

  navLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    // Retirer la classe active de tous les liens
    link.classList.remove("active");

    // Ajouter la classe active au lien correspondant
    if (
      linkPage === currentPage ||
      (currentPage === "" && linkPage === "index.html") ||
      (currentPage.includes(linkPage.replace(".html", "")) &&
        linkPage !== "index.html")
    ) {
      link.classList.add("active");
    }
  });

  // Mettre à jour le titre de la page
  updatePageTitle();
}

// Mettre à jour le titre de la page
function updatePageTitle() {
  const pageTitles = {
    "index.html": "Accueil",
    "solutions.html": "Solutions",
    "technologies.html": "Technologies",
    "realisations.html": "Réalisations",
    "entreprise.html": "Entreprise",
    "contact.html": "Contact",
    "login.html": "Connexion",
    "blog.html": "Blog",
    "presse.html": "Presse",
  };

  const pageName = pageTitles[SITE_CONFIG.currentPage] || "SpaceCongo";
  document.title = `${pageName} | SpaceCongo - Solutions Immobilières Intelligentes`;
}

// Fonction pour charger le contenu d'une page
function loadPageContent(pageId) {
  const pageContent = {
    solutions: {
      title: "Nos Solutions Immobilières Intelligentes",
      sections: ["gestion", "energie", "maintenance", "securite", "residences"],
    },
    technologies: {
      title: "Technologies Innovantes",
      sections: ["iot", "ia", "bigdata", "cloud"],
    },
    realisations: {
      title: "Nos Réalisations au Congo",
      sections: ["commercial", "residentiel", "public", "temoignages"],
    },
  };

  return pageContent[pageId] || null;
}

// Initialiser les boutons de démo
function initDemoButtons() {
  const demoButtons = document.querySelectorAll("[data-demo]");

  demoButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const demoType = this.getAttribute("data-demo");
      alert(
        `Démo de ${demoType} demandée. Notre équipe vous contactera dans les 24h.`
      );
    });
  });
}

// Gestion des partenaires
function initPartners() {
  const partners = [
    { name: "Ministère des Travaux Publics", icon: "city" },
    { name: "Constructeurs du Congo", icon: "hard-hat" },
    { name: "Hôtellerie Congolaise", icon: "hotel" },
    { name: "Éducation Nationale", icon: "school" },
    { name: "Santé Publique", icon: "hospital" },
  ];

  const partnersGrid = document.querySelector(".partners-grid");

  if (partnersGrid) {
    partners.forEach((partner) => {
      const partnerDiv = document.createElement("div");
      partnerDiv.className = "partner-logo";
      partnerDiv.innerHTML = `<i class="fas fa-${partner.icon}" style="font-size: 32px; color: var(--primary-blue);"></i>`;
      partnerDiv.title = partner.name;
      partnersGrid.appendChild(partnerDiv);
    });
  }
}

// Exporter les fonctions pour une utilisation globale
window.SpaceCongo = {
  loadPageContent,
  initDemoButtons,
  initPartners,
  navigateTo: function (page) {
    window.location.href = page;
  },
};

// Initialiser les composants spécifiques
initDemoButtons();
initPartners();

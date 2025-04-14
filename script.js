// Fonction utilitaire pour détecter les appareils mobiles
function isMobile() {
  return window.innerWidth <= 768;
}

// Garder une trace de la dernière largeur de fenêtre
let lastWidth = window.innerWidth;

// ======= PERFORMANCE UTILITIES =======
function throttleRAF(callback) {
  let ticking = false;
  return function(...args) {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        callback.apply(this, args);
        ticking = false;
      });
      ticking = true;
    }
  };
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// ======= RESPONSIVE HANDLING =======
function handleResize() {
  const width = window.innerWidth;
  const wasMobile = lastWidth <= 768;
  const isMobileNow = width <= 768;
  
  // Si on passe de mobile à desktop ou vice versa, recharger la page
  if (wasMobile !== isMobileNow) {
    window.location.reload();
    return;
  }
  
  if (width <= 1024) {
    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.querySelector('.custom-cursor-trail');
    
    if (cursor) cursor.style.display = 'none';
    if (cursorTrail) cursorTrail.style.display = 'none';
  } else {
    const cursor = document.querySelector('.custom-cursor');
    const cursorTrail = document.querySelector('.custom-cursor-trail');
    
    if (cursor) cursor.style.display = 'block';
    if (cursorTrail) cursorTrail.style.display = 'block';
  }
  
  // Réinitialiser le scrollytelling à chaque redimensionnement significatif
  if (scroller && Math.abs(window.innerWidth - lastWidth) > 50) {
    scroller.resize();
    lastWidth = window.innerWidth;
  }
}

// ======= SYSTÈME DE CHARGEMENT =======
document.addEventListener('DOMContentLoaded', function() {
  const loadingIndicator = document.getElementById('loading-indicator');
  
  // Force la fermeture du loader après 3 secondes maximum (optimisé de 5s à 3s)
  setTimeout(() => {
    if (loadingIndicator) {
      loadingIndicator.classList.add('hidden');
      startIntroAnimations();
    }
  }, 3000);
});

// ======= INITIALISATION MAPLIBRE =======
var map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
  center: [132.49859, 34.38477],
  zoom: 12.5,
  pitch: 0,
  bearing: 0,
  fadeDuration: 0,
  attributionControl: false,
  // Optimisations pour les performances
  antialias: false,
  preserveDrawingBuffer: false
});

// Gestion des erreurs de la carte
map.on('error', function(e) {
  console.error('Erreur MapLibre:', e);
  document.getElementById('loading-indicator').classList.add('hidden');
  startIntroAnimations();
});

// Configuration des couches cartographiques
map.on('load', function() {
  console.log("Carte chargée avec succès");
  
  // Masquer le loader une fois la carte chargée
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
  
  // Démarrer les animations
  startIntroAnimations();
  
  // Fonction pour ajouter des couches - toutes les couches sont créées avec visibilité 'visible'
  function addMapLayer(id, url, color, opacity = 0.8) {
    try {
      map.addSource(id, {
        type: 'geojson',
        data: url
      });
      
      map.addLayer({
        id: id + '_layer',
        type: 'fill',
        source: id,
        paint: {
          'fill-color': color,
          'fill-opacity': opacity,
          'fill-outline-color': 'rgba(0, 0, 0, 0.2)'
        },
        layout: {
          // Par défaut les couches sont créées visibles
          'visibility': 'visible'
        }
      });
      
      console.log(`Couche ${id} ajoutée avec succès`);
    } catch (error) {
      console.error(`Erreur lors de l'ajout de la couche ${id}:`, error);
    }
  }
  
  // --- Hiroshima ---
  addMapLayer('hiroshima_detruit', 
    'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Hiroshima/hiro_total_detruit.geojson', 
    '#B22222');
  
  addMapLayer('hiroshima_moinsdetruit', 
    'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Hiroshima/hiro_part_detruit_v2.geojson', 
    '#FFA500');
  
  addMapLayer('hiroshima_sauve', 
    'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Hiroshima/hiro_sauve_v2.geojson', 
    '#2E8B57');

  // --- Nagasaki ---
  addMapLayer('nagasaki_detruit', 
    'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Nagasaki/naga_detruit_bombe.geojson', 
    '#B22222');
  
  addMapLayer('nagasaki_feu', 
    'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Nagasaki/naga_feu_v2.geojson', 
    '#FFA500');
  
  addMapLayer('nagasaki_sauve', 
    'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Nagasaki/naga_sauve.geojson', 
    '#2E8B57');

  // Par défaut, on cache toutes les couches jusqu'à ce qu'on arrive à la section correspondante
  const allLayers = [
    'hiroshima_detruit_layer', 'hiroshima_moinsdetruit_layer', 'hiroshima_sauve_layer',
    'nagasaki_detruit_layer', 'nagasaki_feu_layer', 'nagasaki_sauve_layer'
  ];
  
  allLayers.forEach(layer => {
    if (map.getLayer(layer)) {
      map.setLayoutProperty(layer, 'visibility', 'none');
    }
  });

  // Configuration des boutons toggle pour la légende
  setupAllToggles();
  
  // Initialisation selon la section courante avec un délai réduit
  setTimeout(() => {
    const currentSection = getCurrentSection();
    if (currentSection) {
      console.log("Section initiale détectée:", currentSection.id);
      handleStepEnter({ element: currentSection });
    }
  }, 500); // Réduit de 1000ms à 500ms pour améliorer la réactivité
});

// ======= LÉGENDE INTERACTIVE =======
// Fonction pour configurer tous les toggles
function setupAllToggles() {
  // Hiroshima toggles
  setupToggle('toggle-destroyed-fixed');
  setupToggle('toggle-lessdestroyed-fixed');
  setupToggle('toggle-sauve-fixed');
  
  // Nagasaki toggles
  setupToggle('toggle-naga-detruit-fixed');
  setupToggle('toggle-naga-feu-fixed');
  setupToggle('toggle-naga-sauve-fixed');
  
  console.log("Tous les boutons de légende ont été configurés");
}

// Fonction améliorée pour que la légende fonctionne dès le premier clic
function setupToggle(btnId) {
  const btn = document.getElementById(btnId);
  if (!btn) {
    console.warn(`Bouton ${btnId} non trouvé`);
    return;
  }
  
  // Log pour confirmer que le bouton est trouvé
  console.log(`Bouton de légende configuré: ${btnId}`);
  
  btn.addEventListener('click', function() {
    const layer = btn.getAttribute('data-layer');
    const isActive = btn.classList.contains('active');
    
    // Log pour déboguer
    console.log(`Toggle clicked: ${btnId} for layer ${layer}, currently active: ${isActive}`);
    
    try {
      if (map.getLayer(layer)) {
        // Basculer la visibilité
        const newVisibility = isActive ? 'none' : 'visible';
        map.setLayoutProperty(layer, 'visibility', newVisibility);
        
        // Mettre à jour les classes CSS
        if (isActive) {
          btn.classList.remove('active');
          btn.classList.add('inactive');
          btn.style.opacity = '0.5';
        } else {
          btn.classList.add('active');
          btn.classList.remove('inactive');
          btn.style.opacity = '1';
        }
        
        console.log(`Visibilité de ${layer} définie à ${newVisibility}`);
      } else {
        console.warn(`Couche ${layer} non trouvée`);
      }
    } catch (error) {
      console.error(`Erreur lors du toggle de ${layer}:`, error);
    }
  });
}

// ======= ANIMATION DE L'INTRO =======
function startIntroAnimations() {
  console.log("Démarrage des animations");
  
  // Animation des éléments fade-in
  const fadeElements = document.querySelectorAll('.fade-in');
  
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.2 });
  
  fadeElements.forEach(elem => {
    fadeObserver.observe(elem);
  });
  
  // Initialiser le scrollytelling
  initScrollytelling();
}

// ======= SCROLLYTELLING =======
var scroller = scrollama();
// Garder une trace de la section actuelle pour gérer les légendes
var currentSection = "";

// Fonction utilitaire pour obtenir la section actuelle visible
function getCurrentSection() {
  if (isMobile()) {
    // Méthode pour mobile utilisant le scrollY de window
    const sections = document.querySelectorAll('.step');
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const rect = section.getBoundingClientRect();
      const sectionTop = window.scrollY + rect.top;
      const sectionBottom = sectionTop + rect.height;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        return section;
      }
    }
  } else {
    // Méthode originale pour desktop
    const sections = document.querySelectorAll('.step');
    const scrollContainer = document.getElementById('scroll-container');
    const scrollPosition = scrollContainer.scrollTop + window.innerHeight / 2;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      const sectionBottom = sectionTop + section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        return section;
      }
    }
  }
  
  return null;
}

// Fonction utilitaire pour trouver la section suivante
function getNextSection(currentId) {
  const sections = document.querySelectorAll('.step');
  let foundCurrent = false;
  
  for (let i = 0; i < sections.length; i++) {
    if (foundCurrent) {
      return sections[i].id;
    }
    if (sections[i].id === currentId) {
      foundCurrent = true;
    }
  }
  
  return null;
}

// Fonction utilitaire pour trouver la section précédente
function getPreviousSection(currentId) {
  const sections = document.querySelectorAll('.step');
  
  for (let i = 1; i < sections.length; i++) {
    if (sections[i].id === currentId) {
      return sections[i-1].id;
    }
  }
  
  return null;
}

// Gestion des sections AMÉLIORÉE - affichage immédiat des couches
function handleStepEnter(response) {
  const id = response.element.id;
  console.log(`Navigation vers la section: ${id}`);
  
  // Mémoriser la section actuelle
  currentSection = id;
  
  // Mettre à jour la navigation
  document.querySelectorAll('#quick-nav a').forEach(link => {
    link.classList.remove('active');
  });
  
  const activeNavLink = document.querySelector(`#quick-nav a[href="#${id}"]`);
  if (activeNavLink) activeNavLink.classList.add('active');
  
  // Masquer les légendes par défaut
  const legendHiroshima = document.getElementById("legend-hiroshima");
  const legendNagasaki = document.getElementById("legend-nagasaki");
  
  if (legendHiroshima) legendHiroshima.style.display = "none";
  if (legendNagasaki) legendNagasaki.style.display = "none";
  
  // Configuration spécifique par section avec couches visibles par défaut
  try {
    switch(id) {
      case "intro":
        map.flyTo({ center: [132.49859, 34.38477], zoom: 12.5, duration: 1500 });
        hideAllLayers();
        break;
      
      case "timeline":
        map.flyTo({ center: [135.5, 35.0], zoom: 6, duration: 1500 });
        hideAllLayers();
        break;
      
      case "hiroshima":
        map.flyTo({ center: [132.49214, 34.39090], zoom: 12.59, bearing: -8, pitch: 18, duration: 1500 });
        
        // IMPORTANT: On montre la légende et on active toutes les couches immédiatement
        if (legendHiroshima) {
          legendHiroshima.style.display = "block";
        }
        
        // Force l'affichage immédiat des couches d'Hiroshima
        // Pas besoin d'attendre que la carte soit chargée
        ['hiroshima_detruit_layer', 'hiroshima_moinsdetruit_layer', 'hiroshima_sauve_layer'].forEach(layer => {
          try {
            if (map.getLayer(layer)) {
              map.setLayoutProperty(layer, 'visibility', 'visible');
              console.log(`Couche ${layer} affichée`);
            }
          } catch (error) {
            console.error(`Erreur d'affichage de la couche ${layer}:`, error);
          }
        });
        
        // Cache les couches de Nagasaki
        ['nagasaki_detruit_layer', 'nagasaki_feu_layer', 'nagasaki_sauve_layer'].forEach(layer => {
          try {
            if (map.getLayer(layer)) {
              map.setLayoutProperty(layer, 'visibility', 'none');
            }
          } catch (error) {}
        });
        
        // Réinitialiser l'état des boutons de légende
        resetLegendButtons('hiroshima');
        break;
      
      case "nagasaki":
        map.flyTo({ center: [129.87881, 32.75857], zoom: 13.2, bearing: -49.60, pitch: 34.50, duration: 1500 });
        
        // IMPORTANT: On montre la légende et on active toutes les couches immédiatement
        if (legendNagasaki) {
          legendNagasaki.style.display = "block";
        }
        
        // Force l'affichage immédiat des couches de Nagasaki
        ['nagasaki_detruit_layer', 'nagasaki_feu_layer', 'nagasaki_sauve_layer'].forEach(layer => {
          try {
            if (map.getLayer(layer)) {
              map.setLayoutProperty(layer, 'visibility', 'visible');
              console.log(`Couche ${layer} affichée`);
            }
          } catch (error) {
            console.error(`Erreur d'affichage de la couche ${layer}:`, error);
          }
        });
        
        // Cache les couches d'Hiroshima
        ['hiroshima_detruit_layer', 'hiroshima_moinsdetruit_layer', 'hiroshima_sauve_layer'].forEach(layer => {
          try {
            if (map.getLayer(layer)) {
              map.setLayoutProperty(layer, 'visibility', 'none');
            }
          } catch (error) {}
        });
        
        // Réinitialiser l'état des boutons de légende
        resetLegendButtons('nagasaki');
        break;
      
      case "infographie-hiroshima":
        map.flyTo({ center: [131.5, 33.5], zoom: 5, duration: 1500 });
        hideAllLayers();
        break;
      
      case "conclusion":
        map.flyTo({ center: [135.5, 35.0], zoom: 4, pitch: 45, duration: 1500 });
        hideAllLayers();
        break;
    }
  } catch (error) {
    console.error("Erreur lors du changement de section:", error);
  }
}

// SOLUTION AMÉLIORÉE: Gestionnaire pour la sortie des sections
function handleStepExit(response) {
  const { element, direction } = response;
  const id = element.id;
  
  console.log(`Sortie de la section: ${id}, direction: ${direction}`);
  
  // Déterminer la prochaine/précédente section
  const nextSectionId = direction === 'down' ? getNextSection(id) : getPreviousSection(id);
  console.log(`Section suivante/précédente: ${nextSectionId}`);
  
  const legendHiroshima = document.getElementById("legend-hiroshima");
  const legendNagasaki = document.getElementById("legend-nagasaki");
  
  // CORRECTION: Gérer spécifiquement la transition entre Hiroshima et Timeline
  if (id === "hiroshima" && nextSectionId === "timeline") {
    // On quitte Hiroshima vers Timeline (direction up)
    if (legendHiroshima) {
      legendHiroshima.style.display = "none";
    }
    hideAllLayers();
  }
  // Gérer la transition entre Timeline et Intro (masquer les légendes)
  else if (id === "timeline" && nextSectionId === "intro") {
    if (legendHiroshima) legendHiroshima.style.display = "none";
    if (legendNagasaki) legendNagasaki.style.display = "none";
  }
  // Gérer la transition entre Hiroshima et Nagasaki
  else if (id === "hiroshima" && nextSectionId === "nagasaki") {
    if (legendHiroshima) legendHiroshima.style.display = "none";
    // Montrer la légende de Nagasaki sera fait dans handleStepEnter
  }
  // Gérer la transition entre Nagasaki et Infographie
  else if (id === "nagasaki" && nextSectionId === "infographie-hiroshima") {
    if (legendNagasaki) legendNagasaki.style.display = "none";
    hideAllLayers();
  }
  // Gérer la transition entre Nagasaki et Hiroshima (remontée)
  else if (id === "nagasaki" && nextSectionId === "hiroshima") {
    if (legendNagasaki) legendNagasaki.style.display = "none";
    // La légende d'Hiroshima sera affichée par handleStepEnter
  }
}

// Fonction pour montrer uniquement les couches d'Hiroshima
function showHiroshimaLayers() {
  if (!map.loaded()) return;
  
  // Afficher les couches d'Hiroshima
  ['hiroshima_detruit_layer', 'hiroshima_moinsdetruit_layer', 'hiroshima_sauve_layer'].forEach(layer => {
    try {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'visible');
      }
    } catch (error) {}
  });
  
  // Cacher les couches de Nagasaki
  ['nagasaki_detruit_layer', 'nagasaki_feu_layer', 'nagasaki_sauve_layer'].forEach(layer => {
    try {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'none');
      }
    } catch (error) {}
  });
}

// Fonction pour montrer uniquement les couches de Nagasaki
function showNagasakiLayers() {
  if (!map.loaded()) return;
  
  // Afficher les couches de Nagasaki
  ['nagasaki_detruit_layer', 'nagasaki_feu_layer', 'nagasaki_sauve_layer'].forEach(layer => {
    try {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'visible');
      }
    } catch (error) {}
  });
  
  // Cacher les couches d'Hiroshima
  ['hiroshima_detruit_layer', 'hiroshima_moinsdetruit_layer', 'hiroshima_sauve_layer'].forEach(layer => {
    try {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'none');
      }
    } catch (error) {}
  });
}

// Fonction pour cacher toutes les couches - optimisée pour éviter les erreurs inutiles
function hideAllLayers() {
  if (!map.loaded()) return;
  
  const allLayers = [
    'hiroshima_detruit_layer', 'hiroshima_moinsdetruit_layer', 'hiroshima_sauve_layer',
    'nagasaki_detruit_layer', 'nagasaki_feu_layer', 'nagasaki_sauve_layer'
  ];
  
  allLayers.forEach(layer => {
    try {
      if (map.getLayer(layer)) {
        map.setLayoutProperty(layer, 'visibility', 'none');
      }
    } catch (error) {
      // Ne pas logguer les erreurs ici pour éviter de surcharger la console
    }
  });
}

// Fonction pour réinitialiser les boutons de légende à l'état actif
function resetLegendButtons(city) {
  if (city === 'hiroshima') {
    // Réinitialiser les boutons d'Hiroshima
    ['toggle-destroyed-fixed', 'toggle-lessdestroyed-fixed', 'toggle-sauve-fixed'].forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.classList.add('active');
        btn.classList.remove('inactive');
        btn.style.opacity = '1';
      }
    });
  } else if (city === 'nagasaki') {
    // Réinitialiser les boutons de Nagasaki
    ['toggle-naga-detruit-fixed', 'toggle-naga-feu-fixed', 'toggle-naga-sauve-fixed'].forEach(btnId => {
      const btn = document.getElementById(btnId);
      if (btn) {
        btn.classList.add('active');
        btn.classList.remove('inactive');
        btn.style.opacity = '1';
      }
    });
  }
}

// Initialisation du scrollytelling AMÉLIORÉE pour prendre en charge les mobiles
function initScrollytelling() {
  try {
    // Configuration différente pour mobile et desktop
    if (isMobile()) {
      // Sur mobile, on utilise une configuration plus simple
      scroller.setup({
        container: "body", // Utiliser le body comme conteneur sur mobile
        step: ".step",
        offset: 0.5,
        debug: false
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);
      
      // Permettre le défilement natif sur mobile
      document.body.style.overflow = 'auto';
      document.documentElement.style.overflow = 'auto';
      
      const scrollContainer = document.getElementById('scroll-container');
      if (scrollContainer) {
        scrollContainer.style.position = 'static';
        scrollContainer.style.height = 'auto';
        scrollContainer.style.overflow = 'visible';
      }
    } else {
      // Configuration originale pour desktop
      scroller.setup({
        container: "#scroll-container",
        step: ".step",
        offset: 0.5,
        debug: false
      })
      .onStepEnter(handleStepEnter)
      .onStepExit(handleStepExit);
    }
    
    // Animation optimisée de la timeline au scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Animation en cascade
          const index = Array.from(timelineItems).indexOf(entry.target);
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 100); // Réduit à 100ms pour une animation plus rapide
        }
      });
    }, { threshold: 0.25 });
    
    timelineItems.forEach(item => {
      observer.observe(item);
    });
    
    // Autres initialisations
    initQuickNav();
    initTabs();
    initProgressBar();
    
    // Ne pas initialiser le curseur personnalisé sur mobile
    if (!isMobile()) {
      initCustomCursor();
    }
    
    // Position initiale
    setTimeout(() => {
      const firstStep = document.querySelector('.step');
      if (firstStep) {
        handleStepEnter({ element: firstStep });
      }
    }, 300); // Réduit à 300ms pour une réactivité accrue
  } catch (error) {
    console.error("Erreur d'initialisation du scrollytelling:", error);
  }
}

// ======= NAVIGATION RAPIDE =======
function initQuickNav() {
  const quickNavLinks = document.querySelectorAll('#quick-nav a');
  
  quickNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href').substring(1);
      const targetSection = document.getElementById(targetId);
      
      if (targetSection) {
        if (isMobile()) {
          // Sur mobile, utiliser le scroll natif
          targetSection.scrollIntoView({ behavior: 'smooth' });
        } else {
          // Sur desktop, faire défiler notre conteneur
          const scrollContainer = document.getElementById('scroll-container');
          if (scrollContainer) {
            scrollContainer.scrollTo({
              top: targetSection.offsetTop,
              behavior: 'smooth'
            });
          }
        }
      }
    });
  });
}

// ======= TABS POUR L'INFOGRAPHIE =======
function initTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Désactiver tous les onglets
      document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Activer l'onglet sélectionné
      this.classList.add('active');
      const targetId = this.getAttribute('data-target');
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// ======= BARRE DE PROGRESSION OPTIMISÉE POUR MOBILE =======
function initProgressBar() {
  const progressBar = document.getElementById('progress-bar');
  const progressIndicator = document.getElementById('progress-indicator');
  const scrollContainer = document.getElementById('scroll-container');
  
  if (!progressBar || !progressIndicator) return;
  
  let lastScrollPosition = 0;
  let lastScrollTime = 0;
  
  // Fonction qui met à jour la barre de progression
  const updateProgressBar = function() {
    // Limiter les mises à jour à 60 FPS maximum
    const now = Date.now();
    if (now - lastScrollTime < 16) return; // ~60 FPS
    
    let scrollProgress;
    
    if (isMobile()) {
      // Sur mobile, on utilise le scroll de la fenêtre
      const scrollTop = window.scrollY;
      if (Math.abs(scrollTop - lastScrollPosition) < 5) return;
      
      const scrollHeight = document.body.scrollHeight - window.innerHeight;
      scrollProgress = (scrollTop / scrollHeight) * 100;
      
      lastScrollPosition = scrollTop;
    } else {
      // Sur desktop, on utilise le scroll du conteneur
      if (!scrollContainer) return;
      
      const scrollTop = scrollContainer.scrollTop;
      if (Math.abs(scrollTop - lastScrollPosition) < 5) return;
      
      const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
      scrollProgress = (scrollTop / scrollHeight) * 100;
      
      lastScrollPosition = scrollTop;
    }
    
    // Mettre à jour directement le style sans requestAnimationFrame
    progressBar.style.width = scrollProgress + '%';
    progressIndicator.style.left = scrollProgress + '%';
    
    lastScrollTime = now;
  };
  
  // Sur mobile, on écoute l'événement de défilement sur la fenêtre
  if (isMobile()) {
    window.addEventListener('scroll', updateProgressBar);
  } else {
    // Sur desktop, on écoute l'événement de défilement sur le conteneur
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', updateProgressBar);
    }
  }
}

// ======= CURSEUR PERSONNALISÉ OPTIMISÉ =======
function initCustomCursor() {
  // Ne pas activer sur mobile ou tablette
  if (isMobile()) return;
  
  const cursor = document.querySelector('.custom-cursor');
  const cursorTrail = document.querySelector('.custom-cursor-trail');
  
  if (!cursor || !cursorTrail) return;
  
  // Optimisation: utiliser transform au lieu de left/top
  document.addEventListener('mousemove', throttleRAF(function(e) {
    cursor.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    
    // Effet de traînée
    setTimeout(() => {
      cursorTrail.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    }, 50);
  }));
  
  // Effet au survol des éléments cliquables
  const clickables = document.querySelectorAll('a, button, .toggle-btn');
  
  clickables.forEach(element => {
    element.addEventListener('mouseenter', function() {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      cursorTrail.style.width = '35px';
      cursorTrail.style.height = '35px';
    });
    
    element.addEventListener('mouseleave', function() {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursorTrail.style.width = '24px';
      cursorTrail.style.height = '24px';
    });
  });
}

// ======= INITIALISATION GÉNÉRALE =======
document.addEventListener('DOMContentLoaded', function() {
  console.log("DOM chargé, initialisation...");
  
  // Initialiser les fonctionnalités de base
  initProgressBar();
  initQuickNav();
  initTabs();
  
  // Précacher les ressources importantes
  precacheResources();
  
  // Gestion du redimensionnement
  window.addEventListener('resize', debounce(handleResize, 150)); // Réduit à 150ms
  handleResize();
});

// Fonction pour précacher les ressources importantes
function precacheResources() {
  // Préchargement des images pour éviter les retards de rendu
  const urls = [
    'https://static-images.lpnt.fr/cd-cw1618/images/2020/08/30/20671109lpw-20671118-article-hiroshima-bombe-nucleaire-japon-jpg_7311454_660x287.jpg',
    'https://upload.wikimedia.org/wikipedia/commons/3/3d/Fat_Man_Assembled_Tinian_1945.jpg'
  ];
  
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

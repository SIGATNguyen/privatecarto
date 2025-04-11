// Initialisation de MapLibre
var map = new maplibregl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
  center: [132.49859, 34.38477],
  zoom: 12.5,
  pitch: 0,
  bearing: 0
});

map.on('load', () => {
  // --- Hiroshima ---
  map.addSource('hiroshima_detruit', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Hiroshima/hiro_total_detruit.geojson'
  });
  map.addLayer({
    id: 'hiroshima_detruit_layer',
    type: 'fill',
    source: 'hiroshima_detruit',
    paint: {
      'fill-color': '#B22222',
      'fill-opacity': 0.8
    }
  });

  map.addSource('hiroshima_moinsdetruit', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Hiroshima/hiro_part_detruit_v2.geojson'
  });
  map.addLayer({
    id: 'hiroshima_moinsdetruit_layer',
    type: 'fill',
    source: 'hiroshima_moinsdetruit',
    paint: {
      'fill-color': '#FFA500',
      'fill-opacity': 0.8
    }
  });
  
  map.addSource('hiroshima_sauve', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Hiroshima/sauve.geojson'
  });
  map.addLayer({
    id: 'hiroshima_sauve_layer',
    type: 'fill',
    source: 'hiroshima_sauve',
    paint: {
      'fill-color': '#2E8B57',
      'fill-opacity': 0.8
    }
  });

  // --- Nagasaki ---
  map.addSource('nagasaki_detruit', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Nagasaki/naga_detruit_bombe.geojson'
  });
  map.addLayer({
    id: 'nagasaki_detruit_layer',
    type: 'fill',
    source: 'nagasaki_detruit',
    paint: {
      'fill-color': '#B22222',
      'fill-opacity': 0.8
    }
  });
  
  map.addSource('nagasaki_feu', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Nagasaki/naga_feu.geojson'
  });
  map.addLayer({
    id: 'nagasaki_feu_layer',
    type: 'fill',
    source: 'nagasaki_feu',
    paint: {
      'fill-color': '#FFA500',
      'fill-opacity': 0.8
    }
  });
  
  map.addSource('nagasaki_sauve', {
    type: 'geojson',
    data: 'https://raw.githubusercontent.com/SIGATNguyen/Web_carto/refs/heads/main/Nagasaki/naga_sauve.geojson'
  });
  map.addLayer({
    id: 'nagasaki_sauve_layer',
    type: 'fill',
    source: 'nagasaki_sauve',
    paint: {
      'fill-color': '#2E8B57',
      'fill-opacity': 0.8
    }
  });

  // Gestion des boutons toggle pour la légende
  function setupToggle(btnId) {
    var btn = document.getElementById(btnId);
    btn.addEventListener('click', function () {
      var layer = btn.getAttribute('data-layer');
      if (btn.classList.contains('active')) {
        map.setLayoutProperty(layer, 'visibility', 'none');
        btn.classList.remove('active');
        btn.classList.add('inactive');
        btn.style.opacity = "0.5";
      } else {
        map.setLayoutProperty(layer, 'visibility', 'visible');
        btn.classList.remove('inactive');
        btn.classList.add('active');
        btn.style.opacity = "1";
      }
    });
  }
  setupToggle('toggle-destroyed-fixed');
  setupToggle('toggle-lessdestroyed-fixed');
  setupToggle('toggle-sauve-fixed');
  setupToggle('toggle-naga-detruit-fixed');
  setupToggle('toggle-naga-feu-fixed');
  setupToggle('toggle-naga-sauve-fixed');
});

// Configuration de Scrollama pour le reste du scrollytelling
var scroller = scrollama();

function handleStepEnter(response) {
  var id = response.element.id;
  // Masquer les légendes par défaut
  document.getElementById("legend-hiroshima").style.display = "none";
  document.getElementById("legend-nagasaki").style.display = "none";
  
  if (id === "hiroshima") {
    map.flyTo({ 
      center: [132.49859, 34.38477], 
      zoom: 12.5, 
      duration: 1500,  // Plus rapide: 1500ms au lieu de 5000ms
      essential: true, // Garantit que l'animation est prioritaire
      curve: 1.5       // Courbe d'animation plus dynamique
    });
    document.getElementById("legend-hiroshima").style.display = "block";
  } else if (id === "nagasaki") {
    map.flyTo({ 
      center: [129.89961, 32.75209], 
      zoom: 12.3, 
      duration: 1500,  // Plus rapide: 1500ms au lieu de 5000ms 
      essential: true, // Garantit que l'animation est prioritaire
      curve: 1.5       // Courbe d'animation plus dynamique
    });
    document.getElementById("legend-nagasaki").style.display = "block";
  }
}

function handleStepExit(response) {
  // Actions à la sortie d'une section si nécessaire
}

scroller.setup({
  container: "#scroll-container",
  step: ".step",
  offset: 0.5,
  debug: false
})
  .onStepEnter(handleStepEnter)
  .onStepExit(handleStepExit);

// Animation pour l'intro et la timeline
document.addEventListener('DOMContentLoaded', function() {
  // Animation pour l'intro
  // Ajouter la classe pour déclencher l'animation après un petit délai
  setTimeout(() => {
    const introContent = document.querySelector('.intro-content');
    if (introContent) {
      introContent.classList.add('animate-in');
    }
  }, 300);
  
  // Effet parallaxe sur l'image de fond
  const introBackground = document.querySelector('.intro-background');
  window.addEventListener('scroll', function() {
    const scrollPosition = window.pageYOffset;
    const parallaxValue = scrollPosition * 0.4;
    
    if (introBackground) {
      introBackground.style.backgroundPositionY = `calc(50% + ${parallaxValue}px)`;
    }
  });
  
  // Animation des cercles de décoration
  const circles = document.querySelectorAll('.intro-circle');
  
  window.addEventListener('mousemove', function(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    circles.forEach((circle, index) => {
      // Le facteur de mouvement diffère pour chaque cercle
      const factorX = (index + 1) * 0.01;
      const factorY = (index + 1) * 0.01;
      
      // Calcule le déplacement basé sur la position de la souris
      const moveX = (mouseX - window.innerWidth / 2) * factorX;
      const moveY = (mouseY - window.innerHeight / 2) * factorY;
      
      // Applique la transformation
      circle.style.transform = `translate(${moveX}px, ${moveY}px) scale(${1 + index * 0.1})`;
    });
  });
  
  // Sélectionner tous les éléments de la timeline
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  // Créer un observateur d'intersection plus sophistiqué
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Animation progressive et séquentielle
      if (entry.isIntersecting) {
        // Ajouter un délai basé sur l'index pour créer un effet de cascade
        const index = Array.from(timelineItems).indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 150); // 150ms de délai entre chaque item
      }
    });
  }, { 
    root: null, // viewport
    threshold: 0.25, // déclenche quand 25% de l'élément est visible
    rootMargin: '-50px 0px' 
  });
  
  // Observer chaque élément de la timeline
  timelineItems.forEach(item => {
    observer.observe(item);
  });
  
  // Interaction au survol des éléments timeline
  timelineItems.forEach(item => {
    const content = item.querySelector('.timeline-content');
    
    if (content) {
      item.addEventListener('mouseenter', function() {
        // Zoom léger sur l'élément au survol
        content.style.transform = 'translateY(-8px)';
      });
      
      item.addEventListener('mouseleave', function() {
        // Retour à la normale
        content.style.transform = 'translateY(-5px)';
      });
    }
  });
});

// Mise à jour de la barre de progression globale
const progressBar = document.getElementById('progress-bar');
const scrollContainer = document.getElementById('scroll-container');

scrollContainer.addEventListener('scroll', function() {
  const scrollTop = scrollContainer.scrollTop;
  const scrollHeight = scrollContainer.scrollHeight - scrollContainer.clientHeight;
  const scrollProgress = (scrollTop / scrollHeight) * 100;
  progressBar.style.width = scrollProgress + '%';
});

// Throttle avec requestAnimationFrame
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

// Scroll fluide via la molette
scrollContainer.addEventListener("wheel", function (e) {
  e.preventDefault();
  scrollContainer.scrollTop += e.deltaY * 0.28;
}, { passive: false });

// Curseur personnalisé
var cursor = document.querySelector(".custom-cursor");
document.addEventListener("mousemove", throttleRAF(function (e) {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
}));

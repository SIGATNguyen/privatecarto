/* ----- Reset & Base ----- */
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  /* Palette de couleurs principale */
  --primary: #AF0D1D;         /* Rouge principal - couleur de l'explosion */
  --primary-light: #D73C4E;   /* Rouge clair */
  --primary-dark: #7D0914;    /* Rouge foncé */
  
  /* Couleurs secondaires */
  --secondary: #1A1A1A;       /* Gris très foncé - presque noir */
  --secondary-light: #333;    /* Gris foncé */
  --secondary-lighter: #666;  /* Gris moyen */
  
  /* Couleurs de fond */
  --background: #FFFFFF;      /* Blanc */
  --background-alt: #F6F6F6;  /* Gris très clair */
  
  /* Couleurs de texte */
  --text: #1A1A1A;            /* Noir pour le texte principal */
  --text-light: #666;         /* Gris pour le texte secondaire */
  --text-lighter: #999;       /* Gris clair pour les légendes */
  --text-white: #FFF;         /* Blanc pour le texte sur fond sombre */
  
  /* Couleurs fonctionnelles */
  --success: #2E8B57;         /* Vert pour les zones sauvées */
  --warning: #FFA500;         /* Orange pour les zones endommagées */
  --danger: #B22222;          /* Rouge foncé pour les zones détruites */
  
  /* Dimensions */
  --header-height: 60px;
  --footer-height: 300px;
  --sidebar-width: 300px;
  
  /* Z-index layers */
  --z-back: 1;
  --z-normal: 2;
  --z-front: 3;
  --z-overlay: 10;
  --z-modal: 20;
  --z-extreme: 100;
  
  /* Transitions */
  --transition-fast: 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-normal: 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-slow: 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  /* Shadows */
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.2);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.16), 0 6px 10px rgba(0,0,0,0.1);
  --shadow-xl: 0 15px 35px rgba(0,0,0,0.18), 0 10px 25px rgba(0,0,0,0.1);
}

html, body {
  width: 100%;
  height: 100%;
  font-family: Arial, sans-serif;
  font-size: 16px;
  background-color: var(--background);
  color: var(--text);
  overflow: hidden;
  /* Désactive le scroll natif pour utiliser notre système custom */
  overscroll-behavior: none; 
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  cursor: none; /* Cache le curseur par défaut */
  position: relative;
}

/* ----- Fonts & Typography ----- */
h1, h2, h3, h4, h5, h6 {
  font-family: Arial, sans-serif;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 0.5em;
}

h1 {
  font-size: 3.5rem;
}

h2 {
  font-size: 2.5rem;
}

h3 {
  font-size: 1.8rem;
}

p {
  margin-bottom: 1em;
  line-height: 1.6;
}

/* ----- Correction pour les liens ----- */
a {
  color: inherit;
  text-decoration: none;
}

/* ----- Loader ----- */
#loading-indicator {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--secondary);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: var(--z-modal);
  opacity: 1;
  transition: opacity 0.5s ease-out, visibility 0.5s ease-out;
}

#loading-indicator.hidden {
  opacity: 0;
  visibility: hidden;
}

.loading-circle {
  width: 60px;
  height: 60px;
  border: 6px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 20px;
}

#loading-indicator p {
  color: var(--text-white);
  font-size: 1rem;
  letter-spacing: 1px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ----- Custom Cursor with Trail ----- */
.custom-cursor {
  position: fixed;
  width: 10px;
  height: 10px;
  background: var(--primary);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: var(--z-extreme);
  mix-blend-mode: exclusion;
  will-change: transform;
  transition: width 0.2s, height 0.2s;
}

.custom-cursor-trail {
  position: fixed;
  width: 24px;
  height: 24px;
  background: rgba(175, 13, 29, 0.2);
  border-radius: 50%;
  pointer-events: none;
  transform: translate(-50%, -50%);
  z-index: calc(var(--z-extreme) - 1);
  transition: transform 0.1s, width 0.2s, height 0.2s, opacity 0.3s;
  will-change: transform;
}

/* Effet d'agrandissement sur les éléments interactifs */
a:hover ~ .custom-cursor,
button:hover ~ .custom-cursor {
  width: 20px;
  height: 20px;
  background: var(--primary);
}

/* ----- Global Progress Bar ----- */
#progress-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 5px;
  z-index: var(--z-overlay);
}

#progress-bar {
  position: absolute;
  top: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: var(--primary);
  transition: width 0.05s linear;
}

#progress-indicator {
  position: absolute;
  top: -2px;
  right: 0;
  width: 12px;
  height: 9px;
  background: var(--primary);
  border-radius: 6px;
  transform: translateX(0);
  box-shadow: 0 0 8px rgba(175, 13, 29, 0.8);
}

/* ----- Quick Navigation Menu ----- */
#quick-nav {
  position: fixed !important;
  top: 50% !important;
  right: 20px !important;
  transform: translateY(-50%) !important;
  z-index: var(--z-overlay) !important;
}

#quick-nav ul {
  list-style: none !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 15px !important;
  margin: 0 !important;
  padding: 0 !important;
}

#quick-nav a {
  display: block !important;
  width: 12px !important;
  height: 12px !important;
  border-radius: 50% !important;
  background: rgba(0, 0, 0, 0.2) !important;
  transition: all 0.3s ease !important;
  position: relative !important;
  color: transparent !important;
  text-decoration: none !important;
  overflow: hidden !important;
}

#quick-nav a::before {
  content: attr(href);
  position: absolute;
  right: 25px;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0;
  transition: opacity 0.3s ease;
  background: var(--secondary);
  color: white;
  padding: 5px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  white-space: nowrap;
  pointer-events: none;
}

#quick-nav a:hover::before {
  opacity: 1;
}

#quick-nav a.active,
#quick-nav a:hover {
  background: var(--primary) !important;
  transform: scale(1.3) !important;
}

/* ----- Map Container ----- */
#map-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-back);
  overflow: hidden;
}

#map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.map-vignette {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 0 0 150px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  z-index: 1;
}

/* ----- Scroll Container ----- */
#scroll-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-normal);
  overflow-y: scroll;
  overflow-x: hidden;
  background: transparent;
  -webkit-overflow-scrolling: touch;
  scroll-behavior: smooth;
  scrollbar-width: none;
}

#scroll-container::-webkit-scrollbar {
  display: none;
}

.scroller {
  position: relative;
  width: 100%;
}

.step {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: block;
}

/* ----- Section Badge ----- */
.section-badge {
  display: inline-block;
  background: var(--primary);
  color: white;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 6px 12px;
  border-radius: 4px;
  margin-bottom: 15px;
  transform: translateY(0);
  transition: transform 0.3s ease;
  box-shadow: var(--shadow-sm);
}

.sticky-content:hover .section-badge {
  transform: translateY(-3px);
}

/* ----- Intro Section ----- */
.intro-background {
  background: linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)),
    url('https://static-images.lpnt.fr/cd-cw1618/images/2020/08/30/20671109lpw-20671118-article-hiroshima-bombe-nucleaire-japon-jpg_7311454_660x287.jpg');
  background-position: center;
  background-size: cover;
  width: 100%;
  height: 100vh;
  position: relative;
  overflow: hidden;
}

.intro-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(175, 13, 29, 0.2) 0%, rgba(0, 0, 0, 0) 70%);
  z-index: 1;
}

.intro-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  background: rgba(0, 0, 0, 0.1);
}

.intro-content {
  width: 80%;
  max-width: 900px;
  background: rgba(0, 0, 0, 0.7);
  padding: 50px;
  border-left: 6px solid var(--primary);
  box-shadow: var(--shadow-xl);
  position: relative;
  animation: fadeInUp 1.2s ease-out;
  transform: translateY(0);
  transition: transform 0.4s ease-out;
}

.intro-content:hover {
  transform: translateY(-5px);
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.intro-badge {
  position: absolute;
  top: -25px;
  left: -25px;
  background: var(--primary);
  color: white;
  font-weight: bold;
  font-size: 1.2rem;
  padding: 10px 15px;
  border-radius: 5px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transform: rotate(-5deg);
  z-index: 3;
}

.pulse-effect {
  animation: pulse-badge 3s infinite alternate;
}

@keyframes pulse-badge {
  0% {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
  100% {
    box-shadow: 0 4px 20px rgba(175, 13, 29, 0.8);
  }
}

.intro-title {
  text-align: center;
  font-size: 5rem;
  font-weight: 900;
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  line-height: 1.1;
  margin: 0;
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
}

.intro-line {
  display: block;
  margin-bottom: 5px;
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.intro-content:hover .intro-line {
  transform: translateY(-3px);
}

.intro-line-highlight {
  display: block;
  color: var(--primary);
  font-size: 130%;
  margin: -5px 0;
  position: relative;
  z-index: 2;
  font-weight: 900;
  text-shadow: 3px 3px 6px rgba(0, 0, 0, 0.6);
}

.intro-separator {
  width: 80px;
  height: 4px;
  background: var(--primary);
  margin: 25px auto;
}

.intro-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  font-size: 0.9rem;
  letter-spacing: 1px;
  max-width: 550px;
  margin: 25px auto 0;
}

.meta-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.meta-date, .byline {
  background: rgba(0, 0, 0, 0.3);
  padding: 6px 12px;
  border-radius: 3px;
  border-bottom: 2px solid rgba(175, 13, 29, 0.7);
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* ----- Timeline Section ----- */
#timeline {
  background-color: var(--background-alt);
  padding: 80px 0 120px;
  position: relative;
  overflow: hidden;
}

.timeline-header {
  text-align: center;
  font-size: 3.2em;
  font-weight: bold;
  margin-bottom: 5px;
  color: var(--secondary);
  text-transform: uppercase;
  letter-spacing: 2px;
  position: relative;
}

.timeline-subtitle {
  text-align: center;
  color: var(--text-light);
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto 50px;
}

/* Container global de la timeline */
.timeline {
  position: relative;
  margin: 80px auto;
  padding: 0;
  width: 90%;
  max-width: 1200px;
}

/* Ligne verticale centrale */
.timeline::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 6px;
  background: linear-gradient(to bottom, 
    var(--primary-dark),
    var(--primary),
    var(--primary-light),
    var(--primary));
  transform: translateX(-50%);
  z-index: 0;
  border-radius: 3px;
  box-shadow: var(--shadow-md);
}

/* Style de chaque élément (bloc événement) */
.timeline-item {
  position: relative;
  width: 50%;
  padding: 30px 40px;
  box-sizing: border-box;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.timeline-item.left {
  left: 0;
  text-align: right;
  padding-right: 60px;
}

.timeline-item.right {
  left: 50%;
  text-align: left;
  padding-left: 60px;
}

/* Animation au scroll */
.timeline-item.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Ajout d'un effet de surbrillance au survol */
.timeline-content {
  background: white;
  border: none;
  border-radius: 8px;
  padding: 30px;
  position: relative;
  box-shadow: var(--shadow-md);
  transition: all 0.3s ease;
  overflow: hidden;
  transform: translateY(0);
}

.timeline-content:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-lg);
}

/* Ajout d'un bandeau coloré sur le côté */
.timeline-content::after {
  content: '';
  position: absolute;
  top: 0;
  width: 5px;
  height: 100%;
  background: var(--primary);
}

.timeline-item.left .timeline-content::after {
  right: 0;
}

.timeline-item.right .timeline-content::after {
  left: 0;
}

/* Style du titre avec un effet de soulignement */
.timeline-title {
  font-size: 1.4em;
  margin: 0 0 10px;
  color: var(--secondary);
  font-weight: bold;
  position: relative;
  padding-bottom: 10px;
}

.timeline-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary);
}

.timeline-item.left .timeline-title::after {
  right: 0;
}

.timeline-item.right .timeline-title::after {
  left: 0;
}

/* Mise en forme de la date en style journal */
.timeline-date {
  display: inline-block;
  font-weight: bold;
  color: white;
  margin-bottom: 15px;
  font-size: 0.9em;
  background-color: var(--primary);
  padding: 5px 12px;
  border-radius: 30px;
  letter-spacing: 0.5px;
  box-shadow: var(--shadow-sm);
}

.timeline-content p {
  margin: 0;
  line-height: 1.7;
  color: var(--text);
  font-size: 1.05em;
}

/* Pastille repère sur la ligne centrale stylisée */
.timeline-item::after {
  content: '';
  position: absolute;
  top: 40px;
  width: 26px;
  height: 26px;
  background: white;
  border: 5px solid var(--primary);
  border-radius: 50%;
  z-index: 1;
  box-shadow: 0 0 0 5px rgba(175, 13, 29, 0.3);
  transition: all 0.3s ease;
}

/* Ajout d'une animation de pulsation sur les pastilles */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(175, 13, 29, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(175, 13, 29, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(175, 13, 29, 0);
  }
}

.timeline-item.visible::after {
  animation: pulse 2s infinite;
}

/* Positionnement de la pastille différemment selon le côté */
.timeline-item.left::after {
  right: -18px;
}

.timeline-item.right::after {
  left: -18px;
}

/* Connecteurs entre les points et les cartes */
.timeline-connector {
  content: '';
  position: absolute;
  top: 45px;
  width: 30px;
  height: 3px;
  background-color: var(--primary);
  z-index: 0;
}

.timeline-item.left .timeline-connector {
  right: -30px;
}

.timeline-item.right .timeline-connector {
  left: -30px;
}

/* ----- Sticky Container (Hiroshima & Nagasaki) ----- */
.sticky-container {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 40px;
  z-index: var(--z-normal);
}

.sticky-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 35px;
  max-width: 550px;
  margin: 20px;
  box-shadow: var(--shadow-lg);
  border-radius: 8px;
  border-left: 5px solid var(--primary);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.sticky-content:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

/* ----- Text Container & Content ----- */
.text-container {
  background: white;
  color: var(--text);
  padding: 30px;
}

.text-container h2 {
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: var(--secondary);
}

.intro-paragraph {
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.5em;
  color: var(--secondary);
}

/* Points d'impact */
.impact-legend {
  list-style: none;
  margin: 20px 0;
}

.impact-legend li {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.impact-dot {
  display: inline-block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  margin-right: 10px;
  flex-shrink: 0;
}

.impact-dot.destruction {
  background: var(--danger);
}

.impact-dot.partial, .impact-dot.fire {
  background: var(--warning);
}

.impact-dot.spared {
  background: var(--success);
}

/* Conteneur de statistiques */
.stat-container {
  display: flex;
  gap: 20px;
  margin: 30px 0;
}

.stat-item {
  flex: 1;
  background: var(--background-alt);
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  border-bottom: 3px solid var(--primary);
  transition: transform 0.2s ease;
}

.stat-item:hover {
  transform: translateY(-3px);
}

.stat-number {
  font-size: 2rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: 5px;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-light);
}

/* Prompt d'exploration */
.explore-prompt {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 30px;
  padding: 15px;
  background: var(--secondary-light);
  color: white;
  border-radius: 8px;
  animation: glow 3s infinite alternate;
}

@keyframes glow {
  0% {
    box-shadow: 0 0 5px rgba(175, 13, 29, 0.3);
  }
  100% {
    box-shadow: 0 0 15px rgba(175, 13, 29, 0.6);
  }
}

/* ----- Sections Hiroshima & Nagasaki ----- */
#hiroshima,
#nagasaki {
  min-height: 200vh;
}

/* ----- Infographie Section ----- */
#infographie-hiroshima {
  background: var(--background);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 60px 0;
}

.infographie-container {
  width: 100%;
  max-width: 1200px;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 0 40px;
  gap: 40px;
}

.infographie-text {
  flex: 0 0 40%;
  background: white;
  padding: 30px;
  color: var(--text);
  box-shadow: var(--shadow-md);
  border-radius: 8px;
  transition: transform 0.3s ease;
}

.infographie-text:hover {
  transform: translateY(-5px);
}

.infographie-tabs {
  display: flex;
  margin: 25px 0 15px;
  border-bottom: 2px solid var(--background-alt);
}

.tab-btn {
  padding: 12px 20px;
  background: none;
  border: none;
  font-weight: bold;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.tab-btn:hover {
  color: var(--primary);
}

.tab-btn.active {
  color: var(--primary);
}

.tab-btn.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: var(--primary);
}

.tab-content {
  display: none;
  padding: 20px 0;
}

.tab-content.active {
  display: block;
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.data-list {
  list-style: none;
}

.data-list li {
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--background-alt);
}

.data-list li:last-child {
  border-bottom: none;
}

.data-list li strong {
  color: var(--secondary);
}

/* Partie interactive de l'infographie */
.infographie-image {
  flex: 0 0 60%;
}

.infographie-interactive {
  background: var(--secondary-light);
  padding: 30px;
  border-radius: 8px;
  color: white;
  height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.bomb-comparison {
  display: flex;
  justify-content: space-around;
  align-items: flex-start;
  height: 220px;
  margin-bottom: 20px;
}

.bomb {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  transition: transform 0.3s ease;
}

.bomb:hover {
  transform: translateY(-10px);
}

.bomb-name {
  font-weight: bold;
  margin-bottom: 15px;
}

.bomb-shape {
  width: 100px;
  height: 160px;
  background: var(--primary);
  position: relative;
  margin-bottom: 15px;
}

.little-boy .bomb-shape {
  width: 70px;
  border-radius: 20px;
}

.fat-man .bomb-shape {
  width: 110px;
  height: 140px;
  border-radius: 50%;
}

.bomb-data {
  font-size: 1.5rem;
  font-weight: bold;
}

.blast-radius-comparison {
  position: relative;
  height: 240px;
  width: 100%;
}

.radius-circle {
  position: absolute;
  border: 2px dashed white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.radius-circle.hiroshima {
  top: 50%;
  left: 40%;
  width: 180px;
  height: 180px;
  border-color: rgba(255, 255, 255, 0.8);
  animation: pulse-radius 3s infinite alternate;
}

.radius-circle.nagasaki {
  top: 50%;
  left: 60%;
  width: 220px;
  height: 220px;
  border-color: rgba(255, 255, 255, 0.6);
  animation: pulse-radius 3s 0.5s infinite alternate;
}

@keyframes pulse-radius {
  0% {
    box-shadow: 0 0 0 0 rgba(175, 13, 29, 0.4);
    border-color: rgba(255, 255, 255, 0.6);
  }
  100% {
    box-shadow: 0 0 20px 10px rgba(175, 13, 29, 0.2);
    border-color: rgba(255, 255, 255, 1);
  }
}

.scale-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.scale-line {
  width: 100px;
  height: 3px;
  background: white;
  margin: 0 auto 5px;
}

.scale-label {
  font-size: 0.9rem;
}

/* ----- Conclusion Section ----- */
#conclusion {
  background: white;
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 80px 0;
}

.final-article {
  display: flex;
  align-items: flex-start;
  max-width: 1200px;
  width: 90%;
  margin: auto;
  gap: 40px;
}

.final-text {
  flex: 1;
  padding-right: 20px;
}

.final-text h2 {
  font-size: 2.5em;
  margin-bottom: 20px;
  color: var(--secondary);
}

.final-text p {
  font-size: 1.1em;
  margin-bottom: 20px;
}

.final-quote {
  margin: 30px 0;
  padding: 20px 30px;
  font-style: italic;
  font-size: 1.3rem;
  border-left: 4px solid var(--primary);
  background: var(--background-alt);
  position: relative;
}

.final-quote::before {
  content: '"';
  position: absolute;
  top: 0;
  left: 10px;
  font-size: 4rem;
  color: var(--primary);
  opacity: 0.2;
  line-height: 1;
}

.final-quote cite {
  display: block;
  margin-top: 10px;
  font-size: 1rem;
  text-align: right;
}

.final-image-container {
  flex: 0 0 40%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: var(--shadow-lg);
  transition: transform 0.3s ease;
}

.final-image-container:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

.final-image {
  width: 100%;
  display: block;
  transition: transform 0.5s ease;
}

.final-image-container:hover .final-image {
  transform: scale(1.05);
}

.final-image-container figcaption {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 15px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 0.9rem;
}

/* ----- Footer Section ----- */
#footer {
  background: var(--secondary);
  color: white;
  padding: 60px 0;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 40px;
}

.footer-logo {
  margin-bottom: 30px;
  text-align: center;
}

.footer-logo img {
  max-width: 180px;
  filter: brightness(0) invert(1);
}

.footer-info {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 40px;
}

.footer-section {
  flex: 1;
  min-width: 200px;
}

.footer-section h3 {
  font-size: 1.3rem;
  margin-bottom: 15px;
  color: var(--primary);
  position: relative;
  padding-bottom: 10px;
}

.footer-section h3::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: 0;
  width: 40px;
  height: 3px;
  background-color: var(--primary);
}

.footer-section p {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #ccc;
}

.portfolio-link {
  text-align: center;
  margin-top: 30px;
}

.portfolio-button {
  display: inline-block;
  background: var(--primary);
  color: white;
  text-decoration: none;
  padding: 12px 25px;
  border-radius: 30px;
  font-weight: bold;
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.portfolio-button:hover {
  background: var(--primary-dark);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

/* ----- Legend ----- */
#fixed-legend {
  position: fixed !important;
  top: 20px !important;
  left: 20px !important;
  z-index: var(--z-overlay) !important;
}

.fixed-legend-content {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 10px;
  box-shadow: var(--shadow-md);
  border: none;
  border-left: 4px solid var(--primary);
  transform: translateY(0);
  transition: transform 0.3s ease;
  animation: slideIn 0.5s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.fixed-legend-content:hover {
  transform: translateY(-3px);
}

.legend-title {
  font-size: 1rem;
  margin-bottom: 12px;
  color: var(--secondary);
}

.toggle-btn {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #eee;
  border-radius: 30px;
  cursor: pointer;
  padding: 8px 12px;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  margin-right: 10px;
  margin-bottom: 8px;
}

.toggle-btn:hover {
  background: white;
  box-shadow: var(--shadow-sm);
  transform: translateY(-2px);
}

.toggle-btn.inactive {
  opacity: 0.5;
}

.toggle-btn svg {
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

.toggle-label {
  font-size: 0.85em;
  color: var(--text);
}

/* ----- Responsive Design ----- */
@media (max-width: 1200px) {
  .intro-title {
    font-size: 4rem;
  }
  
  .intro-content {
    width: 90%;
    padding: 40px;
  }
  
  .infographie-container {
    flex-direction: column;
    align-items: center;
  }
  
  .infographie-text,
  .infographie-image {
    flex: 0 0 100%;
    max-width: 700px;
    width: 100%;
    margin-bottom: 30px;
  }
  
  .sticky-container {
    justify-content: center;
    padding-right: 0;
  }
  
  .sticky-content {
    max-width: 90%;
  }
  
  .final-article {
    flex-direction: column;
  }
  
  .final-text {
    margin-bottom: 30px;
    padding-right: 0;
  }
  
  .final-image-container {
    max-width: 100%;
  }
}

@media (max-width: 900px) {
  h1 {
    font-size: 2.8rem;
  }
  
  h2 {
    font-size: 2rem;
  }
  
  .intro-title {
    font-size: 3.2rem;
  }
  
  .intro-badge {
    font-size: 1rem;
    top: -20px;
    left: -15px;
  }
  
  .intro-content {
    padding: 30px;
  }
  
  #quick-nav {
    right: 10px;
  }
  
  #fixed-legend {
    left: 10px;
    bottom: 10px;
    top: auto;
  }
  
  .fixed-legend-content {
    max-width: calc(100vw - 20px);
  }
  
  .infographie-interactive {
    height: auto;
    padding: 20px;
  }
  
  .bomb-comparison {
    height: auto;
    margin-bottom: 40px;
  }
  
  .blast-radius-comparison {
    height: 300px;
  }
  
  .footer-info {
    flex-direction: column;
    gap: 20px;
  }
}

@media (max-width: 600px) {
  body {
    cursor: auto; /* Restaurer le curseur par défaut sur mobile */
  }
  
  .custom-cursor,
  .custom-cursor-trail {
    display: none;
  }
  
  .intro-title {
    font-size: 2.5rem;
  }
  
  .intro-line-highlight {
    font-size: 120%;
  }
  
  .intro-meta {
    flex-direction: column;
    align-items: center;
    gap: 15px;
  }
  
  .timeline::before {
    left: 20px;
  }
  
  .timeline-item {
    width: 100%;
    padding-left: 50px;
    padding-right: 15px;
    left: 0 !important;
    text-align: left !important;
  }
  
  .timeline-item.left::after,
  .timeline-item.right::after {
    left: 12px;
    right: auto;
  }
  
  .timeline-item.left .timeline-connector,
  .timeline-item.right .timeline-connector {
    left: 25px;
    right: auto;
    width: 20px;
  }
  
  .timeline-item.left .timeline-content::after,
  .timeline-item.right .timeline-content::after {
    left: 0;
    right: auto;
  }
  
  .timeline-item.left .timeline-title::after,
  .timeline-item.right .timeline-title::after {
    left: 0;
    right: auto;
  }
  
  .sticky-content {
    max-width: 100%;
    margin: 10px;
    padding: 20px;
  }
  
  .stat-container {
    flex-direction: column;
    gap: 10px;
  }
  
  .tab-btn {
    padding: 10px;
    font-size: 0.9rem;
  }
  
  .final-quote {
    padding: 15px;
    font-size: 1.1rem;
  }
  
  #progress-container {
    height: 4px;
  }
  
  #quick-nav {
    display: none;
  }
  
  /* Make legends more mobile-friendly */
  #fixed-legend {
    width: calc(100% - 20px);
    text-align: center;
  }
  
  .fixed-legend-content {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .toggle-btn {
    margin: 5px;
  }
}

/* ----- Animation d'apparition générale ----- */
.fade-in {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.fade-in.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ----- Correction pour le menu de navigation et les liens ----- */
#quick-nav a,
.maplibregl-ctrl a {
  color: transparent !important;
  text-decoration: none !important;
}

.maplibregl-ctrl-attrib-inner a {
  color: #333 !important;
}

/* ----- Correction pour la légende ----- */
.toggle-btn {
  cursor: pointer !important;
  user-select: none !important;
}

.toggle-btn.active {
  opacity: 1 !important;
}

.toggle-btn.inactive {
  opacity: 0.5 !important;
}

/* ----- Attention, ces styles concernent le mode sombre (préparés mais non activés) ----- */
.dark-mode {
  --primary: #FF4D4D;
  --primary-light: #FF7777;
  --primary-dark: #CC0000;
  
  --secondary: #F5F5F5;
  --secondary-light: #FFFFFF;
  --secondary-lighter: #EEEEEE;
  
  --background: #121212;
  --background-alt: #1E1E1E;
  
  --text: #F5F5F5;
  --text-light: #CCCCCC;
  --text-lighter: #999999;
  --text-white: #FFFFFF;
}

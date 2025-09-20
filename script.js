document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const garden = document.getElementById('garden');
    const grass = document.getElementById('grass');
    const clearBtn = document.getElementById('clear-btn');
    const autoBtn = document.getElementById('auto-btn');
    const infoBtn = document.getElementById('info-btn');
    const dayNightToggle = document.getElementById('day-night-toggle');
    const stars = document.getElementById('stars');
    const particles = document.getElementById('particles');
    const flowerCounter = document.getElementById('flower-counter');
    const body = document.body;
    const sun = document.querySelector('.sun');
    const moon = document.querySelector('.moon');
    const lightEffect = document.querySelector('.light-effect');
    
    // Variables de estado
    let flowerCount = 0;
    let autoMode = false;
    let autoInterval;
    let isNightMode = false;
    let dayNightCycle = true;
    
    // Tipos de flores disponibles
    const flowerTypes = ['sunflower', 'gardenia', 'rose', 'daisy', 'tulip'];
    
    // Inicializar
    init();
    
    function init() {
        createStars();
        createParticles();
        
        // Event listeners
        grass.addEventListener('click', handleGrassClick);
        clearBtn.addEventListener('click', clearGarden);
        autoBtn.addEventListener('click', toggleAutoMode);
        infoBtn.addEventListener('click', showInfo);
        dayNightToggle.addEventListener('click', toggleDayNightCycle);
        
        // Actualizar el ciclo cada 100ms
        setInterval(updateDayNightCycle, 100);
    }
    
    // Crear estrellas
    function createStars() {
        stars.innerHTML = '';
        for (let i = 0; i < 80; i++) {
            const star = document.createElement('div');
            star.classList.add('star');
            star.style.left = `${Math.random() * 100}%`;
            star.style.top = `${Math.random() * 70}%`;
            star.style.width = `${Math.random() * 2 + 1}px`;
            star.style.height = star.style.width;
            star.style.animationDelay = `${Math.random() * 5}s`;
            star.style.opacity = Math.random() * 0.7 + 0.3;
            stars.appendChild(star);
        }
    }
    
    // Crear partículas
    function createParticles() {
        particles.innerHTML = '';
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            particle.style.width = `${Math.random() * 3 + 1}px`;
            particle.style.height = particle.style.width;
            particle.style.animationDelay = `${Math.random() * 15}s`;
            
            // Hacer algunas partículas de diferentes colores
            if (Math.random() > 0.7) {
                const hue = Math.random() * 360;
                particle.style.background = `hsla(${hue}, 70%, 70%, 0.6)`;
            }
            
            particles.appendChild(particle);
        }
    }
    
    // Controlar el ciclo día/noche con transiciones suaves
    function updateDayNightCycle() {
        if (!dayNightCycle) return;
        
        const sunRect = sun.getBoundingClientRect();
        const moonRect = moon.getBoundingClientRect();
        const gardenRect = garden.getBoundingClientRect();
        
        // Calcular posiciones relativas
        const sunPos = (sunRect.left + sunRect.width/2 - gardenRect.left) / gardenRect.width;
        const moonPos = (moonRect.left + moonRect.width/2 - gardenRect.left) / gardenRect.width;
        
        // Transición gradual basada en la posición
        const transitionFactor = Math.min(1, Math.max(0, (sunPos - 0.7) * 3));
        
        if (sunPos > 0.7 && sunPos < 1 && !isNightMode) {
            // Transición a noche
            body.style.background = `linear-gradient(to bottom, 
                ${interpolateColor('#1e5799', '#0a1931', transitionFactor)}, 
                ${interpolateColor('#2989d8', '#1a1a2e', transitionFactor)})`;
            stars.style.opacity = transitionFactor.toString();
            lightEffect.style.opacity = (0.5 - transitionFactor * 0.2).toString();
        } 
        else if (moonPos > 0.7 && moonPos < 1 && isNightMode) {
            // Transición a día
            body.style.background = `linear-gradient(to bottom, 
                ${interpolateColor('#0a1931', '#1e5799', transitionFactor)}, 
                ${interpolateColor('#1a1a2e', '#2989d8', transitionFactor)})`;
            stars.style.opacity = (1 - transitionFactor).toString();
            lightEffect.style.opacity = (0.3 + transitionFactor * 0.2).toString();
        }
        
        // Cambiar completamente a noche cuando el sol se oculta
        if (sunPos > 1 && !isNightMode) {
            body.classList.add('night');
            stars.style.opacity = '1';
            lightEffect.style.opacity = '0.3';
            isNightMode = true;
        }
        // Cambiar completamente a día cuando la luna se oculta
        else if (moonPos > 1 && isNightMode) {
            body.classList.remove('night');
            stars.style.opacity = '0';
            lightEffect.style.opacity = '0.5';
            isNightMode = false;
        }
    }
    
    // Interpolar entre dos colores
    function interpolateColor(color1, color2, factor) {
        const hex = color => {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        };
        
        const rgb1 = hex(color1);
        const rgb2 = hex(color2);
        
        const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * factor);
        const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * factor);
        const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * factor);
        
        return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
    }
    
    // Alternar ciclo día/noche
    function toggleDayNightCycle() {
        dayNightCycle = !dayNightCycle;
        
        if (dayNightCycle) {
            dayNightToggle.textContent = 'Ciclo Día/Noche: Activado';
            sun.style.animationPlayState = 'running';
            moon.style.animationPlayState = 'running';
        } else {
            dayNightToggle.textContent = 'Ciclo Día/Noche: Desactivado';
            sun.style.animationPlayState = 'paused';
            moon.style.animationPlayState = 'paused';
        }
    }
    
    // Mostrar información sobre las flores
    function showInfo() {
        alert('¡Bienvenido al Jardín de Flores!\n\n• Haz clic en el césped para plantar flores aleatorias\n• Usa el botón "Modo Automático" para plantar flores automáticamente\n• Activa/desactiva el ciclo día/noche con el botón superior derecho\n• Las flores incluyen: Girasoles, Gardenias, Rosas, Margaritas y Tulipanes');
    }
    
    // Manejar clic en el césped
    function handleGrassClick(e) {
        const rect = grass.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        createFlower(x);
    }
    
    // Obtener un tipo de flor aleatorio
    function getRandomFlowerType() {
        return flowerTypes[Math.floor(Math.random() * flowerTypes.length)];
    }
    
    // Función para crear una flor en posición específica - VERSIÓN CORREGIDA
    function createFlower(x) {
        flowerCount++;
        flowerCounter.textContent = `Flores plantadas: ${flowerCount}`;
        
        const flowerType = getRandomFlowerType();
        const flower = document.createElement('div');
        flower.classList.add('flower');
        flower.style.left = `${x}px`;
        
        // Tamaño aleatorio para la flor
        const size = Math.random() * 20 + 30;
        
        // Altura del tallo
        const stemHeight = size * 1.5;
        
        // Tallo
        const stem = document.createElement('div');
        stem.classList.add('stem');
        stem.style.height = `${stemHeight}px`;
        
        // Parte superior de la flor (donde irán los pétalos)
        const flowerTop = document.createElement('div');
        flowerTop.classList.add('flower-top');
        flowerTop.style.width = `${size}px`;
        flowerTop.style.height = `${size}px`;
        flowerTop.style.bottom = `${stemHeight}px`;
        
        // Contenedor de pétalos
        const petalsContainer = document.createElement('div');
        petalsContainer.classList.add('petals-container');
        petalsContainer.style.width = '100%';
        petalsContainer.style.height = '100%';
        
        // Centro de la flor (tamaño proporcional)
        const center = document.createElement('div');
        center.classList.add('center');
        center.classList.add(flowerType);
        center.style.width = `${size * 0.45}px`;
        center.style.height = `${size * 0.45}px`;
        
        // Configurar pétalos según el tipo de flor
        setupFlowerType(petalsContainer, size, flowerType);
        
        // Hojas
        const leafCount = Math.floor(Math.random() * 2) + 2;
        for (let i = 0; i < leafCount; i++) {
            const leaf = document.createElement('div');
            leaf.classList.add('leaf');
            leaf.style.width = `${size / (2 + Math.random())}px`;
            leaf.style.height = `${size / (2 + Math.random())}px`;
            
            const leafPosition = stemHeight * (0.3 + i * 0.2);
            leaf.style.bottom = `${leafPosition}px`;
            
            const rotation = (i % 2 === 0) ? 
                -30 - Math.random() * 10 : 
                30 + Math.random() * 10;
            leaf.style.setProperty('--leaf-rotation', `${rotation}deg`);
            
            if (i % 2 === 0) {
                leaf.style.left = `${60 + Math.random() * 10}%`;
            } else {
                leaf.style.right = `${60 + Math.random() * 10}%`;
            }
            leaf.style.animationDelay = `${0.5 + i * 0.2}s`;
            flower.appendChild(leaf);
        }
        
        // Ensamblar la flor
        flower.appendChild(stem);
        flower.appendChild(flowerTop);
        flowerTop.appendChild(petalsContainer);
        petalsContainer.appendChild(center);
        
        flower.style.bottom = '15%';
        flower.style.opacity = '0';
        flower.style.transform = 'scale(0) translateY(20px)';
        garden.appendChild(flower);
        
        setTimeout(() => {
            flower.style.transition = 'opacity 0.8s, transform 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            flower.style.opacity = '1';
            flower.style.transform = 'scale(1) translateY(0)';
            setTimeout(() => {
                openPetals(petalsContainer);
            }, 300);
        }, 10);
        return flower;
    }
    
    // Función para configurar el tipo de flor - VERSIÓN CORREGIDA
    function setupFlowerType(petalsContainer, size, flowerType) {
        let petalCount, petalDistance, petalSize;

        switch(flowerType) {
            case 'sunflower':
                petalCount = 20;
                petalDistance = size / 2.3;
                petalSize = size > 45 ? size / 1.7 : size / 2.2;
                break;
            case 'gardenia':
                petalCount = 12;
                petalDistance = size / 2.5;
                petalSize = size / 2.8;
                break;
            case 'rose':
                petalCount = 15;
                petalDistance = size / 2.2;
                petalSize = size / 2.5;
                break;
            case 'daisy':
                petalCount = 10;
                petalDistance = size / 2.5;
                petalSize = size / 2.8;
                break;
            case 'tulip':
                petalCount = 6;
                petalDistance = size / 2.2;
                petalSize = size / 2.5;
                break;
            default:
                petalCount = 12;
                petalDistance = size / 2.5;
                petalSize = size / 2.8;
        }

        // Crear pétalos individuales
        for (let i = 0; i < petalCount; i++) {
            const petal = document.createElement('div');
            petal.classList.add('petal');
            petal.classList.add(flowerType);

            // Tamaño del pétalo proporcional al tamaño de la flor
            petal.style.width = `${petalSize}px`;
            petal.style.height = `${petalSize}px`;

            const angle = (i * (360 / petalCount)) * (Math.PI / 180);
            const centerPos = size / 2;
            const rotation = angle * (180/Math.PI);
            petal.style.setProperty('--petal-rotation', `${rotation}deg`);
            petal.style.top = `${centerPos - petalDistance * Math.cos(angle) - petalSize/2}px`;
            petal.style.left = `${centerPos + petalDistance * Math.sin(angle) - petalSize/2}px`;

            petalsContainer.appendChild(petal);
        }
    }
    
    // Animar apertura de pétalos
    function openPetals(petalsContainer) {
        const petals = petalsContainer.querySelectorAll('.petal');
        petals.forEach((petal, i) => {
            setTimeout(() => {
                petal.classList.add('open');
            }, i * 50); // Animación escalonada
        });
    }
    
    // Limpiar jardín
    function clearGarden() {
        const flowers = document.querySelectorAll('.flower');
        flowers.forEach(flower => {
            flower.style.transition = 'opacity 0.5s, transform 0.5s';
            flower.style.opacity = '0';
            flower.style.transform = 'scale(0) translateY(20px)';
            setTimeout(() => flower.remove(), 500);
        });
        
        flowerCount = 0;
        flowerCounter.textContent = `Flores plantadas: ${flowerCount}`;
    }
    
    // Alternar modo automático
    function toggleAutoMode() {
        autoMode = !autoMode;
        
        if (autoMode) {
            autoBtn.textContent = 'Detener Automático';
            autoBtn.classList.add('active');
            
            autoInterval = setInterval(() => {
                const x = Math.random() * grass.offsetWidth;
                createFlower(x);
            }, 1000);
        } else {
            autoBtn.textContent = 'Modo Automático';
            autoBtn.classList.remove('active');
            clearInterval(autoInterval);
        }
    }
});
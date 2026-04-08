// App Logic & SPA Router V2
const App = {
    state: {
        currentProduct: null,
        selectedSize: null,
        selectedColor: null
    },

    init() {
        this.runLoadingScreen();
        this.setupNavigation();
        this.setupScrollEffects();
        this.handleRouting();
        
        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRouting());

        // Footer Year
        document.getElementById('year').textContent = new Date().getFullYear();
    },

    runLoadingScreen() {
        const loader = document.getElementById('loader');
        const progressText = document.getElementById('loading-progress');
        const duration = 2500; // 2.5 seconds (under 3s requirement)
        let  start = null;

        const animateProgress = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(Math.floor((progress / duration) * 100), 100);
            
            progressText.textContent = `${percentage}%`;

            if (progress < duration) {
                requestAnimationFrame(animateProgress);
            } else {
                // Done
                loader.classList.add('hidden');
            }
        };

        requestAnimationFrame(animateProgress);
    },

    setupNavigation() {
        const toggle = document.querySelector('.menu-toggle');
        const nav = document.querySelector('.nav-menu');
        
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('active');
            nav.classList.toggle('active');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                toggle.classList.remove('active');
                nav.classList.remove('active');
            });
        });

        // Add scrolled class to header
        window.addEventListener('scroll', () => {
            const header = document.querySelector('.header');
            if(window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        });
    },

    setupScrollEffects() {
        // Scroll Reveal Overlay
        const revealCb = (entries, observer) => {
            entries.forEach(entry => {
                if(entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };
        this.revealObserver = new IntersectionObserver(revealCb, { threshold: 0.1 });
    },

    applyScrollReveal() {
        document.querySelectorAll('.reveal').forEach(el => this.revealObserver.observe(el));
    },

    handleRouting() {
        const hash = window.location.hash.substring(1) || 'home';
        const routerView = document.getElementById('app-router-view');
        routerView.innerHTML = ''; // Clear current
        
        window.scrollTo(0, 0); // Reset scroll on navigation

        // Routes
        if(hash === 'home') this.renderHome(routerView);
        else if(hash === 'quienes-somos') this.renderQuienesSomos(routerView);
        else if(hash === 'colecciones') this.renderColecciones(routerView);
        else if(hash.startsWith('coleccion/')) this.renderColeccionDetalle(routerView, hash.split('/')[1]);
        else if(hash === 'lookbook') this.renderLookbook(routerView);
        else if(hash.startsWith('producto/')) this.renderProduct(routerView, hash.split('/')[1]);
        else if(hash === 'formas-de-pago') this.renderFormasDePago(routerView);
        else if(hash === 'envios') this.renderEnvios(routerView);
        else if(hash === 'contacto') this.renderContacto(routerView);
        else if(hash === 'politicas') this.renderPoliticas(routerView);
        else this.renderHome(routerView);

        this.applyScrollReveal();
    },

    // --- Views ---

    renderHome(container) {
        container.innerHTML = `
            <!-- 1. HERO -->
            <section class="hero">
                <img src="imagenes/Hero 1.png" alt="DeOne Hero" class="hero-bg" id="parallax-hero">
                <div class="hero-overlay"></div>
                <div class="hero-content reveal">
                    <h1 class="hero-slogan font-heading">DISEÑO<br>DETALLE<br>ESTILO</h1>
                    <a href="#colecciones" class="btn-primary" style="margin-top: 20px;">VER COLECCIONES</a>
                </div>
            </section>

            <!-- 2. CAMISETAS MÁS PEDIDAS -->
            <section class="section">
                <h2 class="section-title reveal">CAMISETAS MÁS PEDIDAS</h2>
                <div class="products-grid reveal">
                    ${storeData.products.slice(0, 6).map(this.createProductCard).join('')}
                </div>
            </section>

            <!-- 3. CALIDAD PREMIUM -->
            <section class="section" style="background: rgba(0,0,0,0.4); border-top: 1px solid rgba(255,90,0,0.1); border-bottom: 1px solid rgba(255,90,0,0.1);">
                <h2 class="section-title reveal" style="font-size: 2.8rem; text-shadow: none;">ESTILO CALLEJERO CON CALIDAD PREMIUM 💯</h2>
                <div class="calidad-grid reveal">
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">100% Algodón Peinado</span></div>
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">Cuello en rib de alta resistencia</span></div>
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">Teñido Reactivo</span></div>
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">Anti-peeling</span></div>
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">Tapacosturas hombro a hombro</span></div>
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">Horma Europea</span></div>
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">Gramaje 180g Premium</span></div>
                    <div class="calidad-item"><span class="calidad-icon">✔</span><span class="calidad-text">Estampado DTF Premium</span></div>
                </div>
            </section>

            <!-- 4. TALLAS PARA TODOS -->
            <section class="section">
                <h2 class="section-title reveal">TALLAS PARA TODOS</h2>
                <div class="reveal" style="text-align: center; color: var(--text-secondary); max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 1.2rem; font-family: var(--font-subtitle);">Fit semi oversize con manga hasta el codo.</p>
                </div>
                <table class="tallas-table reveal">
                    <tr><th>TALLA</th><th>ANCHO</th><th>LARGO</th></tr>
                    <tr><td>S</td><td>54cm</td><td>70cm</td></tr>
                    <tr><td>M</td><td>57cm</td><td>73cm</td></tr>
                    <tr><td>L</td><td>60cm</td><td>76cm</td></tr>
                    <tr><td>XL</td><td>63cm</td><td>79cm</td></tr>
                </table>
            </section>

            <!-- 5. SEPARA TU FAVORITA -->
            <section class="cta-section reveal">
                <h2 class="font-heading" style="font-size: 3rem; margin-bottom: 30px;">NO TE QUEDES SIN LA TUYA</h2>
                <a href="https://wa.me/593995749106?text=Hola,%20quiero%20separar%20una%20camiseta%20DeOne%20🔥" target="_blank" class="btn-primary" style="font-size: 1.5rem; padding: 20px 50px;">
                    SEPARA TU FAVORITA
                </a>
            </section>

            <!-- 6. COLECCIONES DESTACADAS -->
            <section class="section">
                <h2 class="section-title reveal">COLECCIONES DESTACADAS</h2>
                <div class="collections-grid-large reveal">
                    ${storeData.featuredCollections.map((catId, index) => {
                        const cat = storeData.collections.find(c => c.id === catId);
                        const coverImg = storeData.products.find(p => p.collectionId === catId)?.images[0] || 'imagenes/Hero 1.png';
                        // Make the first one large
                        const isLarge = index === 0 ? 'large' : '';
                        return `
                            <div class="collection-card ${isLarge}" onclick="location.hash='#coleccion/${catId}'">
                                <img src="${coverImg}" alt="${cat.name}" loading="lazy">
                                <div class="collection-overlay">
                                    <h3 class="collection-title font-heading">${cat.name}</h3>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>

            <!-- 7. LOOKBOOK PREVIEW -->
            <section class="section">
                <h2 class="section-title reveal">LOOKBOOK RECIENTE</h2>
                <div class="masonry-grid reveal">
                    ${storeData.lookbookImages.slice(0, 5).map(img => `
                        <div class="masonry-item" onclick="location.hash='#lookbook'">
                            <img src="${img}" alt="Lookbook Image" loading="lazy">
                        </div>
                    `).join('')}
                </div>
                <div style="text-align: center; margin-top: 40px;">
                    <a href="#lookbook" class="btn-primary">VER GALERÍA COMPLETA</a>
                </div>
            </section>
        `;

        // Wait to ensure DOM reflects the insertion before parallax bind
        setTimeout(() => {
            const heroBg = document.getElementById('parallax-hero');
            window.addEventListener('scroll', () => {
                if(window.location.hash.includes('home') || window.location.hash === '') {
                    const scrollPosition = window.pageYOffset;
                    if(heroBg && scrollPosition < window.innerHeight) {
                        heroBg.style.transform = `translateY(${scrollPosition * 0.4}px) scale(1.4)`;
                    }
                }
            });
        }, 100);
    },

    renderQuienesSomos(container) {
        container.innerHTML = `
            <div class="text-page reveal">
                <h1 class="font-heading" style="text-transform: uppercase;">Hazlo De One</h1>
                
                <h2>El Origen</h2>
                <p>Nuestra marca fue forjada en las calles de Ecuador. En el asfalto donde el ruido se mezcla con el arte y la vida no se detiene, nace <strong>DeOne</strong> para aquellos que no siguen reglas y marcan su propio camino.</p>
                
                <h2>Qué significa "DeOne"</h2>
                <p>El nombre "DeOne" representa la actitud pura de hacer las cosas al instante, sin dudar. Una respuesta arraigada en nuestra cultura underground, que denota rapidez, disposición y valentía inquebrantable.</p>
                
                <h2>Nuestra Identidad</h2>
                <p>No somos básicos ni copiamos moldes. Manejamos un aesthetic underground y premium porque creemos que la rebeldía también necesita calidad superior. Creamos moda para hablar sin decir una palabra.</p>
                
                <h2>Visión</h2>
                <p>Llevar el Fresh Style a todos los rincones, consolidándonos como el referente central del Streetwear nacional e internacional.</p>
                
                <h3 class="font-subtitle" style="font-size: 2rem; color: var(--accent-primary); margin-top: 50px; text-align: center;">Hazlo De One</h3>
            </div>
        `;
    },

    renderColecciones(container) {
        container.innerHTML = `
            <section class="section" style="padding-top: 150px;">
                <h1 class="section-title reveal">TODAS LAS COLECCIONES</h1>
                <div class="collections-grid-large reveal">
                    ${storeData.collections.map(cat => {
                        const coverImg = storeData.products.find(p => p.collectionId === cat.id)?.images[0] || 'imagenes/Hero 1.png';
                        return `
                            <div class="collection-card" onclick="location.hash='#coleccion/${cat.id}'">
                                <img src="${coverImg}" alt="${cat.name}">
                                <div class="collection-overlay">
                                    <h3 class="collection-title font-heading">${cat.name}</h3>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </section>
        `;
    },

    renderColeccionDetalle(container, catId) {
        const cat = storeData.collections.find(c => c.id === catId);
        const products = storeData.products.filter(p => p.collectionId === catId);
        
        container.innerHTML = `
            <section class="section" style="padding-top: 150px;">
                <a href="#colecciones" style="color: var(--text-secondary);">&larr; Volver a Colecciones</a>
                <h1 class="section-title reveal" style="text-align: left; margin-top: 20px;">COLECCIÓN: <br><span style="color: var(--accent-primary);">${cat.name}</span></h1>
                
                ${products.length > 0 ? `
                    <div class="products-grid reveal">
                        ${products.map(this.createProductCard).join('')}
                    </div>
                ` : `
                    <p style="font-size: 1.2rem; color: var(--text-secondary); margin-top: 50px;">Aún no hay productos en esta colección.</p>
                `}
            </section>
        `;
    },

    renderLookbook(container) {
        container.innerHTML = `
            <section class="section" style="padding-top: 150px;">
                <h1 class="section-title reveal">LOOKBOOK</h1>
                <p class="reveal font-subtitle" style="text-align: center; margin-bottom: 50px; color: var(--text-secondary); font-size: 1.5rem;">
                    Editorial urbana • Fotos y mockups
                </p>
                <div class="masonry-grid reveal">
                    ${storeData.lookbookImages.map(img => `
                        <div class="masonry-item">
                            <img src="${img}" alt="Lookbook Image" loading="lazy">
                        </div>
                    `).join('')}
                </div>
            </section>
        `;
    },

    renderProduct(container, productId) {
        const product = storeData.products.find(p => p.id === productId);
        if(!product) {
            container.innerHTML = '<h1 style="text-align:center; padding: 200px;">Producto no encontrado</h1>';
            return;
        }

        this.state.currentProduct = product;
        this.state.selectedSize = product.sizes[0];
        this.state.selectedColor = product.colors[0];

        container.innerHTML = `
            <section class="section product-detail-section reveal">
                <div class="product-images-gallery">
                    <img src="${product.images[0]}" alt="${product.name}" class="product-main-view" id="product-main-img">
                    <div class="product-thumbs-grid">
                        ${product.images.map((img, i) => `
                            <img src="${img}" class="${i===0 ? 'active' : ''}" onclick="App.setMainImage('${img}', this)">
                        `).join('')}
                    </div>
                </div>
                
                <div class="product-specs">
                    <h1 class="spec-title font-heading">${product.name}</h1>
                    <div class="spec-price">$${product.price.toFixed(2)}</div>
                    
                    <div style="color:var(--text-secondary); font-family: var(--font-subtitle); margin-bottom: 30px; font-size: 1.2rem;">
                        🔥 Últimas <span style="color:var(--accent-primary);">${product.stock}</span> unidades
                    </div>
                    
                    <div class="selector-box">
                        <h4 class="font-subtitle">TALLA:</h4>
                        <div class="options-flex">
                            ${product.sizes.map(size => `
                                <button class="opt-btn ${size === this.state.selectedSize ? 'active' : ''}" 
                                        onclick="App.selectOption('size', '${size}', this)">${size}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="selector-box">
                        <h4 class="font-subtitle">COLOR:</h4>
                        <div class="options-flex">
                            ${product.colors.map(color => `
                                <button class="opt-btn ${color === this.state.selectedColor ? 'active' : ''}" 
                                        onclick="App.selectOption('color', '${color}', this)">${color}</button>
                            `).join('')}
                        </div>
                    </div>
                    
                    <button class="btn-primary" style="width: 100%; padding: 25px; font-size: 1.3rem; margin-top: 20px;" onclick="App.triggerWhatsApp()">
                        LA QUIERO DE ONE 🔥
                    </button>
                    
                </div>
            </section>
        `;
    },

    renderFormasDePago(container) {
        container.innerHTML = `
            <div class="text-page reveal">
                <h1 class="font-heading">Formas de Pago</h1>
                <p style="text-align:center; font-family: var(--font-subtitle); font-size:1.5rem;">Transacciona seguro con nosotros.</p>
                
                <div class="info-grid">
                    <div class="info-box">
                        <div class="box-icon">🏦</div>
                        <h3 class="font-subtitle">Transferencia</h3>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Banco Pichincha</p>
                    </div>
                    <div class="info-box">
                        <div class="box-icon">📱</div>
                        <h3 class="font-subtitle">PayPhone</h3>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Cualquier tarjeta Visa/MC</p>
                    </div>
                    <div class="info-box">
                        <div class="box-icon">💵</div>
                        <h3 class="font-subtitle">Contra Entrega</h3>
                        <p style="margin-top: 10px; font-size: 0.9rem;">Zonas de cobertura limitadas</p>
                    </div>
                </div>
            </div>
        `;
    },

    renderEnvios(container) {
        container.innerHTML = `
            <div class="text-page reveal" style="text-align: center;">
                <h1 class="font-heading">Fletes y Envíos</h1>
                <div style="font-size: 4rem; color: var(--accent-primary); margin: 30px 0;">📦</div>
                
                <h2 class="font-subtitle" style="color: var(--accent-primary);">Servientrega a nivel nacional</h2>
                <p>Nuestros envíos se procesan rápidamente para que recibas tu estilo a tiempo:</p>
                
                <div style="text-align:left; background: rgba(255,255,255,0.05); padding: 40px; border-left: 4px solid var(--accent-primary); margin-top: 40px;">
                    <p><strong>Tiempo estimado:</strong> 1 a 2 días laborables dependiendo de tu ubicación geográfica en el Ecuador.</p>
                    <p><strong>Costo:</strong> El costo puede variar según la ciudad. Al contactarnos en WhatsApp cotizamos el envío exacto.</p>
                    <p>Te proporcionaremos inmediatamente una guía de rastreo para que monitorees y garantices una entrega segura.</p>
                </div>
            </div>
        `;
    },

    renderContacto(container) {
        container.innerHTML = `
            <div class="text-page reveal" style="text-align: center;">
                <h1 class="font-heading">Contacto</h1>
                <p>Ubicados en Quito, orgullosamente ecuatorianos.</p>
                
                <div style="margin: 60px 0;">
                    <a href="https://wa.me/593995749106" target="_blank" class="btn-primary" style="font-size: 1.5rem; padding: 20px 40px; background: #25d366; border-color: #25d366; color: #fff;">
                       WhatsApp Directo (0995749106)
                    </a>
                </div>
            </div>
        `;
    },

    renderPoliticas(container) {
        container.innerHTML = `
            <div class="text-page reveal">
                <h1 class="font-heading">Términos y Políticas</h1>
                
                <h2 class="font-subtitle" style="color: var(--accent-primary);">1. Cambios</h2>
                <p>Puedes solicitar un cambio por talla dentro de los primeros 7 días posteriores a la recepción. La prenda no debe tener uso, y conservando sus tags adheridos.</p>
                
                <h2 class="font-subtitle" style="color: var(--accent-primary);">2. Devoluciones</h2>
                <p>Nuestra política corporativa no permite reembolsos en efectivo ni devoluciones de dinero bajo ninguna circunstancia. Puedes escoger otro producto de la colección por el mismo valor.</p>
                
                <h2 class="font-subtitle" style="color: var(--accent-primary);">3. Privacidad</h2>
                <p>Tu información de compras no será comercializada. Los datos de WhatsApp se manejan exclusivamente para la facturación y el envío.</p>
            </div>
        `;
    },

    // --- Helpers ---

    createProductCard(product) {
        const mainImg = product.images[0];
        const hoverImg = product.images[1] || mainImg;
        return `
            <div class="product-card" onclick="location.hash='#producto/${product.id}'">
                <div class="product-image-container">
                    <img src="${mainImg}" alt="${product.name}" class="img-main" loading="lazy">
                    <img src="${hoverImg}" alt="${product.name} Hover" class="img-hover" loading="lazy">
                    <div class="product-stock">🔥 ÚLTIMAS ${product.stock}</div>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <button class="btn-primary">LA QUIERO DE ONE</button>
                </div>
            </div>
        `;
    },

    setMainImage(src, thumbElement) {
        document.getElementById('product-main-img').src = src;
        document.querySelectorAll('.product-thumbs-grid img').forEach(i => i.classList.remove('active'));
        thumbElement.classList.add('active');
    },

    selectOption(type, val, btnEl) {
        if(type === 'size') this.state.selectedSize = val;
        if(type === 'color') this.state.selectedColor = val;
        
        btnEl.parentNode.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    },

    triggerWhatsApp() {
        const prod = this.state.currentProduct;
        const phone = "593995749106";
        const message = `Hola, quiero esta prenda DeOne 🔥%0A%0AModelo: ${prod.name}%0ATalla: ${this.state.selectedSize}%0AColor: ${this.state.selectedColor}%0APrecio: $${prod.price.toFixed(2)}`;
        const url = `https://wa.me/${phone}?text=${message}`;
        window.open(url, '_blank');
    }
};

// Start application
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

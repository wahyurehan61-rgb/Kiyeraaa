(function(){
    const book = document.getElementById('book');
    const bookWrap = document.getElementById('book-wrap');
    const magicWindow = document.getElementById('magic-window');
    const dimOverlay = document.getElementById('dim-overlay');

    /* ---------- BOOK TOGGLE MECHANISM ---------- */
    book.addEventListener('click', () => {
        if (!book.classList.contains('is-open')) {
            book.classList.add('is-open');
            // Spawn magical dust particles rising on open
            setTimeout(spawnCreaseParticles, 500);
        }
    });

    /* ---------- PARTICLE EFFECTS (Book Crease Dust) ---------- */
    function spawnCreaseParticles() {
        const pages = document.getElementById('book-pages');
        if (!pages) return;
        
        for (let i = 0; i < 28; i++) {
            const p = document.createElement('div');
            p.className = 'glow-particle';
            
            // Start around the center crease area
            p.style.left = (Math.random() * 30 + 35) + 'px'; 
            p.style.top = (Math.random() * 420 + 50) + 'px';
            
            // Random direction drift offsets (using CSS custom variables)
            const dx = (Math.random() * 220 + 40) + 'px';
            const dy = (Math.random() * -320 - 60) + 'px';
            p.style.setProperty('--dx', dx);
            p.style.setProperty('--dy', dy);
            
            p.style.animationDelay = (Math.random() * 1.2) + 's';
            pages.appendChild(p);
            
            // Auto clean-up
            setTimeout(() => { p.remove(); }, 4800);
        }
    }

    /* ---------- WINDOW SEAMLESS TRANSITION ---------- */
    magicWindow.addEventListener('click', (e) => {
        // Prevent event from bubbling and closing/toggling book again
        e.stopPropagation();
        
        if (!book.classList.contains('is-open')) return;

        // Step 1: Lock views & start zooming book into the frame
        bookWrap.classList.add('zoom-transition');
        dimOverlay.classList.add('active');

        // Play synthetic transition wave swell sound
        playTransitionSwell();

        // Step 2: Spawn magical night stars across the dimming screen
        spawnOverlayStars();

        // Step 3: Create and display loading text
        const loader = document.createElement('div');
        loader.className = 'loader-wrap';
        loader.innerHTML = `
            <span class="loader-star">⭐</span>
            <p class="loader-text">Beginning the Journey...</p>
        `;
        document.body.appendChild(loader);

        setTimeout(() => {
            loader.classList.add('active');
        }, 1200);

        // Step 4: Seamless redirect to night scene
        setTimeout(() => {
            window.location.href = "birthday-night.html?transition=zoom-in";
        }, 3400);
    });

    /* ---------- WEB AUDIO API TRANSITION SOUND GENERATOR ---------- */
    function playTransitionSwell() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();
            
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(90, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(360, ctx.currentTime + 3.2);
            
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(140, ctx.currentTime);
            filter.frequency.exponentialRampToValueAtTime(1100, ctx.currentTime + 3.2);
            
            gain.gain.setValueAtTime(0, ctx.currentTime);
            gain.gain.linearRampToValueAtTime(0.42, ctx.currentTime + 1.6);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);
            
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 3.2);
        } catch (err) {
            console.warn("Audio Context transition swell blocked/unsupported:", err);
        }
    }

    /* ---------- SPAWN STARS DURING TRANSITION ---------- */
    function spawnOverlayStars() {
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            // Style properties matching page 2 starry layout
            star.style.position = 'absolute';
            const s = (Math.random() * 1.5 + 1.2);
            star.style.width = s + 'px';
            star.style.height = s + 'px';
            star.style.backgroundColor = '#ffffff';
            star.style.borderRadius = '50%';
            star.style.left = (Math.random() * 100) + 'vw';
            star.style.top = (Math.random() * 100) + 'vh';
            star.style.opacity = '0';
            star.style.transition = 'opacity 1.8s ease-in-out';
            star.style.boxShadow = '0 0 5px rgba(255, 255, 255, 0.8)';
            star.style.zIndex = '12';
            
            dimOverlay.appendChild(star);

            // Stagger fade-in timing
            setTimeout(() => {
                star.style.opacity = (Math.random() * 0.5 + 0.35);
            }, Math.random() * 1200 + 400);
        }
    }

    /* ---------- CHECK REVERSE ENTRY PARAMETER ---------- */
    window.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('back') === 'true') {
            // Apply initial transition override styles
            dimOverlay.classList.add('active');
            book.classList.add('is-open');
            bookWrap.style.transition = 'none';
            bookWrap.style.transform = 'scale(2.8) translateY(12%)';
            bookWrap.style.opacity = '0';
            bookWrap.style.filter = 'blur(8px)';
            
            // Trigger zoom-out sequence next frame
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    bookWrap.style.transition = 'transform 2.2s cubic-bezier(0.25, 1, 0.5, 1), filter 2.2s cubic-bezier(0.25, 1, 0.5, 1), opacity 2.2s cubic-bezier(0.25, 1, 0.5, 1)';
                    bookWrap.style.transform = 'translateY(-20px)';
                    bookWrap.style.opacity = '1';
                    bookWrap.style.filter = 'blur(0)';
                    
                    dimOverlay.style.transition = 'opacity 2.4s cubic-bezier(0.25, 1, 0.5, 1)';
                    dimOverlay.classList.remove('active');
                });
            });
            
            // Clean up override transition rules
            setTimeout(() => {
                bookWrap.style.transition = '';
                bookWrap.style.transform = '';
                bookWrap.style.opacity = '';
                bookWrap.style.filter = '';
                dimOverlay.style.transition = '';
            }, 2500);
        }
    });

})();

document.addEventListener("DOMContentLoaded", () => {
    
    /* === 1. INTEGRAÇÃO DA SIMULAÇÃO 3D === */
    const btnMotor = document.getElementById('btn-motor');
    const btnFreio = document.getElementById('btn-freio');
    const sliderVel = document.getElementById('slider-vel');
    const sliderIma = document.getElementById('slider-ima');
    const rpmDisplay = document.getElementById('rpm-display');
    const statusDisplay = document.getElementById('status-display');

    btnMotor.addEventListener('click', () => {
        window.SimFisica.motorLigado = !window.SimFisica.motorLigado;
        if (window.SimFisica.motorLigado) {
            btnMotor.textContent = "Desligar Motor";
            btnMotor.classList.add('outline');
            statusDisplay.textContent = "Motor em Funcionamento";
            statusDisplay.style.color = "var(--neon-blue)";
        } else {
            btnMotor.textContent = "Iniciar Motor";
            btnMotor.classList.remove('outline');
            statusDisplay.textContent = "Motor Desligado";
            statusDisplay.style.color = "var(--text-muted)";
        }
    });

    btnFreio.addEventListener('click', () => {
        window.SimFisica.freioLigado = !window.SimFisica.freioLigado;
        if (window.SimFisica.freioLigado) {
            btnFreio.textContent = "Desativar Freio";
            btnFreio.style.background = "var(--alert-color)";
            btnFreio.style.color = "white";
        } else {
            btnFreio.textContent = "Ativar Freio";
            btnFreio.style.background = "transparent";
            btnFreio.style.color = "var(--alert-color)";
        }
    });

    sliderVel.addEventListener('input', (e) => {
        // Converte escala do slider (0-100) para radianos por frame
        window.SimFisica.velDesejada = e.target.value / 200; 
    });

    sliderIma.addEventListener('input', (e) => {
        // Escala percentual (0.0 a 1.0)
        window.SimFisica.intensidadeIma = e.target.value / 100;
    });

    // Atualiza telemetria no HTML
    setInterval(() => {
        const rpm = Math.floor(window.SimFisica.velAtual * 1500); // Fator visual para RPM
        rpmDisplay.textContent = rpm;
    }, 100);


    /* === 2. SISTEMA DE SLIDES === */
    const modalSlides = document.getElementById('modal-slides');
    const btnAbrirSlides = document.getElementById('btn-abrir-slides');
    const btnFecharSlides = document.getElementById('btn-fechar-slides');
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const slideCounter = document.getElementById('slide-counter');
    
    let currentSlide = 0;

    function renderSlide() {
        slides.forEach((s, i) => {
            s.classList.remove('active');
            if (i === currentSlide) s.classList.add('active');
        });
        slideCounter.textContent = `${currentSlide + 1} / ${slides.length}`;
    }

    btnAbrirSlides.addEventListener('click', () => {
        modalSlides.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        currentSlide = 0;
        renderSlide();
    });

    btnFecharSlides.addEventListener('click', () => {
        modalSlides.classList.add('hidden');
        document.body.style.overflow = 'auto';
    });

    btnNext.addEventListener('click', () => { if (currentSlide < slides.length - 1) { currentSlide++; renderSlide(); } });
    btnPrev.addEventListener('click', () => { if (currentSlide > 0) { currentSlide--; renderSlide(); } });

    document.addEventListener('keydown', (e) => {
        if (!modalSlides.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') { if (currentSlide < slides.length - 1) { currentSlide++; renderSlide(); } }
            if (e.key === 'ArrowLeft') { if (currentSlide > 0) { currentSlide--; renderSlide(); } }
            if (e.key === 'Escape') btnFecharSlides.click();
        }
    });


    /* === 3. VISUALIZADOR DE PDF === */
    const btnsPdf = document.querySelectorAll('.btn-view-pdf');
    const iframePdf = document.getElementById('iframe-pdf');

    btnsPdf.forEach(btn => {
        btn.addEventListener('click', () => {
            iframePdf.src = btn.getAttribute('data-pdf');
            btnsPdf.forEach(b => b.classList.add('outline'));
            btn.classList.remove('outline');
        });
    });


    /* === 4. GALERIA LIGHTBOX === */
    const images = document.querySelectorAll('.img-thumb');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeLightbox = document.getElementById('close-lightbox');

    images.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.remove('hidden');
        });
    });

    closeLightbox.addEventListener('click', () => lightbox.classList.add('hidden'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.add('hidden'); });
});

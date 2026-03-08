document.addEventListener("DOMContentLoaded", () => {
    
    // --- LÓGICA DA SIMULAÇÃO DO FREIO ---
    const disco = document.getElementById('disco');
    const btnFreio = document.getElementById('btn-freio');
    const ima = document.getElementById('ima');
    
    let rotacao = 0;
    let velocidade = 15; // Velocidade inicial (graus por frame)
    let freioAtivo = false;
    const velocidadeMaxima = 15;

    function animarDisco() {
        // Se o freio estiver ativo, aplica fricção (desacelera)
        if (freioAtivo && velocidade > 0) {
            velocidade -= 0.1; // Força de frenagem
            if (velocidade < 0) velocidade = 0;
        } 
        // Se o freio estiver solto e não atingiu a vel máx, acelera de volta
        else if (!freioAtivo && velocidade < velocidadeMaxima) {
            velocidade += 0.05; 
        }

        rotacao += velocidade;
        disco.style.transform = `rotate(${rotacao}deg)`;
        
        // Loop contínuo da animação nativa do navegador
        requestAnimationFrame(animarDisco);
    }

    // Inicia a animação assim que a página carrega
    animarDisco();

    // Controle do Botão de Freio
    btnFreio.addEventListener('click', () => {
        freioAtivo = !freioAtivo;
        
        if (freioAtivo) {
            btnFreio.innerText = "Desativar Eletroímã";
            btnFreio.style.backgroundColor = "#ff3366";
            btnFreio.style.borderColor = "#ff3366";
            btnFreio.style.color = "#fff";
            ima.classList.add('ativo');
            ima.innerText = "Campo Magnético (ON)";
        } else {
            btnFreio.innerText = "Ativar Freio Eletromagnético";
            btnFreio.style.backgroundColor = "transparent";
            btnFreio.style.borderColor = "var(--primary-color)";
            btnFreio.style.color = "var(--primary-color)";
            ima.classList.remove('ativo');
            ima.innerText = "Campo Magnético (OFF)";
        }
    });


    // --- LÓGICA DO SISTEMA DE SLIDES ---
    const sectionSlides = document.getElementById('slides');
    const btnAbrirSlides = document.querySelectorAll('a[href="#slides"]');
    const btnFecharSlides = document.getElementById('btn-fechar-slides');
    const slides = document.querySelectorAll('.slide');
    const btnPrev = document.getElementById('prev-slide');
    const btnNext = document.getElementById('next-slide');
    const contadorSlide = document.getElementById('contador-slide');
    
    let slideAtual = 0;

    function atualizarSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('ativa');
            if (index === slideAtual) {
                slide.classList.add('ativa');
            }
        });
        contadorSlide.innerText = `${slideAtual + 1} / ${slides.length}`;
    }

    function proximoSlide() {
        if (slideAtual < slides.length - 1) {
            slideAtual++;
            atualizarSlide();
        }
    }

    function slideAnterior() {
        if (slideAtual > 0) {
            slideAtual--;
            atualizarSlide();
        }
    }

    // Eventos dos botões de slide
    btnNext.addEventListener('click', proximoSlide);
    btnPrev.addEventListener('click', slideAnterior);

    // Abrir apresentação
    btnAbrirSlides.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            sectionSlides.style.display = 'flex';
            document.body.style.overflow = 'hidden'; // Impede rolagem da página por trás
        });
    });

    // Fechar apresentação
    btnFecharSlides.addEventListener('click', () => {
        sectionSlides.style.display = 'none';
        document.body.style.overflow = 'auto'; // Devolve a rolagem
    });

    // Navegação por teclado
    document.addEventListener('keydown', (e) => {
        if (sectionSlides.style.display === 'flex') {
            if (e.key === 'ArrowRight') proximoSlide();
            if (e.key === 'ArrowLeft') slideAnterior();
            if (e.key === 'Escape') btnFecharSlides.click();
        }
    });
});

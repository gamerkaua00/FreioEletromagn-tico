window.SimFisica = { motorLigado: false, freioLigado: false, velDesejada: 0, intensidadeIma: 0, velAtual: 0 };

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('canvas-3d');
    if(!container) return;

    // Cena, Câmera e Renderizador
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 4, 12);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Iluminação
    const light = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(light);
    const pointLight = new THREE.PointLight(0x00e5ff, 1.5);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // Grupo do Motor (Gira tudo que está acoplado ao eixo)
    const rotorGroup = new THREE.Group();
    scene.add(rotorGroup);

    // 1. Carcaça do Motor Trifásico (Fixa)
    const motorGeo = new THREE.CylinderGeometry(2, 2, 4, 32);
    motorGeo.rotateZ(Math.PI / 2);
    const motorMat = new THREE.MeshStandardMaterial({ color: 0x111122, metalness: 0.5, roughness: 0.6 });
    const motorBody = new THREE.Mesh(motorGeo, motorMat);
    motorBody.position.set(-2, 0, 0);
    scene.add(motorBody);

    // 2. Eixo (Gira)
    const eixoGeo = new THREE.CylinderGeometry(0.3, 0.3, 8, 16);
    eixoGeo.rotateZ(Math.PI / 2);
    const eixoMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8 });
    const eixo = new THREE.Mesh(eixoGeo, eixoMat);
    rotorGroup.add(eixo);

    // 3. Disco Metálico de Frenagem (Gira)
    const discoGeo = new THREE.CylinderGeometry(3, 3, 0.3, 64);
    discoGeo.rotateZ(Math.PI / 2);
    const discoMat = new THREE.MeshStandardMaterial({ color: 0xc0a080, metalness: 0.9, roughness: 0.3 }); // Cor de cobre/alumínio
    const disco = new THREE.Mesh(discoGeo, discoMat);
    disco.position.set(3, 0, 0); // Posicionado na ponta do eixo
    rotorGroup.add(disco);
    
    // Marca visual no disco para ver a rotação
    const marcaGeo = new THREE.BoxGeometry(0.4, 2.8, 0.4);
    const marcaMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const marca = new THREE.Mesh(marcaGeo, marcaMat);
    marca.position.set(3, 0, 1.5);
    rotorGroup.add(marca);

    // 4. Eletroímã / Freio (Fixo, mas se aproxima do disco)
    const imaGeo = new THREE.BoxGeometry(1.5, 2, 2);
    const imaMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const ima = new THREE.Mesh(imaGeo, imaMat);
    ima.position.set(3, 2.5, 0); // Acima do disco
    scene.add(ima);

    // Animação
    function animate() {
        requestAnimationFrame(animate);

        // Movimento do eletroímã baseado no estado do freio
        const imaDestinoY = window.SimFisica.freioLigado ? 1.8 : 3.5;
        ima.position.y += (imaDestinoY - ima.position.y) * 0.1; // Suavização

        // Dinâmica do Motor
        if (window.SimFisica.motorLigado) {
            // Acelera até a velocidade alvo do slider
            if (window.SimFisica.velAtual < window.SimFisica.velDesejada) {
                window.SimFisica.velAtual += 0.005;
            } else {
                window.SimFisica.velAtual -= 0.005;
            }
        } else {
            // Desligado: perde velocidade por atrito natural
            if (window.SimFisica.velAtual > 0) window.SimFisica.velAtual -= 0.001;
        }

        // FRENAGEM (Correntes de Foucault)
        if (window.SimFisica.freioLigado && window.SimFisica.velAtual > 0) {
            // A força de frenagem depende da velocidade atual e da intensidade do campo
            const forcaFrenagem = (window.SimFisica.velAtual * window.SimFisica.intensidadeIma) * 0.03;
            window.SimFisica.velAtual -= forcaFrenagem;
        }

        if (window.SimFisica.velAtual < 0.001) window.SimFisica.velAtual = 0;

        // Aplica rotação ao grupo (eixo + disco)
        rotorGroup.rotation.x += window.SimFisica.velAtual;

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});

// Variáveis Globais para integração com script.js
window.simTelemetry = {
    currentSpeed: 0,
    isMotorOn: false,
    magnetIntensity: 0 // 0 a 100
};

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('three-container');
    if(!container) return;

    // 1. Configuração Básica da Cena
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // 2. Iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x00f3ff, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // 3. Objetos 3D
    // Disco de Alumínio
    const diskGeometry = new THREE.CylinderGeometry(3, 3, 0.2, 64);
    const diskMaterial = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.8, roughness: 0.4 });
    const disk = new THREE.Mesh(diskGeometry, diskMaterial);
    scene.add(disk);

    // Detalhe no disco para visualizar a rotação
    const markGeometry = new THREE.BoxGeometry(3, 0.25, 0.2);
    const markMaterial = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const mark = new THREE.Mesh(markGeometry, markMaterial);
    mark.position.x = 1.5;
    disk.add(mark);

    // Eletroímã (Cubo Escuro)
    const magnetGeometry = new THREE.BoxGeometry(1.5, 1, 2);
    const magnetMaterial = new THREE.MeshStandardMaterial({ color: 0x222222 });
    const magnet = new THREE.Mesh(magnetGeometry, magnetMaterial);
    magnet.position.set(2, 0.8, 0); // Posicionado próximo à borda do disco
    scene.add(magnet);

    // Efeito Visual do Campo Magnético (Partículas Translúcidas)
    const fieldGeometry = new THREE.CylinderGeometry(0.8, 0.8, 1.5, 32);
    const fieldMaterial = new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0 });
    const magneticField = new THREE.Mesh(fieldGeometry, fieldMaterial);
    magneticField.position.set(2, 0, 0);
    scene.add(magneticField);

    // 4. Lógica de Física Simplificada (Animação)
    let baseSpeed = 0;

    function animate() {
        requestAnimationFrame(animate);

        // Atualiza intensidade do ímã a partir da UI
        const magnetPower = window.simTelemetry.magnetIntensity / 100;
        
        // Efeito visual: o campo brilha mais quando o ímã está forte
        magneticField.material.opacity = magnetPower * 0.5;
        
        // Dinâmica de Rotação
        if (window.simTelemetry.isMotorOn) {
            // Motor tenta manter a velocidade definida no slider base
            const targetSpeed = document.getElementById('speed-slider').value / 1000;
            if (baseSpeed < targetSpeed) baseSpeed += 0.001; // Aceleração
            if (baseSpeed > targetSpeed) baseSpeed -= 0.001;
        } else {
            // Motor desligado: atrito natural mínimo
            if (baseSpeed > 0) baseSpeed -= 0.0001;
        }

        // FRENAGEM ELETROMAGNÉTICA (Correntes de Foucault)
        // A força de frenagem é proporcional à velocidade e à intensidade do campo
        if (baseSpeed > 0 && magnetPower > 0) {
            const eddyCurrentBrakeForce = (baseSpeed * magnetPower) * 0.05;
            baseSpeed -= eddyCurrentBrakeForce;
        }

        if (baseSpeed < 0) baseSpeed = 0; // Impede rodar ao contrário

        // Aplica rotação
        disk.rotation.y += baseSpeed;
        
        // Atualiza a variável global para o gráfico ler
        window.simTelemetry.currentSpeed = Math.round(baseSpeed * 10000);

        renderer.render(scene, camera);
    }

    animate();

    // Ajuste de redimensionamento da janela
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
});

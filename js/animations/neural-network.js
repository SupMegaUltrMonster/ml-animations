let neuralNetAnim = null;

export function initNeuralNetwork() {
    const canvas = document.getElementById('neural-network-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    const layers = [4, 6, 5, 2];
    const layerX = layers.map((_, i) => 80 + (i / (layers.length - 1)) * (width - 160));
    
    let neurons = [];
    let connections = [];
    
    layers.forEach((count, layerIdx) => {
        const spacing = Math.min(60, (height - 80) / count);
        const startY = height / 2 - (count - 1) * spacing / 2;
        
        for (let i = 0; i < count; i++) {
            neurons.push({
                x: layerX[layerIdx],
                y: startY + i * spacing,
                layer: layerIdx,
                radius: 8,
                activated: false,
                pulsePhase: 0
            });
        }
    });
    
    for (let i = 0; i < neurons.length; i++) {
        for (let j = 0; j < neurons.length; j++) {
            if (neurons[j].layer === neurons[i].layer + 1) {
                connections.push({
                    from: i,
                    to: j,
                    active: false,
                    progress: 0
                });
            }
        }
    }
    
    neuralNetAnim = { canvas, ctx, neurons, connections, layerX };
    
    gsap.timeline()
        .then(() => {
            let tl = gsap.timeline();
            
            neurons.forEach((n, idx) => {
                tl.to(n, { opacity: 1, duration: 0 }, idx * 0.03);
            });
            
            neurons.forEach((n, idx) => {
                tl.to(n, {
                    scale: 1,
                    duration: 0.4,
                    ease: 'back.out(1.7)'
                }, idx * 0.05);
            });
            
            tl.then(() => {
                let signalTl = gsap.timeline({ repeat: -1, yoyo: true });
                
                connections.forEach((conn, idx) => {
                    signalTl.to(conn, {
                        active: true,
                        progress: 1,
                        duration: 0.3,
                        ease: 'power1.inOut'
                    }, idx * 0.02);
                });
                
                neurons.forEach((n, idx) => {
                    signalTl.to(n, {
                        activated: true,
                        duration: 0.2
                    }, idx * 0.04);
                });
            });
        })
        .call(() => {
            let drawTl = gsap.timeline({ repeat: -1 });
            drawTl.add(updateLoop());
        });
}

function updateLoop() {
    if (!neuralNetAnim) return;
    const { ctx, neurons, connections, canvas } = neuralNetAnim;
    
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    
    connections.forEach(conn => {
        const from = neurons[conn.from];
        const to = neurons[conn.to];
        
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, `rgba(79, 70, 229, ${0.1 + conn.progress * 0.4})`);
        gradient.addColorStop(1, `rgba(79, 70, 229, ${0.1 + conn.progress * 0.4})`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.5;
        ctx.stroke();
    });
    
    neurons.forEach(n => {
        if (n.activated) {
            n.pulsePhase += 0.05;
            const pulse = Math.sin(n.pulsePhase) * 0.3 + 0.7;
            
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.radius + 6, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(79, 70, 229, ${0.15 * pulse})`;
            ctx.fill();
        }
        
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.activated ? '#4f46e5' : '#e5e7eb';
        ctx.fill();
        ctx.strokeStyle = n.activated ? '#4f46e5' : '#d1d5db';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
    
    requestAnimationFrame(updateLoop);
}

export function resetNeuralNetwork() {
    if (neuralNetAnim) {
        neuralNetAnim.neurons.forEach(n => {
            n.activated = false;
            n.pulsePhase = 0;
        });
        neuralNetAnim.connections.forEach(c => {
            c.active = false;
            c.progress = 0;
        });
        const { ctx, canvas } = neuralNetAnim;
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    }
}

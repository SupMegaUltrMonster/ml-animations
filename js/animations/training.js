let trainingAnim = null;

export function initTraining() {
    const canvas = document.getElementById('training-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 50;
    
    let epochs = [];
    let currentEpoch = 0;
    let lossCurve = [];
    let animating = false;
    
    trainingAnim = { canvas, ctx, width, height, padding, epochs, currentEpoch, lossCurve, animating };
    
    drawGraph();
    
    gsap.timeline().then(() => {
        let tl = gsap.timeline({ repeat: false });
        
        for (let i = 0; i <= 50; i++) {
            let epoch = i;
            let loss = Math.exp(-epoch * 0.1) * 0.8 + 0.1 + Math.sin(epoch * 0.3) * 0.05;
            
            tl.call(() => {
                lossCurve.push({ x: epoch, y: loss });
                currentEpoch = epoch;
                drawLossCurve();
            }, [], null, i * 0.04);
        }
        
        tl.call(() => {
            drawFinalState();
        });
    });
}

function getGraphCoords(epoch, loss) {
    const { width, height, padding } = trainingAnim;
    const maxEpoch = 50;
    const x = padding + (epoch / maxEpoch) * (width - 2 * padding);
    const y = height - padding - (loss / 1.0) * (height - 2 * padding);
    return { x, y };
}

function drawGraph() {
    const { ctx, width, height, padding } = trainingAnim;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        let y = height - padding - (i / 5) * (height - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    for (let i = 0; i <= 5; i++) {
        let x = padding + (i / 5) * (width - 2 * padding);
        ctx.beginPath();
        ctx.moveTo(x, padding);
        ctx.lineTo(x, height - padding);
        ctx.stroke();
    }
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'center';
    
    for (let i = 0; i <= 5; i++) {
        let x = padding + (i / 5) * (width - 2 * padding);
        ctx.fillText(`${i * 10}`, x, height - padding + 20);
    }
    
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
        let y = height - padding - (i / 4) * (height - 2 * padding);
        ctx.fillText((1 - i * 0.25).toFixed(2), padding - 10, y + 4);
    }
    
    ctx.textAlign = 'center';
    ctx.fillText('Эпохи', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Функция потерь', 0, 0);
    ctx.restore();
}

function drawLossCurve() {
    const { ctx, lossCurve, padding } = trainingAnim;
    
    if (lossCurve.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(getGraphCoords(lossCurve[0].x, lossCurve[0].y).x, getGraphCoords(lossCurve[0].x, lossCurve[0].y).y);
    
    for (let i = 1; i < lossCurve.length; i++) {
        let coords = getGraphCoords(lossCurve[i].x, lossCurve[i].y);
        ctx.lineTo(coords.x, coords.y);
    }
    
    ctx.strokeStyle = '#4f46e5';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    let lastPoint = getGraphCoords(lossCurve[lossCurve.length - 1].x, lossCurve[lossCurve.length - 1].y);
    
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#4f46e5';
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(lastPoint.x, lastPoint.y, 12, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(79, 70, 229, 0.2)';
    ctx.fill();
}

function drawFinalState() {
    const { ctx, width, height, padding } = trainingAnim;
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 14px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Обучение завершено! Эпоха: ${currentEpoch}`, width / 2, padding - 20);
}

export function resetTraining() {
    if (trainingAnim) {
        trainingAnim.lossCurve = [];
        trainingAnim.currentEpoch = 0;
        const { ctx, canvas } = trainingAnim;
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        drawGraph();
    }
}

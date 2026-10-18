let gdAnim = null;

export function initGradientDescent() {
    const canvas = document.getElementById('gradient-descent-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 60;
    
    let path = [];
    let currentPos = { x: 0.8, y: 0.8 };
    let stepIndex = 0;
    
    for (let i = 0; i < 30; i++) {
        let loss = convexFunction(currentPos.x, currentPos.y);
        path.push({
            x: padding + currentPos.x * (width - 2 * padding),
            y: height - padding - loss * (height - 2 * padding),
            opacity: 0
        });
        
        let gradX = gradientX(currentPos.x, currentPos.y);
        let gradY = gradientY(currentPos.x, currentPos.y);
        
        currentPos.x -= gradX * 0.05;
        currentPos.y -= gradY * 0.05;
        
        if (currentPos.x < 0) currentPos.x = 0;
        if (currentPos.y < 0) currentPos.y = 0;
    }
    
    gdAnim = { canvas, ctx, width, height, padding, path, stepIndex };
    
    drawContour();
    
    gsap.timeline().then(() => {
        let tl = gsap.timeline({ repeat: false });
        
        path.forEach((p, idx) => {
            tl.to(p, {
                opacity: 1,
                duration: 0.1
            }, idx * 0.15);
            
            tl.call(() => {
                drawPath(idx);
            }, [], idx * 0.15);
        });
        
        tl.call(() => {
            drawFinalPoint();
        });
    });
}

function convexFunction(x, y) {
    return (x - 0.3) ** 2 + (y - 0.3) ** 2;
}

function gradientX(x, y) {
    return 2 * (x - 0.3);
}

function gradientY(x, y) {
    return 2 * (y - 0.3);
}

function getCoords(x, loss) {
    const { width, height, padding } = gdAnim;
    return {
        x: padding + x * (width - 2 * padding),
        y: height - padding - loss * (height - 2 * padding)
    };
}

function drawContour() {
    const { ctx, width, height, padding } = gdAnim;
    
    ctx.clearRect(0, 0, width, height);
    
    let resolution = 40;
    let maxLoss = convexFunction(1, 1);
    
    for (let i = 0; i <= resolution; i += 4) {
        for (let j = 0; j <= resolution; j += 4) {
            let x = i / resolution;
            let y = j / resolution;
            let loss = convexFunction(x, y) / maxLoss;
            
            let coords = getCoords(x, loss);
            
            let alpha = 0.05 + loss * 0.15;
            ctx.fillStyle = `rgba(79, 70, 229, ${alpha})`;
            ctx.fillRect(coords.x - 2, coords.y - 2, 4, 4);
        }
    }
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding);
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Параметр θ₁', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Функция потерь', 0, 0);
    ctx.restore();
}

function drawPath(upToStep) {
    const { ctx, path, stepIndex } = gdAnim;
    
    if (path.length < 2) return;
    
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i <= upToStep && i < path.length; i++) {
        ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
    
    if (upToStep >= 0 && upToStep < path.length) {
        let point = path[upToStep];
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(point.x, point.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
}

function drawFinalPoint() {
    const { ctx, width, height } = gdAnim;
    
    ctx.fillStyle = '#1a1a1a';
    ctx.font = 'bold 14px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Оптимизация завершена!', width / 2, height - 40);
    
    ctx.beginPath();
    ctx.arc(width / 2, height / 2 + 20, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#10b981';
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    ctx.fillStyle = '#10b981';
    ctx.font = '12px Segoe UI, system-ui, sans-serif';
    ctx.fillText('Минимум', width / 2, height - 15);
}

export function resetGradientDescent() {
    if (gdAnim) {
        gdAnim.path.forEach(p => {
            p.opacity = 0;
        });
        gdAnim.stepIndex = 0;
        const { ctx, canvas } = gdAnim;
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        drawContour();
    }
}

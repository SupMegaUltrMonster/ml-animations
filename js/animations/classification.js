let classifAnim = null;

export function initClassification() {
    const canvas = document.getElementById('classification-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);
    
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const padding = 50;
    
    let points = [];
    let boundaryPoints = [];
    let animating = false;
    
    for (let i = 0; i < 60; i++) {
        let x = Math.random();
        let y;
        
        if (x > 0.5) {
            y = Math.random() * 0.4 + 0.1;
            points.push({
                x: padding + x * (width - 2 * padding),
                y: height - padding - y * (height - 2 * padding),
                class: 1,
                targetX: 0,
                targetY: 0,
                opacity: 0,
                scale: 0
            });
        } else {
            y = Math.random() * 0.4 + 0.5;
            points.push({
                x: padding + x * (width - 2 * padding),
                y: height - padding - y * (height - 2 * padding),
                class: 0,
                targetX: 0,
                targetY: 0,
                opacity: 0,
                scale: 0
            });
        }
    }
    
    for (let i = 0; i <= 20; i++) {
        let t = i / 20;
        let x = padding + t * (width - 2 * padding);
        let y = height - padding - (0.5 + Math.sin(t * Math.PI * 2) * 0.15) * (height - 2 * padding);
        boundaryPoints.push({ x, y, progress: 0 });
    }
    
    classifAnim = { canvas, ctx, width, height, padding, points, boundaryPoints };
    
    drawGraph();
    
    gsap.timeline().then(() => {
        let tl = gsap.timeline();
        
        points.forEach((p, idx) => {
            tl.to(p, {
                opacity: 1,
                scale: 1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            }, idx * 0.03);
        });
        
        tl.call(() => {
            drawPoints();
        });
        
        tl.then(() => {
            let boundaryTl = gsap.timeline();
            
            boundaryPoints.forEach((bp, idx) => {
                boundaryTl.to(bp, {
                    progress: 1,
                    duration: 0.05
                }, idx * 0.03);
            });
            
            boundaryTl.call(() => {
                drawBoundary();
            });
        });
    });
}

function getGraphCoords(x, y) {
    const { width, height, padding } = classifAnim;
    return {
        x: padding + x * (width - 2 * padding),
        y: height - padding - y * (height - 2 * padding)
    };
}

function drawGraph() {
    const { ctx, width, height, padding } = classifAnim;
    
    ctx.clearRect(0, 0, width, height);
    
    ctx.fillStyle = '#f9fafb';
    ctx.fillRect(padding, padding, width - 2 * padding, height - 2 * padding);
    
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.strokeRect(padding, padding, width - 2 * padding, height - 2 * padding);
    
    ctx.fillStyle = '#666';
    ctx.font = '12px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Признак 1', width / 2, height - 10);
    
    ctx.save();
    ctx.translate(15, height / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText('Признак 2', 0, 0);
    ctx.restore();
}

function drawPoints() {
    const { ctx, points } = classifAnim;
    
    points.forEach(p => {
        if (p.opacity === 0) return;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, 6 * p.scale, 0, Math.PI * 2);
        
        if (p.class === 1) {
            ctx.fillStyle = `rgba(79, 70, 229, ${p.opacity})`;
        } else {
            ctx.fillStyle = `rgba(16, 185, 129, ${p.opacity})`;
        }
        
        ctx.fill();
        ctx.strokeStyle = p.class === 1 ? '#4f46e5' : '#10b981';
        ctx.lineWidth = 2;
        ctx.stroke();
    });
}

function drawBoundary() {
    const { ctx, boundaryPoints } = classifAnim;
    
    ctx.beginPath();
    ctx.moveTo(boundaryPoints[0].x, boundaryPoints[0].y);
    
    for (let i = 1; i < boundaryPoints.length; i++) {
        ctx.lineTo(boundaryPoints[i].x, boundaryPoints[i].y);
    }
    
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.setLineDash([8, 4]);
    ctx.stroke();
    ctx.setLineDash([]);
    
    ctx.fillStyle = '#666';
    ctx.font = 'bold 12px Segoe UI, system-ui, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('Граница решений', boundaryPoints[boundaryPoints.length - 1].x + 10, boundaryPoints[Math.floor(boundaryPoints.length / 2)].y);
}

export function resetClassification() {
    if (classifAnim) {
        classifAnim.points.forEach(p => {
            p.opacity = 0;
            p.scale = 0;
        });
        classifAnim.boundaryPoints.forEach(bp => {
            bp.progress = 0;
        });
        const { ctx, canvas } = classifAnim;
        ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
        drawGraph();
    }
}

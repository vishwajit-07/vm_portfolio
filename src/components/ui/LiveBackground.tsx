'use client';

import { useEffect, useRef } from 'react';

export default function LiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    let width = window.innerWidth;
    let height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    const mouse = { x: width / 2, y: height / 2 };

    const nodes: any[] = [];
    const NODE_COUNT = 80;

    // 🔥 depth-based nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      const depth = Math.random();

      const x = Math.random() * width;
      const y = Math.random() * height;

      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: 0,
        vy: 0,
        depth,
        driftX: (Math.random() - 0.5) * (0.15 + depth * 0.25),
        driftY: (Math.random() - 0.5) * (0.15 + depth * 0.25),
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const time = Date.now() * 0.001;

      // 🌌 BACKGROUND GRADIENT (cinematic base)
      const gradient = ctx.createRadialGradient(
        mouse.x,
        mouse.y,
        0,
        mouse.x,
        mouse.y,
        400
      );
      gradient.addColorStop(0, 'rgba(255,106,0,0.08)');
      gradient.addColorStop(1, 'rgba(0,0,0,0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // 🔥 UPDATE NODES
      nodes.forEach((n) => {
        // organic motion
        n.vx += n.driftX + Math.sin(time + n.baseX) * 0.015;
        n.vy += n.driftY + Math.cos(time + n.baseY) * 0.015;

        // repulsion
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;

        const radius = 160 + n.depth * 60;

        if (dist < radius) {
          const force = (radius - dist) / radius;
          const strength = 2 + n.depth * 3;

          n.vx += (dx / dist) * force * strength;
          n.vy += (dy / dist) * force * strength;
        }

        // spring return
        n.vx += (n.baseX - n.x) * (0.008 + n.depth * 0.008);
        n.vy += (n.baseY - n.y) * (0.008 + n.depth * 0.008);

        // damping
        n.vx *= 0.92;
        n.vy *= 0.92;

        n.x += n.vx;
        n.y += n.vy;
      });

      // 🔗 DRAW BONDS
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          const maxDist = 130;

          if (dist < maxDist) {
            const opacity = (1 - dist / maxDist) * 0.25;

            const nearCursor =
              Math.hypot(nodes[i].x - mouse.x, nodes[i].y - mouse.y) < 120 ||
              Math.hypot(nodes[j].x - mouse.x, nodes[j].y - mouse.y) < 120;

            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);

            ctx.strokeStyle = nearCursor
              ? `rgba(255,106,0,${opacity})`
              : `rgba(255,255,255,${opacity})`;

            ctx.lineWidth = 0.4 + nodes[i].depth * 0.6;
            ctx.stroke();
          }
        }
      }

      // ⚛️ DRAW NODES
      nodes.forEach((n) => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1 + n.depth * 2, 0, Math.PI * 2);

        ctx.fillStyle = `rgba(255,255,255,${0.4 + n.depth * 0.6})`;
        ctx.fill();
      });

      // 🎬 VIGNETTE (cinematic edges)
      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.3,
        width / 2,
        height / 2,
        width
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.6)');

      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0"
    />
  );
}
import React, { useEffect, useRef } from 'react';

const StarfieldBackground = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationFrameRef = useRef(null);

  const layerCount = 3;
  const speeds = [0.05, 0.1, 0.2];
  const baseStarCount = 50;

  const createStars = (canvas) => {
    const stars = [];
    const scalingFactor = Math.max(canvas.width, canvas.height) / 1000;
    
    for (let i = 0; i < layerCount; i++) {
      const starCount = Math.floor(baseStarCount * scalingFactor * (i + 1));
      for (let j = 0; j < starCount; j++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * (i + 1) + 0.5,
          speed: speeds[i],
          opacity: Math.random(),
          baseOpacity: Math.random() * 0.5 + 0.5,
          layer: i,
        });
      }
    }
    return stars;
  };

  const updateStars = (canvas, stars) => {
    stars.forEach((star) => {
      star.y -= star.speed;
      star.opacity = star.baseOpacity + Math.sin(Date.now() * 0.001 * star.speed) * 0.3;

      if (star.y < 0) {
        star.y = canvas.height;
        star.x = Math.random() * canvas.width;
      }
    });
  };

  const draw = (canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    starsRef.current.forEach((star) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
      ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  };

  const animate = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    updateStars(canvas, starsRef.current);
    draw(canvas, ctx);

    animationFrameRef.current = requestAnimationFrame(animate);
  };

  const handleResize = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    starsRef.current = createStars(canvas);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    starsRef.current = createStars(canvas);
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  });

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <canvas
        ref={canvasRef}
        className="block w-full h-full"
      />
    </div>
  );
};

export default StarfieldBackground;
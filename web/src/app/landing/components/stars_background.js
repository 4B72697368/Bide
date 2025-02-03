import React, { useRef, useEffect, useCallback } from 'react';

const StarsBackground = () => {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationFrameRef = useRef(null);

  const createStars = (canvas) => {
    const stars = [];
    for (let i = 0; i < 400; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        speed: Math.random() * 0.5,
      });
    }
    return stars;
  };

  const draw = (canvas, ctx) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    starsRef.current.forEach((star) => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
      ctx.fillStyle = 'white';
      ctx.fill();
    });
  };

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    starsRef.current.forEach((star) => {
      star.y += star.speed;
      if (star.y > canvas.height) {
        star.y = 0;
        star.x = Math.random() * canvas.width;
      }
    });

    draw(canvas, ctx);
    animationFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const handleResize = () => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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
  }, [animate]);

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
};

export default StarsBackground;
import React, { useState, useEffect } from 'react';
import StarfieldBackground from './stars_background';

const fonts = [
  'Arial, sans-serif',
  'Barrio, cursive',
  'BlackOpsOne, display',
  'Butcherman, display',
  'Delius, cursive',
  'DeliusSwashCaps, cursive',
  'EmilysCandy, display',
  'FontdinerSwanky, cursive',
  'FunnelSans, sans-serif',
  'Kablammo, display',
  'LavishlyYours, cursive',
  'LeckerliOne, cursive',
  'LexendTera, sans-serif',
  'MontserratAlternates, sans-serif',
  'Orbitron, sans-serif',
  'Rationale, sans-serif',
  'Rock3D, display',
  'RubikMoonrocks, display',
  'RubikPuddles, display',
  'Tangerine, cursive',
  'Tektur, display'
];

const Hero = () => {
  const [currentFontIndex, setCurrentFontIndex] = useState(0);
  const [text, setText] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        setCurrentFontIndex((prevIndex) => (prevIndex + 1) % fonts.length);
      }, 500);

      return () => clearInterval(interval);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    const sequence = [' ', 'e ', 'et ', 'ett ', 'ette ', 'etter '];
    let step = 0;

    const typeInterval = setInterval(() => {
      setText(sequence[step]);
      step += 1;
      if (step === sequence.length) {
        clearInterval(typeInterval);
      }
    }, 1500 / sequence.length);

    return () => clearInterval(typeInterval);
  }, []);

  return (
    <section id="home" className="flex items-center justify-center h-screen bg-gradient-to-b from-[#050505] to-gray-900">
      <StarfieldBackground />
      <div
        style={{ fontFamily: fonts[currentFontIndex] }}
        className="text-6xl transition-all ease-in-out hover:text-blue-200"
      >
        <span className="font-bold tracking-wider animate-glow">B</span>
        <span className="font-bold tracking-wider animate-glow">{text}</span>
        <span className="font-bold tracking-wider animate-glow">IDE</span>
      </div>
    </section>
  );
};

export default Hero;
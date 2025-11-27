'use client';

import { useState, useEffect, useRef } from 'react';

export default function AimGame() {
  const [score, setScore] = useState(0);
  const [mode, setMode] = useState<'click' | 'hover' | ''>('');
  const [circles, setCircles] = useState<number[]>([0]);
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([{ x: 0, y: 0 }]);
  const [sizes, setSizes] = useState<number[]>([80]);
  const [colors, setColors] = useState<string[]>(['#ffffff']);
  const [gameHeight, setGameHeight] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const footerHeight = 60;
    const updateHeight = () => setGameHeight(window.innerHeight - footerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16);

  const drawLine = (x1: number, y1: number, x2: number, y2: number, color: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.strokeStyle = color;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x1 + 40, y1 + 40); // 공 중심 기준
    ctx.lineTo(x2 + 40, y2 + 40);
    ctx.stroke();
  };

  const moveCircle = (index: number) => {
    const size = sizes[index];
    const color = colors[index];
    setPositions(prev => {
      const newPos = [...prev];
      const oldPos = newPos[index];
      const x = Math.random() * (window.innerWidth - size);
      const y = Math.random() * (gameHeight - size);
      newPos[index] = { x, y };
      drawLine(oldPos.x, oldPos.y, x, y, color);
      return newPos;
    });
    setColors(prev => {
      const newColors = [...prev];
      newColors[index] = randomColor();
      return newColors;
    });
  };

  const upScore = (index: number) => {
    setScore(prev => prev + 1);
    setSizes(prev => {
      const newSizes = [...prev];
      const current = newSizes[index];
      const newSize = Math.min(90, Math.max(10, current + (Math.random() * 20 - 10)));
      newSizes[index] = newSize;
      return newSizes;
    });
    moveCircle(index);
  };

  const start = (selectedMode: 'click' | 'hover') => {
    setMode(selectedMode);
    setScore(0);
    setCircles([0]);
    setSizes([80]);
    setColors(['#ffffff']);
    setPositions([{ x: window.innerWidth / 2 - 40, y: gameHeight * 0.75 - 40 }]);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setTimeout(() => moveCircle(0), 50);
  };

  const plusBall = () => {
    if (!mode) return;
    const newIndex = circles.length;
    setCircles(prev => [...prev, newIndex]);
    setPositions(prev => [...prev, { x: 0, y: 0 }]);
    setSizes(prev => [...prev, 80]);
    setColors(prev => [...prev, '#ffffff']);
    setTimeout(() => moveCircle(newIndex), 50);
  };

  const unplusBall = () => {
    if (circles.length <= 1) return;
    setCircles(prev => prev.slice(0, -1));
    setPositions(prev => prev.slice(0, -1));
    setSizes(prev => prev.slice(0, -1));
    setColors(prev => prev.slice(0, -1));
  };

  const restart = () => {
    setScore(0);
    setMode('');
    setCircles([0]);
    setPositions([{ x: window.innerWidth / 2 - 40, y: gameHeight / 2 - 40 }]);
    setSizes([80]);
    setColors(['#ffffff']);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center w-full relative overflow-hidden font-sans text-white" style={{ height: gameHeight }}>
      <canvas ref={canvasRef} width={window.innerWidth} height={gameHeight} className="absolute top-0 left-0 z-0" />
      <p className="text-2xl md:text-3xl font-bold mb-4 z-10 relative">{score}</p>
      <div className="flex space-x-2 mb-4 z-10 relative">
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={restart}>
          Restart
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={() => start('click')}>
          mode1 (Click)
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={() => start('hover')}>
          mode2 (Hover)
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={plusBall}>
          +
        </button>
        <button className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600" onClick={unplusBall}>
          -
        </button>
      </div>

      {circles.map((c, i) => (
        <div
          key={c}
          className="rounded-full absolute cursor-pointer transition-all z-10"
          style={{ width: sizes[i], height: sizes[i], left: positions[i]?.x, top: positions[i]?.y, backgroundColor: colors[i] }}
          onClick={mode === 'click' ? () => upScore(i) : undefined}
          onMouseEnter={mode === 'hover' ? () => upScore(i) : undefined}
        />
      ))}
    </div>
  );
}

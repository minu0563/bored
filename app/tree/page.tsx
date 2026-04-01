"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const BarnsleyFern = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [count, setCount] = useState(0);
  
  const stats = useRef({ x: 0, y: 0, total: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // 성능 최적화
    if (!ctx) return;

    const init = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      ctx.fillStyle = '#020402'; // 조금 더 깊은 블랙
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    init();

    const draw = () => {
      if (stats.current.total >= 800_000) return;
      
      const pointsPerFrame = 800;
      
      for (let i = 0; i < pointsPerFrame; i++) {
        let { x, y } = stats.current;
        let nextX, nextY;
        const r = Math.random();

        if (r < 0.01) {
          nextX = 0;
          nextY = 0.16 * y;
        } else if (r < 0.86) {
          nextX = 0.85 * x + 0.04 * y;
          nextY = -0.04 * x + 0.85 * y + 1.6;
        } else if (r < 0.93) {
          nextX = 0.2 * x - 0.26 * y;
          nextY = 0.23 * x + 0.22 * y + 1.6;
        } else {
          nextX = -0.15 * x + 0.28 * y;
          nextY = 0.26 * x + 0.24 * y + 0.44;
        }

        stats.current.x = nextX;
        stats.current.y = nextY;
        stats.current.total++;

        const scale = 65;        
        const yOffset = 80; 

        const px = nextX * scale + canvas.width / 2;
        const py = canvas.height - (nextY * scale + yOffset);

        // --- 2.0 컬러 알고리즘 적용 ---
        // 1. y값(높이)에 따라 색상(Hue)을 초록에서 에메랄드로 변화 (110 ~ 160)
        const hue = 110 + (nextY / 10) * 50;
        // 2. y값에 따라 밝기 조절 (위로 갈수록 밝아짐)
        const lightness = 40 + (nextY / 10) * 40;
        // 3. 무작위 투명도로 깊이감 부여
        const alpha = Math.random() * 0.5 + 0.3;

        ctx.fillStyle = `hsla(${hue}, 80%, ${lightness}%, ${alpha})`;
        
        // 기본 점 그리기
        ctx.fillRect(px, py, 0.8, 0.8);

        // 4. 가끔씩 "개쩌는" 글로우 점 추가 (반짝이는 효과)
        if (i % 150 === 0) {
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#2ecc71';
          ctx.fillRect(px, py, 1.2, 1.2);
          ctx.shadowBlur = 0; // 초기화하여 성능 저하 방지
        }
      }

      setCount(stats.current.total);
      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    window.addEventListener('resize', init);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', init);
    };
  }, []);

  return (
    <div className="relative w-screen h-screen bg-[#020402] overflow-hidden flex items-center justify-center font-mono select-none">
      
      <div className="absolute top-8 left-8 z-20 space-y-4 pointer-events-auto">
        <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 border border-[#2ecc71]/30 bg-black/50 backdrop-blur-md text-[#2ecc71] text-xs rounded hover:border-[#2ecc71] hover:bg-[#2ecc71]/10 transition-all duration-300 shadow-[0_0_10px_rgba(46,204,113,0.1)] hover:shadow-[0_0_15px_rgba(46,204,113,0.3)]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          RETURN_TO_TERMINAL
        </Link>

        <div className="space-y-1 text-[#2ecc71] pointer-events-none">
          <div className="text-[10px] tracking-[0.3em] opacity-60">FRACTAL_ENGINE_V2.0</div>
          <div className="text-5xl font-black text-white tabular-nums drop-shadow-[0_0_15px_rgba(46,204,113,0.6)]">
            {count.toLocaleString()}
          </div>
          <p className="text-[10px] italic opacity-80 animate-pulse tracking-widest">
            {stats.current.total < 1_000_000 ? "COMPUTING_ORGANIC_SYMMETRY..." : "CALCULATION_COMPLETE"}
          </p>
        </div>
      </div>

      <canvas 
        ref={canvasRef} 
        className="w-full h-full filter drop-shadow-[0_0_20px_rgba(46,204,113,0.2)] z-10"
      />

      {/* 사이버네틱 가이드 라인 오버레이 */}
      <div className="absolute inset-0 border border-[#2ecc71]/5 pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] pointer-events-none z-10" />
      
      <div className="absolute bottom-6 right-8 text-[10px] text-[#2ecc71]/40 font-mono z-20 flex gap-6">
        <span>MODE: PROBABILITY_DISTRIBUTION</span>
        <span>SEED: {Math.floor(Math.random() * 1000000)}</span>
      </div>
    </div>
  );
};

export default BarnsleyFern;
"use client";

import { useEffect, useRef } from "react";

export default function Cursor() {
    const elRef = useRef<HTMLDivElement | null>(null);
    const posRef = useRef({ x: 0, y: 0, tx: 0, ty: 0});
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        if (typeof window === "undefined" || "ontouchstart" in window) return;

        const handleMove = (e: MouseEvent) => {
            posRef.current.x = e.clientX;   
            posRef.current.y = e.clientY;
        };
        
        window.addEventListener("mousemove", handleMove);   

        const el = elRef.current;
        if (el) el.style.opacity = "1";

        const animate = () => {
            const p = posRef.current;
            const lerp = 0.2;

            p.tx += (p.x - p.tx) * lerp;
            p.ty += (p.y - p.ty) * lerp;

            if (el) {
                el.style.transform = `translate3d(${p.tx}px, ${p.ty}px, 0) translate(-50%, -50%)`;
            }

            rafRef.current = requestAnimationFrame(animate);
        };

        rafRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("mousemove", handleMove);

            if (rafRef.current !== null) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={elRef}
            className="pointer-events-none fixed left-0 top-0 opacity-0 transition-opacity duration-200"
            style={{
                width: "520px",
                height: "520px",
                transform: "translate(-50%, -50%)",
                background:
                "radial-gradient(circle, rgba(34,197,94,0.9) 0%, rgba(34,197,94,0.25) 40%, rgba(34,197,94,0.05) 70%, rgba(34,197,94,0) 85%)",
                filter: "blur(30px)",
                borderRadius: "50%",
                zIndex: 9999,
                mixBlendMode: "screen",
            }}
        />  
    );
}
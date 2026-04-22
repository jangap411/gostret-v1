import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

const SlideButton = ({ onComplete, text, icon, color = 'var(--color-primary)', isLoading = false }) => {
  const containerRef = useRef(null);
  const [constraints, setConstraints] = useState({ left: 0, right: 0 });
  const [hasCompleted, setHasCompleted] = useState(false);

  // Motion value tracks the handle's X position
  const x = useMotionValue(0);

  // Fade text out as user slides right
  const textOpacity = useTransform(x, [0, 80], [1, 0]);

  // Calculate drag constraints after mount and on resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const HANDLE_SIZE = 52;
        const PADDING = 12;
        const containerWidth = containerRef.current.offsetWidth;
        const maxRight = containerWidth - HANDLE_SIZE - PADDING;
        if (maxRight > 0) {
          setConstraints({ left: 0, right: maxRight });
        }
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Reset button whenever text (status) changes
  useEffect(() => {
    animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    setHasCompleted(false);
  }, [text]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDragEnd = () => {
    const currentX = x.get();
    const threshold = constraints.right * 0.75;

    if (constraints.right > 0 && currentX >= threshold && !hasCompleted) {
      setHasCompleted(true);
      animate(x, constraints.right, { type: 'spring', stiffness: 400, damping: 30 });
      setTimeout(() => {
        onComplete();
      }, 200);
    } else {
      animate(x, 0, { type: 'spring', stiffness: 400, damping: 30 });
    }
  };

  if (isLoading) {
    return (
      <div className="relative w-full h-16 bg-slate-100 border border-slate-200 rounded-full flex items-center justify-center gap-3 overflow-hidden shadow-inner">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin flex-shrink-0" />
        <span className="font-bold text-primary/40 text-[10px] tracking-[0.25em] uppercase">
          Updating...
        </span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-16 bg-surface border border-border-subtle rounded-full flex items-center p-1.5 overflow-hidden shadow-premium"
      style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}
    >
      {/* Filled track that grows as thumb slides */}
      <motion.div
        className="absolute left-1.5 top-1.5 bottom-1.5 rounded-full pointer-events-none"
        style={{
          width: x,
          backgroundColor: color,
          opacity: 0.1,
        }}
      />

      {/* Label text — fades as user slides */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.span
          style={{ opacity: textOpacity }}
          className="text-[11px] font-bold tracking-[0.2em] uppercase select-none px-16 text-center text-slate-400"
        >
          {text}
        </motion.span>
      </div>

      {/* Draggable thumb */}
      <motion.div
        drag="x"
        dragConstraints={constraints}
        dragElastic={0.05}
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          x,
          width: 52,
          height: 52,
          backgroundColor: color,
          touchAction: 'none',
        }}
        className="relative z-10 flex-shrink-0 rounded-full flex items-center justify-center text-white cursor-grab active:cursor-grabbing select-none shadow-premium border border-white/20"
        aria-label={text}
      >
        <span
          className="material-symbols-outlined text-2xl"
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon || 'arrow_forward_ios'}
        </span>
      </motion.div>
    </div>
  );
};

export default SlideButton;

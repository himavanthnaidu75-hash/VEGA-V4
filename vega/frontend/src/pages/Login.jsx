import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, Globe, ChevronRight } from 'lucide-react';

const LoginCanvas = () => {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 120;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
    }

    const init = () => {
      resize();
      particles = Array.from({ length: particleCount }, () => new Particle());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#F5C518';
      ctx.strokeStyle = 'rgba(245, 197, 24, 0.15)';
      ctx.lineWidth = 0.5;

      particles.forEach((p, i) => {
        p.update();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });
      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    init();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 bg-[#111318]" />;
};

const Login = () => {
  return (
    <div className="relative w-full min-h-screen overflow-x-hidden selection:bg-primary selection:text-ink">
      <LoginCanvas />

      <section className="relative z-10 h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-[#1A1D24]/70 backdrop-blur-[40px] p-12 rounded-[24px] border border-white/10 w-full max-w-lg shadow-[0_20px_100px_rgba(0,0,0,0.5)] text-center"
        >
          <h1 className="text-[42px] font-black text-primary mb-2 tracking-tighter italic font-syne uppercase">VEGA</h1>
          <p className="text-text-dim font-bold uppercase text-[10px] tracking-[0.4em] mb-12">Institutional Node Authentication</p>

          <form className="space-y-4 mb-8 text-left" onSubmit={e => e.preventDefault()}>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-text-faint uppercase tracking-widest ml-1">Terminal ID</label>
              <input type="email" placeholder="admin@vega.node" className="w-full bg-[#111318]/50 border border-white/5 rounded-xl py-4 px-5 text-xs font-bold outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-text placeholder:text-text-faint" />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] font-black text-text-faint uppercase tracking-widest ml-1">Access Key</label>
              <input type="password" placeholder="••••••••" className="w-full bg-[#111318]/50 border border-white/5 rounded-xl py-4 px-5 text-xs font-bold outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all text-text placeholder:text-text-faint" />
            </div>

            <button
              className="w-full bg-primary text-[#111318] font-black py-5 rounded-xl flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all shadow-[0_10px_40px_rgba(245,197,24,0.15)] group mt-10 text-[11px] tracking-widest uppercase"
              onClick={() => window.location.href = '/terminal'}
            >
              Initialize Session
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <button
            className="text-[9px] font-black text-text-dim uppercase tracking-[0.2em] hover:text-primary transition-colors"
          >
            Create New Terminal Node
          </button>
        </motion.div>
      </section>

      <section className="relative z-10 py-32 px-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {[
          { title: "169+ STRATEGIES", desc: "Pure vectorized math from 151 Strategies paper.", icon: Cpu },
          { title: "ICT CONFIRMATION", desc: "4-step institutional logic gate for every pulse.", icon: Shield },
          { title: "ZERO LATENCY", desc: "Direct fiber-optic link to NSE/BSE hubs.", icon: Zap },
          { title: "AUTONOMOUS", desc: "Zero human intervention from open to close.", icon: Globe },
        ].map((f, i) => (
          <motion.div
            key={i}
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            className="bg-[#1A1D24]/50 backdrop-blur-xl border border-white/5 p-10 rounded-[32px] hover:border-primary/20 transition-all cursor-default group"
          >
            <f.icon size={28} className="text-primary mb-8 group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-text mb-3 tracking-tight font-syne">{f.title}</h3>
            <p className="text-[11px] font-medium text-text-dim uppercase tracking-widest leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      <footer className="relative z-10 py-20 text-center border-t border-white/5">
         <p className="text-[10px] font-black text-text-faint uppercase tracking-[0.5em]">VEGA Autonomous Systems © 2024</p>
      </footer>
    </div>
  );
};

export default Login;

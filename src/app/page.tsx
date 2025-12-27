"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { nanoid } from 'nanoid';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Code2, Users, ArrowRight, Zap, Shield, Globe, Laptop,
  GraduationCap, Briefcase, ChevronDown, Check, Sparkles,
  GitBranch, Terminal, Play, Share2, Command, Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Home() {
  const router = useRouter();
  const [roomId, setRoomId] = useState("");
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const createRoom = () => {
    const id = nanoid(10);
    router.push(`/room/${id}`);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId.trim()) return;
    let id = roomId.trim();
    if (id.includes('/')) {
      id = id.replace(/\/+$/, '');
      id = id.split('/').pop() || id;
    }
    router.push(`/room/${id}`);
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-indigo-500/30 overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Code2 className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            DevSync
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
          <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            className="hidden sm:flex text-zinc-400 hover:text-white transition-colors text-sm font-medium"
          >
            Star on GitHub
          </a>
          <button
            onClick={createRoom}
            className="px-4 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-colors"
          >
            Get Started
          </button>
        </div>
      </nav>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative min-h-screen pt-32 pb-20 px-6 flex flex-col items-center justify-center overflow-hidden">
          {/* Background FX - Improved Aurora */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-indigo-600/20 rounded-[100%] blur-[120px] opacity-40 animate-pulse pointer-events-none mix-blend-screen"></div>
          <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-600/10 rounded-[100%] blur-[120px] opacity-30 pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay pointer-events-none"></div>

          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="relative z-10 max-w-5xl w-full text-center"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-indigo-300 mb-8 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              v2.0 is now live: Real-time Cursors & Cloud Execution
              <ArrowRight className="w-3 h-3 ml-1" />
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[1.1]">
              Collaboration, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400">
                Synchronized.
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the future of pair programming. reliable real-time sync,
              instant cloud environments, and zero-config setup.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto mb-20">
              <button
                onClick={createRoom}
                className="group relative w-full sm:w-auto h-12 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-[0_0_40px_-10px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Zap className="w-4 h-4 fill-current" />
                  Start Coding Free
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>

              <div className="flex w-full sm:w-auto relative">
                <input
                  type="text"
                  placeholder="Enter Room Code..."
                  value={roomId}
                  onChange={(e) => setRoomId(e.target.value)}
                  className="w-full sm:w-64 h-12 pl-4 pr-12 rounded-xl bg-white/5 border border-white/10 text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all font-medium text-sm"
                />
                <button
                  onClick={joinRoom}
                  disabled={!roomId.trim()}
                  className="absolute right-1 top-1 h-10 w-10 rounded-lg bg-white/10 hover:bg-indigo-500 disabled:opacity-0 disabled:pointer-events-none text-white flex items-center justify-center transition-all"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>

            {/* HERO VISUALIZATION */}
            <motion.div
              variants={fadeInUp}
              className="relative mx-auto max-w-5xl rounded-xl border border-white/10 bg-[#0c0c0e] shadow-2xl shadow-indigo-900/20 overflow-hidden"
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transform: 'rotateX(2deg)'
              }}
            >
              {/* Fake Browser Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="text-xs text-zinc-600 font-mono">devsync.io/room/demo</div>
                <div className="w-16"></div>
              </div>

              {/* Fake Editor Content */}
              <div className="grid grid-cols-12 h-[400px] text-left">
                {/* Sidebar */}
                <div className="col-span-3 border-r border-white/5 p-4 space-y-3 hidden md:block">
                  <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-4"><Terminal className="w-4 h-4" /> PROJECT</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-zinc-400 text-xs px-2 py-1 bg-white/5 rounded"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> main.js</div>
                    <div className="flex items-center gap-2 text-zinc-600 text-xs px-2 py-1"><div className="w-2 h-2 rounded-full bg-blue-400"></div> util.ts</div>
                    <div className="flex items-center gap-2 text-zinc-600 text-xs px-2 py-1"><div className="w-2 h-2 rounded-full bg-purple-400"></div> style.css</div>
                  </div>
                </div>

                {/* Code Area */}
                <div className="col-span-12 md:col-span-9 p-6 font-mono text-sm relative">
                  <div className="absolute top-10 right-10 flex gap-2">
                    <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></div> Sarah (Typing)
                    </div>
                  </div>

                  <div className="text-zinc-500">1 &nbsp; <span className="text-purple-400">import</span> React <span className="text-purple-400">from</span> 'react';</div>
                  <div className="text-zinc-500">2</div>
                  <div className="text-zinc-500">3 &nbsp; <span className="text-blue-400">function</span> <span className="text-yellow-200">App</span>() {'{'}</div>
                  <div className="text-zinc-500">4 &nbsp; &nbsp; <span className="text-purple-400">return</span> (</div>
                  <div className="text-zinc-500">5 &nbsp; &nbsp; &nbsp; <span className="text-zinc-300">&lt;div className=" collaborative-magic "&gt;</span></div>
                  <div className="text-zinc-500 flex items-center">
                    6 &nbsp; &nbsp; &nbsp; &nbsp; <span className="text-zinc-100">Synchronized State</span>
                    <div className="h-4 w-0.5 bg-orange-500 ml-0.5 animate-pulse"></div>
                    <span className="ml-2 text-[10px] bg-orange-500 text-black px-1 rounded font-bold">Sarah</span>
                  </div>
                  <div className="text-zinc-500">7 &nbsp; &nbsp; &nbsp; <span className="text-zinc-300">&lt;/div&gt;</span></div>
                  <div className="text-zinc-500">8 &nbsp; &nbsp; );</div>
                  <div className="text-zinc-500">9 &nbsp; {'}'}</div>

                  {/* Floating Elements */}
                  <div className="absolute bottom-6 right-6 p-4 rounded-xl bg-zinc-900 border border-white/10 shadow-2xl max-w-xs animate-bounce delay-700">
                    <div className="flex gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold">JD</div>
                      <div className="bg-white/5 rounded-lg p-2 text-xs text-zinc-300">
                        Hey! I just fixed the bug in line 6. Ready to deploy? 🚀
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* STATS / TRUST */}
        <section className="py-10 border-y border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-12 md:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <div className="flex items-center gap-2 text-lg font-bold text-white"><Globe className="w-5 h-5" /> Global Scale</div>
            <div className="flex items-center gap-2 text-lg font-bold text-white"><Shield className="w-5 h-5" /> Enterprise Secure</div>
            <div className="flex items-center gap-2 text-lg font-bold text-white"><Cpu className="w-5 h-5" /> 99.9% Uptime</div>
            <div className="flex items-center gap-2 text-lg font-bold text-white"><Zap className="w-5 h-5" /> &lt;50ms Latency</div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section id="features" className="py-32 px-6 relative">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-black mb-6">Everything you need.</h2>
              <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                Built for power users. Every feature is designed to keep you in flow state.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Globe, title: "Real-time Sync", desc: "Operational Transform algorithms ensure every keystroke is synced instantly across the globe." },
                { icon: Terminal, title: "Cloud Terminal", desc: "Full terminal access in the browser. Run Node, Python, C++, and Java instantly." },
                { icon: Users, title: "Multiplayer Cursors", desc: "See exactly where your team is working with colorful, labeled presence cursors." },
                { icon: Sparkles, title: "Smart Syntax", desc: "Advanced syntax highlighting and bracket matching for over 50+ languages." },
                { icon: Shield, title: "Secure Rooms", desc: "End-to-end encrypted sessions with ephemeral room IDs that vanish after use." },
                { icon: Command, title: "Command Palette", desc: "Keyboard-first navigation. Switch files, run code, and change themes without touching the mouse." },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-indigo-500/50 hover:bg-zinc-900/80 transition-all relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <feature.icon className="w-6 h-6 text-zinc-400 group-hover:text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 relative z-10">{feature.title}</h3>
                  <p className="text-zinc-400 leading-relaxed text-sm relative z-10">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-32 px-6 bg-zinc-900/30 border-y border-white/5 relative overflow-hidden">
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-16">
              <div className="w-full md:w-1/2">
                <h2 className="text-4xl md:text-5xl font-black mb-8">Ready in seconds. <br />Not minutes.</h2>
                <div className="space-y-8">
                  {[
                    { step: "01", title: "Create a Room", desc: "One click to spin up a fresh environment." },
                    { step: "02", title: "Share the Link", desc: "Send the URL to your team. No signup required." },
                    { step: "03", title: "Start Building", desc: "Code, debug, and execute together instantly." }
                  ].map((s, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="text-3xl font-black text-indigo-500/20 font-mono">{s.step}</div>
                      <div>
                        <h4 className="text-xl font-bold mb-1 text-white">{s.title}</h4>
                        <p className="text-zinc-400 text-sm">{s.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full md:w-1/2 relative">
                {/* Abstract representation of connection */}
                <div className="aspect-square relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20 rounded-full blur-3xl animate-pulse"></div>
                  <div className="relative z-10 bg-black/80 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold text-xl">D</div>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-full bg-indigo-500 animate-progress origin-left"></div>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center text-white font-bold text-xl">S</div>
                    </div>
                    <div className="space-y-3 font-mono text-xs">
                      <div className="flex justify-between text-zinc-500"><span>STATUS</span> <span className="text-green-400">CONNECTED</span></div>
                      <div className="flex justify-between text-zinc-500"><span>LATENCY</span> <span className="text-white">24ms</span></div>
                      <div className="flex justify-between text-zinc-500"><span>ENCRYPTION</span> <span className="text-white">AES-256</span></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-32 px-6 bg-[#050505]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {[
                { q: "Is DevSync really free?", a: "Yes! You can create unlimited rooms and collaborate for free. We may introduce premium features for enterprises later." },
                { q: "What languages are supported?", a: "We support JavaScript, TypeScript, Python, Java, C++, and more via the Piston execution API." },
                { q: "Is my code saved?", a: "Currently, sessions are ephemeral. Code lives as long as the room is active. We recommend saving locally for long-term storage." },
                { q: "Can I use this for interviews?", a: "Absolutely. Many companies use DevSync for system design and coding interviews due to its low latency and simplicity." }
              ].map((item, i) => (
                <div key={i} className="border border-white/5 rounded-2xl bg-zinc-900/30 overflow-hidden">
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="flex items-center justify-between w-full p-6 text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-semibold text-lg">{item.q}</span>
                    <ChevronDown className={cn("w-5 h-5 transition-transform text-zinc-500", activeFaq === i ? "rotate-180" : "")} />
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: "auto" }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-zinc-400 leading-relaxed border-t border-white/5">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-20 px-6 border-t border-white/5 bg-[#020202]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">DevSync</span>
              </div>
              <p className="text-zinc-500 text-sm mb-6">
                Redefining how developers collaborate. Built for the modern web.
              </p>
              <div className="flex gap-4">
                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"><Globe className="w-4 h-4" /></a>
                <a href="#" className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"><Share2 className="w-4 h-4" /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Resources</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Community</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Help Center</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-zinc-500">
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-indigo-400 transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-6xl mx-auto mt-20 pt-8 border-t border-white/5 text-center text-zinc-600 text-sm">
            &copy; 2026 DevSync Platform. Use responsibly.
          </div>
        </footer>

      </main>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Moon, Star, Compass, Wind, Zap, RefreshCw, AlertTriangle } from 'lucide-react';

// --- DATABASE RAMALAN LUCU ---
const ZODIACS = {
  Plastik: { name: 'Polymerus', icon: <RefreshCw className="w-8 h-8" />, trait: 'Fleksibel tapi kadang murahan.' },
  Kaca: { name: 'Fragilius', icon: <Star className="w-8 h-8" />, trait: 'Transparan, elegan, tapi sangat sensitif (mudah hancur).' },
  Kayu: { name: 'Serbukus', icon: <Wind className="w-8 h-8" />, trait: 'Alami dan estetik, tapi diam-diam takut rayap.' },
  Logam: { name: 'Ferromini', icon: <Compass className="w-8 h-8" />, trait: 'Kuat, dingin, dan keras kepala.' },
  Kain: { name: 'Tekstilium', icon: <Moon className="w-8 h-8" />, trait: 'Lembut, suka dipeluk, benci mesin cuci.' },
  Elektronik: { name: 'Setrumus', icon: <Zap className="w-8 h-8" />, trait: 'Pintar, overthinking, sering kehabisan energi.' }
};

const HOROSCOPES = [
  "Hari ini energi kosmik sedang tidak stabil. Bersiaplah untuk dipindahkan ke tempat yang tidak kamu sukai.",
  "Seseorang akan menatapmu lama hari ini, tapi sayangnya mereka hanya melamun.",
  "Waspada! Ada ancaman tumpahan air atau debu tebal di dekatmu. Jaga diri.",
  "Kamu akan menjalankan tugasmu dengan baik hari ini, meski tidak ada yang berterima kasih.",
  "Aura warnamu sedang bersinar! Hari ini kamu adalah benda paling estetik di ruangan ini.",
  "Hati-hati dengan benda di sebelahmu, sepertinya dia diam-diam iri dengan posisimu.",
  "Ini adalah hari yang baik untuk beristirahat. Berdoalah agar majikanmu lupa menggunakanmu.",
  "Sepertinya kamu akan segera dibersihkan. Nikmati sensasi spa gratis tersebut!"
];

const COMPATIBILITY = [
  "Sapu Lidi", "Kucing Majikan", "Kabel Kusut", "Remot TV yang hilang", 
  "Gelas Kopi Setengah Habis", "Ujung Meja", "Bantal Guling", "Kipas Angin Berdebu"
];

const LOADING_TEXTS = [
  "Menerawang aura material...",
  "Berkomunikasi dengan roh pabrik...",
  "Menghitung probabilitas kerusakan...",
  "Menyelaraskan frekuensi debu...",
  "Membaca garis takdir benda..."
];

// --- MAIN COMPONENT ---
export default function App() {
  const [step, setStep] = useState('home'); // home, analyzing, result
  const [formData, setFormData] = useState({ name: '', color: '#3b82f6', material: 'Plastik' });
  const [loadingText, setLoadingText] = useState(LOADING_TEXTS[0]);
  const [result, setResult] = useState(null);
  
  const canvasRef = useRef(null);

  // Background Particle Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (let i = 0; i < 100; i++) particles.push(new Particle());

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => { p.update(); p.draw(); });
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pseudo-random generator based on string to keep results consistent for the same item name
  const getPseudoRandom = (seedString) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  // Analyze Logic
  const handleAnalyze = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setStep('analyzing');
    
    let textIndex = 0;
    const interval = setInterval(() => {
      textIndex = (textIndex + 1) % LOADING_TEXTS.length;
      setLoadingText(LOADING_TEXTS[textIndex]);
    }, 800);

    setTimeout(() => {
      clearInterval(interval);
      generateResult();
      setStep('result');
    }, 4000);
  };

  const generateResult = () => {
    const seed = formData.name.toLowerCase() + formData.material;
    const randomNum = getPseudoRandom(seed);
    
    setResult({
      zodiac: ZODIACS[formData.material],
      horoscope: HOROSCOPES[randomNum % HOROSCOPES.length],
      bestFriend: COMPATIBILITY[(randomNum + 1) % COMPATIBILITY.length],
      enemy: COMPATIBILITY[(randomNum + 3) % COMPATIBILITY.length],
      luckyPosition: ["Pojok Meja", "Kolong Kasur", "Atas Lemari", "Dalam Laci", "Dekat Jendela"][randomNum % 5],
      auraScore: (randomNum % 50) + 50 // 50 to 99
    });
  };

  const reset = () => {
    setStep('home');
    setFormData({ name: '', color: '#3b82f6', material: 'Plastik' });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col items-center justify-center p-4">
      {/* Canvas Background */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg">
        
        {step === 'home' && (
          <div className="bg-slate-900/60 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-2xl text-center transform transition-all animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-indigo-400 animate-pulse" />
                <Moon className="w-8 h-8 text-yellow-200 absolute -bottom-2 -right-2" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              Astrologi Benda Mati
            </h1>
            <p className="text-slate-400 mb-8 text-sm md:text-base">
              Jangan egois, benda di sekitarmu juga punya perasaan dan takdir. Cek ramalan benda kesayangan (atau yang paling kamu benci) hari ini.
            </p>

            <form onSubmit={handleAnalyze} className="space-y-5 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nama Benda (Spesifik)</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Contoh: Kipas Angin Miyako Berisik" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-colors placeholder:text-slate-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Material Utama</label>
                  <select 
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full bg-slate-800 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    {Object.keys(ZODIACS).map(mat => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Aura Warna</label>
                  <div className="flex items-center gap-3 bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 h-[50px]">
                    <input 
                      type="color" 
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full h-full bg-transparent border-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 px-6 rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95 flex justify-center items-center gap-2 group"
              >
                <span>Baca Takdir Benda</span>
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              </button>
            </form>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-l-indigo-400 border-b-purple-400 border-t-pink-400 border-r-transparent rounded-full animate-spin-reverse"></div>
              <Star className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-medium text-indigo-300 animate-pulse">{loadingText}</h2>
          </div>
        )}

        {step === 'result' && result && (
          <div className="bg-slate-900/80 backdrop-blur-xl p-8 rounded-3xl border border-slate-700/50 shadow-2xl animate-zoom-in relative overflow-hidden">
            
            {/* Ambient glowing effect based on selected color */}
            <div 
              className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl opacity-30"
              style={{ backgroundColor: formData.color }}
            ></div>

            <div className="text-center mb-8 relative z-10">
              <p className="text-sm text-slate-400 uppercase tracking-widest mb-1">Hasil Pembacaan Kosmik untuk</p>
              <h2 className="text-2xl font-bold text-white capitalize">{formData.name}</h2>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-6 mb-6 border border-slate-700 relative z-10 flex flex-col items-center text-center group">
              <div className="p-4 bg-slate-700/50 rounded-full mb-4 text-indigo-400 group-hover:scale-110 transition-transform">
                {result.zodiac.icon}
              </div>
              <h3 className="text-sm text-slate-400 mb-1">Zodiak Material:</h3>
              <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-2">
                {result.zodiac.name}
              </p>
              <p className="text-sm text-slate-300 italic">"{result.zodiac.trait}"</p>
            </div>

            <div className="space-y-4 mb-8 relative z-10">
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <h4 className="flex items-center gap-2 text-indigo-300 font-semibold mb-2">
                  <Moon className="w-4 h-4" /> Ramalan Hari Ini
                </h4>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {result.horoscope}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Soulmate Benda</h4>
                  <p className="text-green-400 font-medium text-sm">{result.bestFriend}</p>
                </div>
                <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                  <h4 className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Musuh Alami</h4>
                  <p className="text-red-400 font-medium text-sm">{result.enemy}</p>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex justify-between items-center">
                <div>
                  <h4 className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Posisi Keberuntungan</h4>
                  <p className="text-yellow-300 font-medium text-sm">{result.luckyPosition}</p>
                </div>
                <div className="text-right">
                  <h4 className="text-xs text-slate-400 mb-1 uppercase font-bold tracking-wider">Tingkat Energi</h4>
                  <p className="text-white font-bold text-lg">{result.auraScore}%</p>
                </div>
              </div>
            </div>

            <button 
              onClick={reset}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-xl transition-colors active:scale-95 relative z-10"
            >
              Ramal Benda Lain
            </button>
          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes zoom-in {
          0% { opacity: 0; transform: scale(0.95); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.6s ease-out forwards; }
        .animate-fade-in { animation: fade-in 0.4s ease-out forwards; }
        .animate-zoom-in { animation: zoom-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-spin-reverse { animation: spin-reverse 2s linear infinite; }
      `}} />
    </div>
  );
}

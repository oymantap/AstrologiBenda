import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Moon, Star, Compass, Wind, Zap, RefreshCw, AlertTriangle, Droplet, FileText, Hexagon, Circle } from 'lucide-react';

// --- DATABASE RAMALAN DIPERLUAS ---
const ZODIACS = {
  Plastik: { name: 'Polymerus', icon: <RefreshCw className="w-8 h-8" />, trait: 'Fleksibel, serbaguna, tapi kadang dipandang murahan.' },
  Kaca: { name: 'Fragilius', icon: <Star className="w-8 h-8" />, trait: 'Transparan, elegan, tapi sangat sensitif dan mudah hancur.' },
  Kayu: { name: 'Serbukus', icon: <Wind className="w-8 h-8" />, trait: 'Alami, estetik, tenang, tapi diam-diam takut rayap.' },
  Logam: { name: 'Ferromini', icon: <Compass className="w-8 h-8" />, trait: 'Kuat, dingin, membumi, dan sangat keras kepala.' },
  Kain: { name: 'Tekstilium', icon: <Moon className="w-8 h-8" />, trait: 'Lembut, suka dipeluk, tapi benci hari mencuci.' },
  Elektronik: { name: 'Setrumus', icon: <Zap className="w-8 h-8" />, trait: 'Pintar, overthinking, sering kehabisan energi mendadak.' },
  Karet: { name: 'Elastisium', icon: <Circle className="w-8 h-8" />, trait: 'Sangat sabar, gampang melar kalau dipaksa keadaan.' },
  Kertas: { name: 'Papyrus', icon: <FileText className="w-8 h-8" />, trait: 'Ringan, mudah terbawa angin, menyimpan banyak rahasia.' },
  Keramik: { name: 'Porselinus', icon: <Hexagon className="w-8 h-8" />, trait: 'Dingin, berkelas, harganya mahal tapi mentalnya rapuh.' },
  Spons: { name: 'BusaBusa', icon: <Droplet className="w-8 h-8" />, trait: 'Suka menyerap masalah orang lain, sering diperas.' }
};

const HOROSCOPES = [
  // Absurd/Sial
  "Hari ini energi kosmik sedang tidak stabil. Bersiaplah untuk dipindahkan ke tempat yang tidak kamu sukai.",
  "Waspada! Ada ancaman tumpahan air lengket atau debu tebal di dekatmu. Jaga diri.",
  "Majikanmu sedang mempertimbangkan untuk membuangmu. Berusahalah terlihat berguna hari ini!",
  "Jangan kaget jika tiba-tiba kamu terjatuh tanpa alasan. Itu murni gravitasi, bukan hal mistis.",
  "Seseorang akan menilaimu hanya dari sampul luarmu saja. Bersabarlah.",
  "Kamu akan menjalankan tugasmu dengan baik hari ini, meski tidak ada satupun yang berterima kasih.",
  "Bersiaplah, sebentar lagi kamu akan dijadikan alat pengganjal pintu. Takdir memang kejam.",
  "Hati-hati dengan benda di sebelahmu, sepertinya dia diam-diam menyerap energimu.",
  "Kamu akan terlupakan selama beberapa hari ke depan. Nikmati masa pensiun sementaramu.",
  "Awas! Ada anak kecil yang sedang mengincar untuk menjadikanmu mainan. Bertahanlah!",
  "Kamu akan dituduh sebagai penyebab hilangnya barang lain. Tetaplah diam mematung.",
  // Baik/Positif
  "Aura warnamu sedang bersinar! Hari ini kamu adalah benda paling estetik di ruangan ini.",
  "Ada energi positif yang mendekat. Kemungkinan besar kamu akan dilap dari debu yang menempel.",
  "Ini adalah hari yang baik untuk beristirahat. Berdoalah agar majikanmu lupa menggunakanmu.",
  "Sepertinya kamu akan segera dibersihkan. Nikmati sensasi spa gratis tersebut!",
  "Kamu akan segera bertemu dengan teman lamamu yang sempat hilang di kolong kasur.",
  "Hari ini kamu akan menjadi penyelamat di saat-saat genting. Bersiaplah menjadi pahlawan!",
  "Keberuntungan sedang di pihakmu. Posisi tempatmu diletakkan akan sangat strategis hari ini.",
  // Random/Existential
  "Seseorang akan menatapmu lama hari ini, tapi sayangnya mereka hanya melamun memikirkan cicilan.",
  "Kamu mulai mempertanyakan eksistensimu. Apakah kamu diciptakan hanya untuk berada di sini?",
  "Benda lain di ruangan ini sedang bergosip tentang bentukmu. Jangan dengarkan mereka.",
  "Malam ini, cobalah untuk tidak mengeluarkan suara aneh saat suhu ruangan berubah.",
  "Kamu memiliki potensi yang belum tergali. Sayangnya, kamu tidak punya tangan untuk bergerak.",
  "Sebuah insiden kecil akan membuatmu bergeser 2 centimeter ke kiri. Sebuah perjalanan epik!",
  "Perasaan hampa melandamu. Mungkin kamu butuh stiker baru untuk mempercantik diri.",
  "Kamu bermimpi menjadi barang mewah di etalase, tapi terbangun di atas meja yang berantakan.",
  "Hari ini bukan hari yang baik untuk unjuk gigi. Tetaplah diam berkamuflase di pojokan.",
  "Bintang-bintang meramalkan bahwa kamu akan disentuh oleh tangan yang belum cuci pakai sabun.",
  "Kamu merindukan udara segar pabrik tempatmu dilahirkan. Nostalgia yang kelam.",
  "Ada aura wifi yang kuat di dekatmu, sayangnya kamu tidak bisa connect internet."
];

const COMPATIBILITY = [
  "Sapu Lidi", "Kucing Majikan", "Kabel Kusut", "Remot TV yang Hilang", 
  "Gelas Kopi Setengah Habis", "Ujung Meja Tajam", "Bantal Guling", "Kipas Angin Berdebu",
  "Tupperware Emak", "Solasi Bening yang Ujungnya Hilang", "Charger Rusak Sebelah", "Kaus Kaki Sebelah",
  "Kardus Paket Kosong", "Tutup Panci Berisik", "Karet Gelang Nasi Padang", "Baterai Jam Dinding Mati",
  "Kecoa Terbang", "Gunting Tumpul", "Kunci Motor Nyelip", "Nota Belanja Pudar",
  "Sisir Penuh Rambut", "Sandal Jepit Putus", "Botol Minum Lupa Dicuci", "Pena Macet"
];

const LUCKY_POSITIONS = [
  "Pojok Meja", "Kolong Kasur", "Atas Lemari", "Dalam Laci", "Dekat Jendela",
  "Sebelah Colokan Listrik", "Di Bawah Tumpukan Baju", "Dalam Tas Tidak Terpakai",
  "Di Sela-sela Sofa", "Atas Kulkas", "Teras Depan", "Dekat Tempat Sampah (Waspada)"
];

const LOADING_TEXTS = [
  "Menerawang aura material...",
  "Berkomunikasi dengan roh pabrik...",
  "Menghitung probabilitas kerusakan...",
  "Menyelaraskan frekuensi debu...",
  "Membaca garis takdir benda...",
  "Mendengarkan keluh kesah barang bekas...",
  "Memindai barcode astral..."
];

// --- MAIN COMPONENT ---
export default function App() {
  const [step, setStep] = useState('home'); // home, analyzing, result
  const [formData, setFormData] = useState({ name: '', color: '#8b5cf6', material: 'Plastik' });
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

    for (let i = 0; i < 120; i++) particles.push(new Particle());

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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Pseudo-random agar nama benda yang sama hasilnya selalu sama
  const getPseudoRandom = (seedString) => {
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = seedString.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

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
    // Gunakan kombinasi nama, material, dan warna sebagai seed
    const seed = formData.name.toLowerCase().trim() + formData.material + formData.color;
    const randomNum = getPseudoRandom(seed);
    
    setResult({
      zodiac: ZODIACS[formData.material],
      horoscope: HOROSCOPES[randomNum % HOROSCOPES.length],
      bestFriend: COMPATIBILITY[(randomNum + 1) % COMPATIBILITY.length],
      enemy: COMPATIBILITY[(randomNum + 7) % COMPATIBILITY.length],
      luckyPosition: LUCKY_POSITIONS[randomNum % LUCKY_POSITIONS.length],
      auraScore: (randomNum % 60) + 40 // Range 40 to 99
    });
  };

  const reset = () => {
    setStep('home');
    setFormData({ name: '', color: '#8b5cf6', material: 'Plastik' });
    setResult(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans overflow-x-hidden relative flex flex-col items-center justify-center p-4">
      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-40 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        
        {step === 'home' && (
          <div className="bg-slate-900/70 backdrop-blur-md p-8 rounded-3xl border border-slate-700/50 shadow-2xl text-center transform transition-all animate-fade-in-up">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Sparkles className="w-16 h-16 text-indigo-400 animate-pulse" />
                <Moon className="w-8 h-8 text-yellow-200 absolute -bottom-2 -right-2" />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text drop-shadow-sm">
              Astrologi Benda Mati
            </h1>
            <div className="inline-block bg-indigo-500/20 text-indigo-300 text-xs px-3 py-1 rounded-full mb-6 font-medium border border-indigo-500/30">
              Versi 2.0 - Kini Lebih Absurd
            </div>
            
            <p className="text-slate-400 mb-8 text-sm md:text-base leading-relaxed">
              Benda di sekitarmu juga punya perasaan dan takdir kosmik. Cek ramalan nasib barang kesayanganmu (atau yang paling sering kamu maki) hari ini!
            </p>

            <form onSubmit={handleAnalyze} className="space-y-5 text-left">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nama Benda Spesifik</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder="Contoh: Kipas Angin Miyako, Gelas Retak" 
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all placeholder:text-slate-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-2/3">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Material Utama</label>
                  <select 
                    name="material"
                    value={formData.material}
                    onChange={handleChange}
                    className="w-full bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all appearance-none"
                  >
                    {Object.keys(ZODIACS).map(mat => (
                      <option key={mat} value={mat}>{mat}</option>
                    ))}
                  </select>
                </div>
                <div className="w-full sm:w-1/3">
                  <label className="block text-sm font-medium text-slate-300 mb-1">Warna Dominan</label>
                  <div className="flex items-center gap-3 bg-slate-800/80 border border-slate-600 rounded-xl px-4 py-2 h-[50px] focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-500/50 transition-all">
                    <input 
                      type="color" 
                      name="color"
                      value={formData.color}
                      onChange={handleChange}
                      className="w-full h-full bg-transparent border-none cursor-pointer p-0"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit" 
                className="w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 px-6 rounded-xl shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all active:scale-[0.98] flex justify-center items-center gap-2 group border border-purple-500/50"
              >
                <span className="tracking-wide">Baca Takdir Kosmik</span>
                <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              </button>
            </form>
          </div>
        )}

        {step === 'analyzing' && (
          <div className="flex flex-col items-center justify-center h-64 text-center animate-fade-in">
            <div className="relative w-28 h-28 mb-8">
              <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-purple-500 border-b-pink-500 border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-4 border-l-indigo-400 border-b-purple-400 border-t-pink-400 border-r-transparent rounded-full animate-spin-reverse"></div>
              <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center">
                <Star className="w-8 h-8 text-purple-300 animate-ping" />
              </div>
            </div>
            <h2 className="text-xl font-medium text-purple-300 animate-pulse tracking-wide">{loadingText}</h2>
          </div>
        )}

        {step === 'result' && result && (
          <div className="bg-slate-900/85 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-700/50 shadow-2xl animate-zoom-in relative overflow-hidden">
            
            {/* Ambient glowing effect */}
            <div 
              className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-[80px] opacity-40 mix-blend-screen transition-colors duration-1000"
              style={{ backgroundColor: formData.color }}
            ></div>

            <div className="text-center mb-8 relative z-10">
              <p className="text-xs sm:text-sm text-slate-400 uppercase tracking-[0.2em] mb-2 font-semibold">Buku Takdir Kosmik</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white capitalize leading-tight">
                {formData.name}
              </h2>
            </div>

            <div className="bg-slate-800/60 rounded-2xl p-6 mb-6 border border-slate-700/80 relative z-10 flex flex-col items-center text-center group hover:bg-slate-800/80 transition-colors">
              <div className="p-4 bg-slate-900/80 rounded-full mb-4 text-purple-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                {result.zodiac.icon}
              </div>
              <h3 className="text-xs text-slate-400 mb-1 uppercase tracking-wider font-bold">Rasi Material:</h3>
              <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-3 drop-shadow-sm">
                {result.zodiac.name}
              </p>
              <p className="text-sm text-slate-300 italic px-4">"{result.zodiac.trait}"</p>
            </div>

            <div className="space-y-4 mb-8 relative z-10">
              <div className="bg-indigo-950/40 p-5 rounded-2xl border border-indigo-500/20 shadow-inner">
                <h4 className="flex items-center gap-2 text-indigo-300 font-bold mb-3 text-sm uppercase tracking-wide">
                  <Moon className="w-4 h-4" /> Ramalan Takdir Hari Ini
                </h4>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  {result.horoscope}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                  <h4 className="text-[10px] sm:text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Soulmate Benda</h4>
                  <p className="text-green-400 font-semibold text-sm">{result.bestFriend}</p>
                </div>
                <div className="bg-slate-800/60 p-4 rounded-2xl border border-slate-700/80">
                  <h4 className="text-[10px] sm:text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Musuh Bebuyutan</h4>
                  <p className="text-red-400 font-semibold text-sm">{result.enemy}</p>
                </div>
              </div>

              <div className="bg-slate-800/60 p-5 rounded-2xl border border-slate-700/80 flex justify-between items-center">
                <div>
                  <h4 className="text-[10px] sm:text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Posisi Keberuntungan</h4>
                  <p className="text-yellow-300 font-semibold text-sm">{result.luckyPosition}</p>
                </div>
                <div className="text-right border-l border-slate-700 pl-4">
                  <h4 className="text-[10px] sm:text-xs text-slate-400 mb-1.5 uppercase font-bold tracking-wider">Energi Kosmik</h4>
                  <p className="text-white font-black text-xl sm:text-2xl">{result.auraScore}%</p>
                </div>
              </div>
            </div>

            <button 
              onClick={reset}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 px-6 rounded-xl transition-all active:scale-[0.98] relative z-10 border border-slate-500/50 hover:border-slate-400/50"
            >
              Ramal Benda Lainnya
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
        .animate-spin-reverse { animation: spin-reverse 3s linear infinite; }
      `}} />
    </div>
  );
}

import React, { useState } from 'react';
import { TabType, Language } from './types';
import { Summarizer } from './components/Summarizer';
import { AnimeFinder } from './components/AnimeFinder';
import { Translator } from './components/Translator';
import { UserGuide } from './components/UserGuide';
import { audioService } from './services/audioService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>(TabType.SUMMARIZER);
  const [lang, setLang] = useState<Language>('en');

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    audioService.playClick();
  };

  const t = {
    summarize: lang === 'id' ? 'Ringkasan' : 'Summarize',
    anime: lang === 'id' ? 'Anime-Manga' : 'Anime-Manga',
    translator: lang === 'id' ? 'Terjemahan' : 'Translate',
    precisionHeader: lang === 'id' ? 'Analisis Teks Presisi' : 'Precision Text Analysis',
    otakuHeader: lang === 'id' ? 'Jembatan Otaku' : 'The Otaku Bridge',
    translatorHeader: lang === 'id' ? 'Poliglot AI' : 'AI Polyglot',
    summarizerTitle: lang === 'id' ? 'Kecerdasan untuk' : 'Intelligence for',
    summarizerTitleSub: lang === 'id' ? 'Konten Padat.' : 'Dense Content.',
    animeTitle: lang === 'id' ? 'Temukan Titik' : 'The Manga Start',
    animeTitleSub: lang === 'id' ? 'Mulai Manga.' : 'Finder Tool.',
    translatorTitle: lang === 'id' ? 'Komunikasi' : 'Seamless',
    translatorTitleSub: lang === 'id' ? 'Tanpa Batas.' : 'Translation.',
    summarizerDesc: lang === 'id' 
      ? "Kami memproses kompleksitas menjadi kejelasan. Tempel artikel apa pun dan terima rincian terstruktur dari wawasan paling vital."
      : "We process complexity into clarity. Paste any article and receive a structured breakdown of the most vital insights.",
    animeDesc: lang === 'id'
      ? "Jangan cari di forum lagi. Mesin kami memetakan season anime favorit Anda langsung ke titik kelanjutan manga dengan pelacakan harga langsung."
      : "Never search forums again. Our engine maps your favorite anime seasons directly to their manga continuation points with live price tracking.",
    translatorDesc: lang === 'id'
      ? "Terjemahkan teks antara Bahasa Inggris, Indonesia, dan Jepang dengan akurasi konteks tinggi menggunakan teknologi Gemini."
      : "Translate text between English, Indonesian, and Japanese with high contextual accuracy using Gemini technology.",
    footerNote: lang === 'id' ? "Dibuat untuk produktivitas dan hobi" : "Built for productivity and hobbyists",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-slate-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-slate-100 rounded-full blur-[150px] opacity-40" />
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-2xl">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-black tracking-tighter uppercase">NEXUS</span>
              <span className="text-xl font-light tracking-tighter text-slate-400 ml-0.5">AI</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="hidden lg:flex bg-slate-100/50 p-1 rounded-lg border border-slate-200/50 mr-2">
              <button 
                onClick={() => { setLang('en'); audioService.playSwitch(); }}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded ${lang === 'en' ? 'bg-black text-white' : 'text-slate-400'}`}
              >EN</button>
              <button 
                onClick={() => { setLang('id'); audioService.playSwitch(); }}
                className={`px-3 py-1 text-[10px] font-black uppercase rounded ${lang === 'id' ? 'bg-black text-white' : 'text-slate-400'}`}
              >ID</button>
            </div>

            <div className="flex bg-slate-100/50 p-1.5 rounded-xl border border-slate-200/50">
              <button
                onClick={() => handleTabChange(TabType.SUMMARIZER)}
                className={`px-3 sm:px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${
                  activeTab === TabType.SUMMARIZER ? 'bg-white text-black shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.summarize}
              </button>
              <button
                onClick={() => handleTabChange(TabType.ANIME_FINDER)}
                className={`px-3 sm:px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${
                  activeTab === TabType.ANIME_FINDER ? 'bg-white text-black shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.anime}
              </button>
              <button
                onClick={() => handleTabChange(TabType.TRANSLATOR)}
                className={`px-3 sm:px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all duration-300 ${
                  activeTab === TabType.TRANSLATOR ? 'bg-white text-black shadow-md border border-slate-200' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {t.translator}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-24 pb-16 px-6 text-center max-w-5xl mx-auto">
        <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase text-slate-500 mb-8 border border-slate-200">
           {activeTab === TabType.SUMMARIZER ? t.precisionHeader : activeTab === TabType.ANIME_FINDER ? t.otakuHeader : t.translatorHeader}
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-black mb-8 tracking-tighter leading-[1.1]">
          {activeTab === TabType.SUMMARIZER ? (
            <>
              {t.summarizerTitle}<br />
              <span className="text-slate-400 font-light">{t.summarizerTitleSub}</span>
            </>
          ) : activeTab === TabType.ANIME_FINDER ? (
            <>
              {t.animeTitle}<br />
              <span className="text-slate-400 font-light">{t.animeTitleSub}</span>
            </>
          ) : (
            <>
              {t.translatorTitle}<br />
              <span className="text-slate-400 font-light">{t.translatorTitleSub}</span>
            </>
          )}
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-light mb-16">
          {activeTab === TabType.SUMMARIZER ? t.summarizerDesc : activeTab === TabType.ANIME_FINDER ? t.animeDesc : t.translatorDesc}
        </p>

        <UserGuide activeTab={activeTab} lang={lang} />
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-slate-200 to-transparent" />
        {activeTab === TabType.SUMMARIZER ? <Summarizer lang={lang} /> : activeTab === TabType.ANIME_FINDER ? <AnimeFinder lang={lang} /> : <Translator lang={lang} />}
      </main>

      {/* Footer */}
      <footer className="mt-32 border-t border-slate-100 py-20 bg-slate-50/50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50">
            <div className="w-8 h-8 bg-black rounded-lg" />
            <span className="text-lg font-black tracking-tighter uppercase">NEXUS AI</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            {t.footerNote} • © 2024
          </p>
          <div className="flex gap-6 text-xs font-black uppercase tracking-widest text-slate-400">
            <span className="hover:text-black cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-black cursor-pointer transition-colors">API</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;

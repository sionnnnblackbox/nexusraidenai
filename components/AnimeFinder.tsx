
import React, { useState } from 'react';
import { findAnimeContinuation } from '../services/aiService';
import { AnimeContinuationResult, Language } from '../types';
import { GlassCard } from './GlassCard';
import { audioService } from '../services/audioService';

interface AnimeFinderProps {
  lang: Language;
}

export const AnimeFinder: React.FC<AnimeFinderProps> = ({ lang }) => {
  const [title, setTitle] = useState('');
  const [season, setSeason] = useState('1');
  const [synopsisLang, setSynopsisLang] = useState<Language>(lang);
  const [result, setResult] = useState<AnimeContinuationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = {
    titleLabel: lang === 'id' ? 'Judul Anime' : 'Anime Title',
    seasonLabel: lang === 'id' ? 'Season Terakhir' : 'Last Season',
    synopsisLangLabel: lang === 'id' ? 'Bahasa Sinopsis' : 'Synopsis Language',
    findBtn: lang === 'id' ? 'Cari Lanjutan' : 'Locate Continuation',
    searching: lang === 'id' ? 'Mencari di Arsip Manga...' : 'Searching archives...',
    mangaStart: lang === 'id' ? 'Titik Mulai Manga' : 'Manga Pick-up',
    synopsisTitle: lang === 'id' ? 'Alur Cerita Berikutnya' : 'Next Arc Story',
    marketTitle: lang === 'id' ? 'Ketersediaan & Harga' : 'Availability & Pricing',
    storeHeader: lang === 'id' ? 'Toko' : 'Store',
    formatHeader: lang === 'id' ? 'Format' : 'Format',
    priceHeader: lang === 'id' ? 'Harga' : 'Price',
    shopBtn: lang === 'id' ? 'Kunjungi' : 'Visit',
    domestic: lang === 'id' ? 'Lokal' : 'Local',
    international: lang === 'id' ? 'Global' : 'Global',
    chapterInfo: lang === 'id' ? 'Lanjut dari Chapter' : 'Start from Chapter',
    volumeInfo: lang === 'id' ? 'Tersedia di' : 'Found in',
  };

  const handleSearch = async () => {
    if (!title.trim()) return;
    audioService.playClick();
    setLoading(true);
    setError(null);
    try {
      const data = await findAnimeContinuation(title, season, synopsisLang);
      setResult(data);
      audioService.playSuccess();
    } catch (err) {
      setError(lang === 'id' ? 'Gagal menemukan info. Coba lagi.' : 'Failed to find info. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-12 animate-fade-in max-w-7xl mx-auto pb-20">
      {/* Input Section - Sleek Dashboard Style */}
      <div className="relative">
        <div className="absolute inset-0 bg-slate-900 rounded-[2.5rem] -z-10 transform -rotate-1 opacity-[0.03]" />
        <div className="bg-white border border-slate-200 p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-100 flex flex-col md:flex-row gap-8 items-end">
          <div className="flex-1 space-y-2 w-full">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t.titleLabel}</label>
            <div className="relative group">
              <input
                type="text"
                className="w-full pl-12 pr-6 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-bold text-lg"
                placeholder="e.g., Attack on Titan"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          <div className="w-full md:w-32 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t.seasonLabel}</label>
            <input
              type="number"
              min="1"
              className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-bold text-lg text-center"
              value={season}
              onChange={(e) => setSeason(e.target.value)}
            />
          </div>

          <div className="w-full md:w-48 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">{t.synopsisLangLabel}</label>
            <select
              value={synopsisLang}
              onChange={(e) => setSynopsisLang(e.target.value as Language)}
              className="w-full px-5 py-4 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:ring-1 focus:ring-black focus:border-black outline-none transition-all font-black text-[10px] uppercase tracking-widest cursor-pointer"
            >
              <option value="en">English</option>
              <option value="id">Indonesia</option>
              <option value="ja">Japanese</option>
            </select>
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !title}
            className="w-full md:w-auto px-10 py-4 bg-black hover:bg-slate-800 text-white font-black rounded-2xl shadow-2xl transition-all active:scale-95 disabled:opacity-30 flex items-center justify-center gap-3 uppercase tracking-widest text-xs h-[60px]"
          >
            {loading ? (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            ) : t.findBtn}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-5 bg-red-50 text-red-600 rounded-2xl border border-red-100 text-sm font-bold animate-fade-in text-center">
          {error}
        </div>
      )}

      {/* Results Section - Cinematic Layout */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 animate-fade-in">
          
          {/* Cover Art - HD Focus */}
          <div className="lg:col-span-4 space-y-6">
            <div className="group relative rounded-[2rem] overflow-hidden shadow-2xl shadow-slate-200 bg-slate-100 aspect-[2/3]">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img 
                src={result.volumeImageUrl} 
                alt="Volume Cover HD"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = "https://placehold.co/600x900?text=No+HD+Cover")}
              />
              <div className="absolute bottom-6 left-6 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                <span className="text-white font-black text-xs uppercase tracking-[0.2em] bg-black/40 backdrop-blur px-3 py-1 rounded-full">Official Cover Art</span>
              </div>
            </div>
            
            <GlassCard className="p-6 text-center border-slate-100">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{t.volumeInfo}</span>
               <h3 className="text-2xl font-black text-slate-800">{result.nextVolume}</h3>
            </GlassCard>
          </div>

          {/* Main Info */}
          <div className="lg:col-span-8 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Highlight Card: Chapter */}
              <div className="bg-black p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-300 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 group-hover:scale-110 transition-transform duration-700" />
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] block mb-4">{t.mangaStart}</span>
                <h4 className="text-3xl font-black leading-tight">{result.nextChapter}</h4>
                <div className="mt-6 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span className="text-xs font-bold text-slate-300 italic">{t.chapterInfo} {result.nextChapter.match(/\d+/)?.[0] || 'X'}</span>
                </div>
              </div>

              {/* Highlight Card: Synopsis Title */}
              <GlassCard className="p-8 border-slate-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-1 h-6 bg-black rounded-full" />
                  <h4 className="text-lg font-black uppercase tracking-tight text-slate-800">{t.synopsisTitle}</h4>
                </div>
                <p className="text-slate-500 font-light leading-relaxed text-sm line-clamp-6 italic">
                  "{result.synopsis}"
                </p>
              </GlassCard>
            </div>

            {/* Marketplace Table - Modernized */}
            <GlassCard className="border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-800">{t.marketTitle}</h4>
                <div className="flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-slate-200" />
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-50">
                    {result.marketplaces.map((market, idx) => (
                      <tr key={idx} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black text-xs text-slate-400 group-hover:bg-white transition-colors">
                               {market.name[0]}
                             </div>
                             <div>
                               <div className="font-black text-slate-800 text-sm">{market.name}</div>
                               <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                 {market.isInternational ? t.international : t.domestic}
                               </div>
                             </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                           <div className="text-[10px] font-black text-slate-500 uppercase tracking-tighter bg-white border border-slate-100 px-3 py-1 rounded-full inline-block">
                              {market.format}
                           </div>
                        </td>
                        <td className="px-8 py-6">
                           <span className="font-mono text-sm font-bold text-slate-700">
                             {market.priceIDR || market.priceUSD}
                           </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <a
                            href={market.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center w-10 h-10 bg-slate-100 text-slate-900 rounded-xl hover:bg-black hover:text-white transition-all shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </div>
  );
};

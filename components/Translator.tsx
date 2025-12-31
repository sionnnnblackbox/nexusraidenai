
import React, { useState } from 'react';
import { translateText } from '../services/aiService';
import { Language } from '../types';
import { GlassCard } from './GlassCard';
import { audioService } from '../services/audioService';

export const Translator: React.FC<{ lang: Language }> = ({ lang }) => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [sourceLang, setSourceLang] = useState<Language>('en');
  const [targetLang, setTargetLang] = useState<Language>('id');
  const [loading, setLoading] = useState(false);

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    try {
      const result = await translateText(inputText, sourceLang, targetLang);
      setOutputText(result);
      audioService.playSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const swapLangs = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    audioService.playSwitch();
  };

  const langNames = { id: 'Indonesia', en: 'English', ja: 'Japanese' };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <select 
          value={sourceLang} 
          onChange={(e) => setSourceLang(e.target.value as Language)}
          className="bg-transparent font-black text-xs uppercase tracking-widest outline-none px-4 py-2"
        >
          {Object.entries(langNames).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>

        <button 
          onClick={swapLangs}
          className="p-3 bg-white border border-slate-200 rounded-full hover:bg-black hover:text-white transition-all shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        <select 
          value={targetLang} 
          onChange={(e) => setTargetLang(e.target.value as Language)}
          className="bg-transparent font-black text-xs uppercase tracking-widest outline-none px-4 py-2"
        >
          {Object.entries(langNames).map(([code, name]) => (
            <option key={code} value={code}>{name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <textarea
            className="w-full h-48 bg-transparent text-lg font-light outline-none resize-none"
            placeholder="Type text to translate..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </GlassCard>
        <GlassCard className="p-6 bg-slate-50/50">
          <div className="w-full h-48 text-lg font-light overflow-y-auto">
            {loading ? (
              <div className="animate-pulse flex space-y-2 flex-col">
                <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                <div className="h-4 bg-slate-200 rounded w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-5/6"></div>
              </div>
            ) : outputText || (
              <span className="text-slate-300 italic">Translation will appear here...</span>
            )}
          </div>
        </GlassCard>
      </div>

      <button
        onClick={handleTranslate}
        disabled={loading || !inputText}
        className="w-full py-4 bg-black text-white font-black rounded-2xl shadow-xl transition-all hover:bg-slate-800 disabled:opacity-30"
      >
        {loading ? 'Translating...' : 'Translate Now'}
      </button>
    </div>
  );
};


import React, { useState, useRef, useEffect } from 'react';
import { summarizeText, chatWithSummary } from '../services/aiService';
import { SummaryLength, SummaryResult, Language, ChatMessage } from '../types';
import { GlassCard } from './GlassCard';
import { audioService } from '../services/audioService';

interface SummarizerProps {
  lang: Language;
}

export const Summarizer: React.FC<SummarizerProps> = ({ lang }) => {
  const [text, setText] = useState('');
  const [length, setLength] = useState<SummaryLength>('medium');
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const t = {
    placeholder: lang === 'id' ? 'Tempel konten Anda di sini...' : 'Paste your content here...',
    generateBtn: lang === 'id' ? 'Ringkas Sekarang' : 'Generate Summary',
    processing: lang === 'id' ? 'Sedang Memproses' : 'Processing',
    summaryTitle: lang === 'id' ? 'Ringkasan Padat' : 'Cohesive Summary',
    highlightsTitle: lang === 'id' ? 'Poin Penting' : 'Key Highlights',
    takeawaysTitle: lang === 'id' ? 'Kesimpulan' : 'Takeaways',
    qaTitle: lang === 'id' ? 'Tanya Jawab Ringkasan' : 'Summary Q&A',
    qaPlaceholder: lang === 'id' ? 'Tanyakan sesuatu tentang teks ini...' : 'Ask something about this text...',
    send: lang === 'id' ? 'Kirim' : 'Send',
    short: lang === 'id' ? 'pendek' : 'short',
    medium: lang === 'id' ? 'sedang' : 'medium',
    detailed: lang === 'id' ? 'lengkap' : 'detailed',
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSummarize = async () => {
    if (!text.trim()) return;
    audioService.playClick();
    setLoading(true);
    setError(null);
    setChatMessages([]);
    try {
      const data = await summarizeText(text, length, lang);
      setResult(data);
      audioService.playSuccess();
    } catch (err) {
      setError(lang === 'id' ? 'Gagal meringkas teks.' : 'Failed to summarize text.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !result || chatLoading) return;
    
    audioService.playClick();
    const userMsg = chatInput.trim();
    setChatInput('');
    const newHistory: ChatMessage[] = [...chatMessages, { role: 'user', text: userMsg }];
    setChatMessages(newHistory);
    setChatLoading(true);

    try {
      const aiResponse = await chatWithSummary(text, result.summary, userMsg, chatMessages, lang);
      setChatMessages([...newHistory, { role: 'model', text: aiResponse }]);
      audioService.playSuccess();
    } catch (err) {
      console.error(err);
      setChatMessages([...newHistory, { role: 'model', text: lang === 'id' ? 'Maaf, terjadi kesalahan.' : 'Sorry, an error occurred.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        <textarea
          className="w-full h-56 p-6 bg-white border border-slate-200 rounded-2xl focus:ring-1 focus:ring-black focus:border-black outline-none transition-all resize-none shadow-[0_2px_15px_rgb(0,0,0,0.02)]"
          placeholder={t.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex bg-slate-100/50 p-1.5 rounded-xl w-full sm:w-auto border border-slate-200/50">
            {(['short', 'medium', 'detailed'] as SummaryLength[]).map((l) => (
              <button
                key={l}
                onClick={() => { setLength(l); audioService.playSwitch(); }}
                className={`flex-1 px-5 py-2 text-xs font-bold rounded-lg capitalize transition-all duration-300 ${
                  length === l ? 'bg-black text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t[l]}
              </button>
            ))}
          </div>
          
          <button
            onClick={handleSummarize}
            disabled={loading || !text}
            className="w-full sm:w-auto px-10 py-3.5 bg-black hover:bg-slate-800 text-white font-bold rounded-xl shadow-xl transition-all active:scale-[0.98] disabled:opacity-30 disabled:pointer-events-none group"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                {t.processing}
              </span>
            ) : (
              <span className="flex items-center gap-2 justify-center">
                {t.generateBtn}
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-8 pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <GlassCard className="p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1.5 h-6 bg-black rounded-full" />
                <h3 className="text-xl font-bold text-slate-900">{t.summaryTitle}</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-lg font-light">
                {result.summary}
              </p>
            </GlassCard>

            <div className="space-y-8">
              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-black rounded-full" />
                  <h3 className="text-xl font-bold text-slate-900">{t.highlightsTitle}</h3>
                </div>
                <ul className="space-y-4">
                  {result.bulletPoints.map((point, i) => (
                    <li key={i} className="flex items-start gap-4 text-slate-600 group">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-black transition-colors shrink-0" />
                      <span className="text-base font-light">{point}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard className="p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-1.5 h-6 bg-black rounded-full" />
                  <h3 className="text-xl font-bold text-slate-900">{t.takeawaysTitle}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {result.keyTakeaways.map((takeaway, i) => (
                    <span key={i} className="px-4 py-1.5 bg-slate-50 text-slate-900 text-xs font-bold rounded-full border border-slate-200">
                      {takeaway}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>

          <GlassCard className="p-8 max-w-4xl mx-auto border-black/10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-black rounded-full" />
              <h3 className="text-xl font-bold text-slate-900">{t.qaTitle}</h3>
            </div>
            
            <div className="h-64 overflow-y-auto mb-6 space-y-4 pr-2 custom-scrollbar">
              {chatMessages.length === 0 && (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm font-light italic">
                  {lang === 'id' ? 'Ajukan pertanyaan tentang konten di atas.' : 'Ask questions about the content above.'}
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                    msg.role === 'user' 
                    ? 'bg-black text-white rounded-br-none' 
                    : 'bg-slate-100 text-slate-800 rounded-bl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-400 px-4 py-2 rounded-2xl text-sm rounded-bl-none animate-pulse">
                    ...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t.qaPlaceholder}
                className="flex-1 px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-black outline-none transition-all"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                disabled={chatLoading || !chatInput.trim()}
                className="px-4 py-2 bg-black text-white text-xs font-bold rounded-xl disabled:opacity-30 transition-all hover:bg-slate-800"
              >
                {t.send}
              </button>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

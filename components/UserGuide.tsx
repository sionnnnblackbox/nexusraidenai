
import React from 'react';
import { TabType, Language } from '../types';

interface UserGuideProps {
  activeTab: TabType;
  lang: Language;
}

export const UserGuide: React.FC<UserGuideProps> = ({ activeTab, lang }) => {
  const summarizerSteps = lang === 'id' ? [
    { number: '01', title: 'Input Teks', desc: 'Tempel konten Anda ke ruang kerja.' },
    { number: '02', title: 'Pilih Detail', desc: 'Pilih kedalaman ringkasan: pendek, sedang, atau lengkap.' },
    { number: '03', title: 'Dapatkan Wawasan', desc: 'AI mengekstrak poin penting dan kesimpulan secara instan.' }
  ] : [
    { number: '01', title: 'Input Text', desc: 'Paste your content into the workspace.' },
    { number: '02', title: 'Select Detail', desc: 'Choose between short, medium, or detailed depth.' },
    { number: '03', title: 'Get Insights', desc: 'AI extracts key takeaways and main points instantly.' }
  ];

  const animeSteps = lang === 'id' ? [
    { number: '01', title: 'Cari Seri', desc: 'Masukkan nama anime dan season terakhir.' },
    { number: '02', title: 'Lanjutan Manga', desc: 'AI menunjukkan chapter tepat dan gambar cover HD.' },
    { number: '03', title: 'Banding Harga', desc: 'Cek harga Tokopedia, Shopee, hingga Amazon secara real-time.' }
  ] : [
    { number: '01', title: 'Find Series', desc: 'Enter the anime name and the last season watched.' },
    { number: '02', title: 'Locate Manga', desc: 'AI pinpoints exact chapter and shows HD cover image.' },
    { number: '03', title: 'Compare Prices', desc: 'View direct links and live local/international pricing.' }
  ];

  const translatorSteps = lang === 'id' ? [
    { number: '01', title: 'Pilih Bahasa', desc: 'Atur bahasa asal dan bahasa tujuan (ID, EN, JA).' },
    { number: '02', title: 'Tulis Teks', desc: 'Ketik atau tempel teks yang ingin diterjemahkan.' },
    { number: '03', title: 'Hasil Instan', desc: 'AI memberikan terjemahan dengan konteks yang akurat.' }
  ] : [
    { number: '01', title: 'Pick Languages', desc: 'Set source and target languages (ID, EN, JA).' },
    { number: '02', title: 'Enter Text', desc: 'Type or paste the content you want to translate.' },
    { number: '03', title: 'Instant Result', desc: 'AI provides translations with high contextual accuracy.' }
  ];

  const steps = 
    activeTab === TabType.SUMMARIZER ? summarizerSteps : 
    activeTab === TabType.ANIME_FINDER ? animeSteps : 
    translatorSteps;

  return (
    <div className="mb-12 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
        <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 px-4">
          {lang === 'id' ? 'Cara Kerja' : 'How it works'}
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        {steps.map((step, idx) => (
          <div key={idx} className="group relative">
            <div className="flex items-start gap-4">
              <span className="text-4xl font-black text-slate-100 group-hover:text-slate-200 transition-colors duration-500 select-none">
                {step.number}
              </span>
              <div className="pt-2">
                <h3 className="text-sm font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.desc}</p>
              </div>
            </div>
            {idx < steps.length - 1 && (
              <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2">
                <svg className="w-4 h-4 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

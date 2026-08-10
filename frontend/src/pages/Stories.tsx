import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';

const ALL_STORIES = [
    {
        quote: 'Saved what I needed in minutes.',
        name: 'Amara S.',
        role: 'Patient relative',
        avatar: 'AS',
        detail: 'My father needed an urgent surgery and we had no idea where to find the kit. SurgiMap showed us three nearby pharmacies within seconds. We reached the pharmacy in 10 minutes. I cannot imagine going through that panic without this platform.'
    },
    {
        quote: 'These are always clear and reliable info.',
        name: 'Dr. Nimal P.',
        role: 'Surgeon',
        avatar: 'NP',
        detail: 'As a surgeon, I often need to advise families on where to source specific kits quickly. SurgiMap has become my go-to recommendation. The accuracy of stock data is impressive and saves critical time before procedures.'
    },
    {
        quote: 'No hassle — just quick, simple searches.',
        name: 'Kavindi R.',
        role: 'Nurse',
        avatar: 'KR',
        detail: 'Working in a busy ward, I often get asked by families where to find surgical supplies. SurgiMap is the first thing I open now. It is fast, simple, and always shows accurate results near our hospital.'
    },
    {
        quote: 'Always up to date on local stock.',
        name: 'Anura Silva',
        role: 'Pharmacist',
        avatar: 'AS',
        detail: 'Since joining the SurgiMap network, more patients are finding us directly. The platform keeps our stock visible to people who need it most and the real-time sync means our data is always accurate.'
    },
    {
        quote: 'Helpful support every step of the way.',
        name: 'Jordan Blake',
        role: 'Healthcare assistant',
        avatar: 'JB',
        detail: 'I work with elderly patients who cannot travel far. SurgiMap helped us find a pharmacy within walking distance that had the exact dressing kit we needed. The distance filter is such a thoughtful feature.'
    },
    {
        quote: 'Saves me time every single day.',
        name: 'Champi Weli',
        role: 'Patient',
        avatar: 'CW',
        detail: 'After my operation, I needed regular dressing kits for recovery. Instead of calling pharmacies one by one, I just search on SurgiMap. It has saved me so much time and stress during a really difficult recovery period.'
    }
];

export function Stories() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-iceWhite text-obsidian font-sans overflow-x-hidden">

            {/* Top bar with back button - same pattern as MapView */}
            <div className="bg-white border-b border-silverMist px-6 md:px-12 py-5 flex items-center gap-4 sticky top-0 z-50">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-arcticNavy font-bold hover:opacity-70 transition-opacity">
                    <ArrowLeftIcon className="w-5 h-5" />
                    Back
                </button>
                <span className="text-sm text-steelBlue font-medium">Community stories</span>
            </div>

            {/* Header */}
            <section className="max-w-6xl mx-auto px-8 md:px-16 pt-16 pb-8">
                <p className="text-arcticNavy font-bold tracking-[0.2em] uppercase text-sm mb-4">
                    Community Voice
                </p>
                <h1 className="text-4xl md:text-6xl font-black text-obsidian tracking-tighter leading-none mb-6">
                    Trusted by those who
                    <br />
                    <span className="text-arcticNavy">care the most.</span>
                </h1>
                <p className="text-steelBlue text-lg max-w-xl leading-relaxed">
                    Real stories from patients, families, surgeons, and pharmacists across Sri Lanka.
                </p>
            </section>

            {/* All Stories */}
            <section className="max-w-6xl mx-auto px-8 md:px-16 pb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {ALL_STORIES.map((s, i) => (
                        <div
                            key={i}
                            className="bg-white border border-silverMist rounded-[2.5rem] p-10 hover:shadow-2xl hover:shadow-arcticNavy/5 hover:border-arcticNavy/20 transition-all flex flex-col justify-between">
                            <div>
                                <p className="text-obsidian text-xl font-medium leading-relaxed mb-6 tracking-tight">
                                    "{s.quote}"
                                </p>
                                <p className="text-steelBlue text-base leading-relaxed mb-10">
                                    {s.detail}
                                </p>
                            </div>
                            <div className="flex items-center gap-4 border-t border-silverMist/30 pt-8">
                                <div className="w-14 h-14 rounded-2xl bg-arcticNavy text-iceWhite flex items-center justify-center font-black text-sm shadow-lg shadow-arcticNavy/20">
                                    {s.avatar}
                                </div>
                                <div>
                                    <p className="font-bold text-obsidian text-base">{s.name}</p>
                                    <p className="text-xs text-steelBlue font-bold uppercase tracking-widest">{s.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}

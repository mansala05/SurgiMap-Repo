import { useNavigate } from 'react-router-dom';
import {
  SearchIcon,
  RefreshCcwIcon,
  HelpCircleIcon,
  ArrowLeftIcon } from
'lucide-react';
import { motion } from 'framer-motion';
export function NoResults() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-iceWhite text-obsidian font-sans selection:bg-arcticNavy/10 overflow-x-hidden flex flex-col items-center justify-center py-12 px-6">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="w-full max-w-2xl bg-white border border-silverMist rounded-[3rem] p-12 md:p-20 text-center shadow-2xl shadow-arcticNavy/5">
        
        {/* Icon */}
        <div className="w-24 h-24 bg-glacierBlue/10 rounded-full flex items-center justify-center mx-auto mb-10">
          <SearchIcon className="w-10 h-10 text-arcticNavy opacity-40" />
        </div>

        {/* Message */}
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-arcticNavy mb-6">
          No pharmacies found
        </h1>
        <p className="text-xl text-steelBlue font-medium leading-relaxed mb-12 max-w-md mx-auto">
          We couldn't find any pharmacies with that specific kit in stock right
          now.
        </p>

        {/* Suggestions */}
        <div className="bg-iceWhite rounded-3xl p-8 mb-12 text-left space-y-6 border border-silverMist/50">
          <h3 className="text-sm font-black uppercase tracking-widest text-arcticNavy flex items-center gap-2">
            <HelpCircleIcon className="w-4 h-4" />
            Suggestions
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3 text-steelBlue">
              <div className="w-1.5 h-1.5 rounded-full bg-glacierBlue mt-2.5 shrink-0" />
              <p className="text-base font-medium">
                Check the spelling of the kit name
              </p>
            </li>
            <li className="flex items-start gap-3 text-steelBlue">
              <div className="w-1.5 h-1.5 rounded-full bg-glacierBlue mt-2.5 shrink-0" />
              <p className="text-base font-medium">
                Try a more general term (e.g., "suture" instead of a specific
                brand)
              </p>
            </li>
            <li className="flex items-start gap-3 text-steelBlue">
              <div className="w-1.5 h-1.5 rounded-full bg-glacierBlue mt-2.5 shrink-0" />
              <p className="text-base font-medium">
                Search for the procedure name instead
              </p>
            </li>
          </ul>
        </div>

        {/* Action Button */}
        <button
          onClick={() => navigate('/search')}
          className="inline-flex items-center gap-3 bg-arcticNavy text-iceWhite px-12 py-5 rounded-2xl text-lg font-bold shadow-xl hover:bg-obsidian hover:-translate-y-1 transition-all active:scale-95 group">
          
          <RefreshCcwIcon className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          Search Again
        </button>

        <div className="mt-12">
          <button
            onClick={() => navigate('/')}
            className="text-steelBlue hover:text-arcticNavy font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2 mx-auto transition-colors">
            
            <ArrowLeftIcon className="w-4 h-4" />
            Back to Home
          </button>
        </div>
      </motion.div>

      {/* Branding Footer */}
      <div className="mt-12 text-center opacity-40">
        <span className="text-2xl font-black tracking-tighter text-arcticNavy">
          surgimap
        </span>
      </div>
    </div>);

}

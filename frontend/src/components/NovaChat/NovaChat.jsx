import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  TbMessageCircle,
  TbX,
  TbSparkles,
  TbSend,
} from "react-icons/tb";

// NOTE: This is a UI shell with canned/rule-based replies.
// To make Nova "real", wire handleSend to your own backend endpoint that
// calls an LLM (e.g. POST /api/chat) — never call a model API directly from
// the browser with a secret key.
const QUICK_REPLIES = ['Track my order', 'Return policy', 'Shipping time', 'Talk to a human'];

const CANNED_RESPONSES = {
  'track my order': "You can track any order from the 'Track Order' page in the navbar — just enter your order number (e.g. AX-12345678).",
  'return policy': 'We offer a 7-day, no-questions-asked return window from the date of delivery. Items must be unused and in original packaging.',
  'shipping time': 'Standard delivery takes 3-5 business days across India. Orders above ₹999 ship free.',
  'talk to a human': "I've flagged this conversation for our support team — they'll reach out at the email on your account within 24 hours.",
};

const NovaChat = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'nova', text: "Hi! I'm Nova, your AETHRIX shopping assistant. How can I help today?" },
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const reply = (text) => {
    const key = text.trim().toLowerCase();
    const found = CANNED_RESPONSES[key];
    return found || "I've noted that — for detailed help, our support team will follow up via email shortly.";
  };

  const handleSend = (text) => {
    const value = (text ?? input).trim();
    if (!value) return;
    setMessages((m) => [...m, { from: 'user', text: value }]);
    setInput('');
    setTimeout(() => {
      setMessages((m) => [...m, { from: 'nova', text: reply(value) }]);
    }, 500);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-[150] w-14 h-14 rounded-full bg-accent hover:bg-accent-dim shadow-glow flex items-center justify-center text-xl transition-transform hover:scale-105"
      >
        {open ? <TbX /> : <TbMessageCircle />}
      </button>

      {!open && (
        <div className="fixed bottom-24 right-6 z-[150] glass px-4 py-2 text-xs hidden md:flex items-center gap-2 animate-floatY">
          <TbSparkles className="text-accent-glow" />
          <span>Need Help? Chat with Nova</span>
        </div>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-[150] w-[340px] max-w-[92vw] h-[460px] bg-base-900 border border-white/10 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-gradient-to-r from-accent/15 to-transparent">
              <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                <TbSparkles />
              </div>
              <div>
                <div className="text-sm font-semibold">Nova Assistant</div>
                <div className="text-[10px] text-accent-glow flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" /> Online
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[80%] text-sm px-3.5 py-2.5 rounded-lg leading-relaxed ${m.from === 'nova' ? 'bg-white/5 self-start' : 'bg-accent self-end ml-auto'
                    }`}
                >
                  {m.text}
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <div className="px-4 pb-2 flex gap-2 flex-wrap">
              {QUICK_REPLIES.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="text-[10px] border border-white/10 hover:border-accent px-2.5 py-1.5 rounded-full text-white/55 hover:text-white transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2 p-3 border-t border-white/10"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-white/5 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-accent"
              />
              <button type="submit" className="w-9 h-9 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <TbSend size={15} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NovaChat;

'use client';

import { useFormStatus } from 'react-dom';
import { Send, Loader2 } from 'lucide-react';

export default function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full h-12 bg-black text-white text-[15px] font-normal
        flex items-center justify-center gap-2
        hover:bg-[#333] transition-colors duration-200
        disabled:opacity-60 disabled:cursor-not-allowed"
      style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
    >
      {pending ? (
        <>
          <Loader2 size={16} className="animate-spin" aria-hidden="true" />
          Memproses...
        </>
      ) : (
        <>
          <Send size={16} strokeWidth={1.5} aria-hidden="true" />
          Kirim via WhatsApp
        </>
      )}
    </button>
  );
}

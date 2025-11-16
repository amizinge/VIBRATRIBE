'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import clsx from 'clsx';

export default function Composer() {
  const [body, setBody] = useState('');
  const [media, setMedia] = useState<File | null>(null);

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append('body', body);
      if (media) {
        formData.append('media', media);
      }
      const res = await axios.post('/api/app/posts', formData);
      return res.data;
    },
    onSuccess: () => {
      setBody('');
      setMedia(null);
    }
  });

  const disabled = !body || mutation.isPending;

  return (
    <div className="bg-surface border border-white/5 rounded-2xl p-4 space-y-3">
      <textarea
        value={body}
        onChange={(event) => {
          const target = event.target as HTMLTextAreaElement;
          setBody(target.value);
        }}
        placeholder="Drop your signal..."
        className="w-full bg-transparent border border-white/5 rounded-2xl p-3 text-sm focus:outline-none focus:border-accent min-h-[120px]"
      />
      <div className="flex items-center justify-between text-sm">
        <label className="text-accent cursor-pointer">
          <input
            type="file"
            accept="image/*,video/*"
            className="hidden"
            onChange={event => setMedia(event.target.files?.[0] ?? null)}
          />
          Attach media
        </label>
        <button
          onClick={() => mutation.mutate()}
          disabled={disabled}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
            disabled ? 'bg-white/10 text-gray-400 cursor-not-allowed' : 'bg-accent text-white hover:bg-accentMuted'
          )}
        >
          {mutation.isPending ? 'Broadcasting...' : 'Broadcast'}
        </button>
      </div>
    </div>
  );
}

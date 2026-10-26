/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, ExternalLink, Code2, AlertCircle } from 'lucide-react';
import { validateEventData } from '../lib/event-utils';

interface ContributeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContributeModal: React.FC<ContributeModalProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [category, setCategory] = useState('Hackathon');
  const [mode, setMode] = useState<'Online' | 'Offline' | 'Hybrid'>('Offline');
  const [eventDate, setEventDate] = useState('2026-11-20');
  const [endDate, setEndDate] = useState('2026-11-21');
  const [regDeadline, setRegDeadline] = useState('2026-11-15');
  const [regUrl, setRegUrl] = useState('');
  const [city, setCity] = useState('Chennai');
  const [venue, setVenue] = useState('');
  const [fee, setFee] = useState('Free');
  const [tagsInput, setTagsInput] = useState('Hackathon, Students, AI');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const parsedTags = tagsInput
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const eventPayload = {
    title: title || 'My College Event',
    description: description || 'Description of the college event.',
    organizer: organizer || 'College Tech Club',
    category,
    mode,
    event_date: eventDate,
    end_date: endDate || undefined,
    registration_deadline: regDeadline || undefined,
    registration_url: regUrl || undefined,
    city: city || undefined,
    venue: venue || undefined,
    fee: fee || undefined,
    tags: parsedTags
  };

  const validation = validateEventData(eventPayload);

  const slug = (title || 'my-college-event')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const filename = `${slug || 'new-event'}.toml`;

  const tomlOutput = [
    `title = "${eventPayload.title.replace(/"/g, '\\"')}"`,
    `description = "${eventPayload.description.replace(/"/g, '\\"')}"`,
    `organizer = "${eventPayload.organizer.replace(/"/g, '\\"')}"`,
    `category = "${eventPayload.category}"`,
    `mode = "${eventPayload.mode}"`,
    `event_date = "${eventPayload.event_date}"`,
    eventPayload.end_date ? `end_date = "${eventPayload.end_date}"` : null,
    eventPayload.registration_deadline
      ? `registration_deadline = "${eventPayload.registration_deadline}"`
      : null,
    eventPayload.registration_url
      ? `registration_url = "${eventPayload.registration_url}"`
      : null,
    eventPayload.city ? `city = "${eventPayload.city}"` : null,
    eventPayload.venue ? `venue = "${eventPayload.venue.replace(/"/g, '\\"')}"` : null,
    eventPayload.fee ? `fee = "${eventPayload.fee}"` : null,
    eventPayload.tags.length > 0
      ? `tags = [${eventPayload.tags.map((t) => `"${t}"`).join(', ')}]`
      : null
  ]
    .filter(Boolean)
    .join('\n');

  const handleCopy = async () => {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(tomlOutput);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([tomlOutput], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-none animate-in fade-in duration-100"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FFFDF5] border-[3px] border-[#171717] shadow-[8px_8px_0px_#171717] overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Brutalist Header */}
        <div className="bg-[#FFDE59] border-b-[2.5px] border-black p-4 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base sm:text-lg font-black text-black flex items-center gap-2">
              <Code2 className="w-5 h-5 stroke-[2.5]" />
              <span>Contribute an Event</span>
            </h2>
            <p className="text-xs font-bold text-black/80 mt-0.5">
              Fill in your event details to generate a submission for GitHub PR.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 border-[2px] border-black bg-white text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Controls */}
          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#171717] font-black uppercase mb-1">
                EVENT TITLE *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. National Collegiate Hackathon 2026"
                className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[#171717] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">
                  ORGANIZER / COLLEGE *
                </label>
                <input
                  type="text"
                  value={organizer}
                  onChange={(e) => setOrganizer(e.target.value)}
                  placeholder="e.g. CEG Tech Forum"
                  className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[#171717] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">
                  CATEGORY *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-black uppercase text-[#171717] focus:outline-none cursor-pointer"
                >
                  <option value="Hackathon">HACKATHON</option>
                  <option value="Workshop">WORKSHOP</option>
                  <option value="Symposium">SYMPOSIUM</option>
                  <option value="Conference">CONFERENCE</option>
                  <option value="Competition">COMPETITION</option>
                  <option value="Meetup">MEETUP</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">
                  PARTICIPATION MODE *
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-black uppercase text-[#171717] focus:outline-none cursor-pointer"
                >
                  <option value="Offline">OFFLINE</option>
                  <option value="Online">ONLINE</option>
                  <option value="Hybrid">HYBRID</option>
                </select>
              </div>

              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">
                  FEE POLICY
                </label>
                <input
                  type="text"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="e.g. Free or ₹150 / Team"
                  className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[#171717] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">
                  START DATE *
                </label>
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full px-2 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-mono font-bold text-[#171717] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">
                  END DATE
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-mono font-bold text-[#171717] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">
                  DEADLINE
                </label>
                <input
                  type="date"
                  value={regDeadline}
                  onChange={(e) => setRegDeadline(e.target.value)}
                  className="w-full px-2 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-mono font-bold text-[#171717] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">CITY</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Chennai, Coimbatore"
                  className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[#171717] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[#171717] font-black uppercase mb-1">VENUE</label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  placeholder="Auditorium, Turing Hall"
                  className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[#171717] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#171717] font-black uppercase mb-1">
                REGISTRATION URL
              </label>
              <input
                type="url"
                value={regUrl}
                onChange={(e) => setRegUrl(e.target.value)}
                placeholder="https://example.com/register"
                className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[#171717] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#171717] font-black uppercase mb-1">
                DESCRIPTION *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Brief summary of event eligibility, rounds, and tracks..."
                className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-medium text-[#171717] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#171717] font-black uppercase mb-1">
                TAGS (COMMA SEPARATED)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Hackathon, Web Dev, Students"
                className="w-full px-3 py-2 bg-white border-2 border-[#171717] shadow-[2px_2px_0px_#171717] font-bold text-[#171717] focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Validation & TOML Output */}
          <div className="flex flex-col h-full space-y-4">
            {!validation.valid && (
              <div className="p-3 border-2 border-[#171717] bg-[#FF7051] text-white text-xs shadow-[3px_3px_0px_#171717]">
                <div className="flex items-center gap-1.5 font-black uppercase mb-1">
                  <AlertCircle className="w-4 h-4 stroke-[3]" />
                  <span>VALIDATION NOTICES</span>
                </div>
                <ul className="list-disc pl-5 font-bold space-y-0.5 text-[11px]">
                  {validation.errors.map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex-1 flex flex-col border-[2.5px] border-[#171717] bg-[#171717] shadow-[4px_4px_0px_#171717] overflow-hidden">
              <div className="flex items-center justify-between px-3 py-2 bg-[#262626] border-b-2 border-[#171717] text-xs font-mono font-black text-[#FFFDF5]">
                <span>events/{filename}</span>
                <span className="bg-[#FFDE59] text-[#171717] px-1.5 py-0.5">TOML 1.0</span>
              </div>
              <pre className="p-4 flex-1 font-mono text-xs text-[#FFFDF5] overflow-auto whitespace-pre leading-relaxed select-all">
                {tomlOutput}
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-black uppercase tracking-wider text-[#171717] bg-[#FFDE59] hover:bg-[#FFE680] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] active:shadow-none transition-all cursor-pointer"
                >
                  {copied ? <Check className="w-4 h-4 stroke-[3]" /> : <Copy className="w-4 h-4 stroke-[2.5]" />}
                  <span>{copied ? 'COPIED TOML!' : 'COPY TOML CODE'}</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 text-xs font-black uppercase tracking-wider text-[#171717] bg-white hover:bg-[#FFFDF5] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] active:shadow-none transition-all cursor-pointer"
                >
                  <Download className="w-4 h-4 stroke-[2.5]" />
                  <span>DOWNLOAD</span>
                </button>
              </div>

              <a
                href={`https://github.com/CodeSapiens-in/EventSapiens/new/main?filename=events/${filename}&value=${encodeURIComponent(
                  tomlOutput
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-3 text-xs font-black uppercase tracking-wider text-[#FFFDF5] bg-[#171717] hover:bg-[#262626] border-2 border-[#171717] shadow-[3px_3px_0px_#171717] transition-all cursor-pointer"
              >
                <span>OPEN DIRECT GITHUB PULL REQUEST</span>
                <ExternalLink className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

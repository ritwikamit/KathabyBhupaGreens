'use client';

import { useState } from 'react';
import { CheckCircle2, AlertCircle, Send } from 'lucide-react';

const ENQUIRY_TOPICS = [
  'General question',
  'Table enquiry',
  'Group visit',
  'Other',
] as const;

export default function ContactForm() {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [topic, setTopic] = useState<(typeof ENQUIRY_TOPICS)[number]>('Table enquiry');
  const [preferredDateTime, setPreferredDateTime] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          contact,
          topic,
          preferredDateTime,
          message,
          website,
        }),
      });

      const data = (await response.json()) as {
        success?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !data.success) {
        setError(data.error || 'Could not send your enquiry. Please try again.');
      } else {
        setSuccessMessage(
          data.message ||
            'Thank you. Your enquiry has been received by the Katha team.'
        );
        setName('');
        setContact('');
        setPreferredDateTime('');
        setMessage('');
      }
    } catch {
      setError(
        'Could not reach the server right now. Please try again or use our Book Table on Call or WhatsApp Enquiry button.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6"
      noValidate
    >
      <div className="space-y-2">
        <h2 className="text-3xl font-medium text-[#2A1C2B]">Have a question?</h2>
        <p className="text-sm leading-relaxed text-[#635364]">
          Send the restaurant a message about the menu, opening hours, or a planned visit. The team will get back to you using the contact details you provide.
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-[#B91C1C]/20 bg-[#FEF2F2] p-4 text-sm text-[#991B1B]"
        >
          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />
          <p>{error}</p>
        </div>
      )}

      {successMessage && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-[#3E6B64]/25 bg-[#B7D0CC]/35 p-4 text-sm text-[#2A1C2B]"
        >
          <CheckCircle2 className="h-5 w-5 shrink-0 mt-0.5 text-[#3E6B64]" aria-hidden="true" />
          <p>{successMessage}</p>
        </div>
      )}

      {/* Hidden honeypot field for spam reduction */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor="enquiry-name"
            className="block text-sm font-medium text-[#2A1C2B]"
          >
            Name <span className="text-[#774D78]">*</span>
          </label>
          <input
            id="enquiry-name"
            name="name"
            type="text"
            required
            maxLength={100}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
            className="w-full rounded-lg border border-[#774D78]/20 bg-white/85 px-4 py-3 text-sm text-[#2A1C2B] placeholder:text-[#635364]/70 focus:border-[#774D78] focus:bg-white transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="enquiry-contact"
            className="block text-sm font-medium text-[#2A1C2B]"
          >
            Phone or email <span className="text-[#774D78]">*</span>
          </label>
          <input
            id="enquiry-contact"
            name="contact"
            type="text"
            required
            maxLength={120}
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="+91 or email address"
            className="w-full rounded-lg border border-[#774D78]/20 bg-white/85 px-4 py-3 text-sm text-[#2A1C2B] placeholder:text-[#635364]/70 focus:border-[#774D78] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label
            htmlFor="enquiry-topic"
            className="block text-sm font-medium text-[#2A1C2B]"
          >
            What is your enquiry about?
          </label>
          <select
            id="enquiry-topic"
            name="topic"
            value={topic}
            onChange={(e) =>
              setTopic(e.target.value as (typeof ENQUIRY_TOPICS)[number])
            }
            className="w-full rounded-lg border border-[#774D78]/20 bg-white/85 px-4 py-3 text-sm text-[#2A1C2B] focus:border-[#774D78] focus:bg-white transition-colors"
          >
            {ENQUIRY_TOPICS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="enquiry-datetime"
            className="block text-sm font-medium text-[#2A1C2B]"
          >
            Preferred date and time (optional)
          </label>
          <input
            id="enquiry-datetime"
            name="preferredDateTime"
            type="text"
            maxLength={80}
            value={preferredDateTime}
            onChange={(e) => setPreferredDateTime(e.target.value)}
            placeholder="e.g. Saturday evening around 8 PM"
            className="w-full rounded-lg border border-[#774D78]/20 bg-white/85 px-4 py-3 text-sm text-[#2A1C2B] placeholder:text-[#635364]/70 focus:border-[#774D78] focus:bg-white transition-colors"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="enquiry-message"
          className="block text-sm font-medium text-[#2A1C2B]"
        >
          Message <span className="text-[#774D78]">*</span>
        </label>
        <textarea
          id="enquiry-message"
          name="message"
          required
          rows={4}
          maxLength={1500}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your visit, group size, or question about the menu."
          className="w-full rounded-lg border border-[#774D78]/20 bg-white/85 px-4 py-3 text-sm text-[#2A1C2B] placeholder:text-[#635364]/70 focus:border-[#774D78] focus:bg-white transition-colors resize-y"
        />
      </div>

      <div className="space-y-4">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#774D78] px-6 py-3 text-sm font-medium text-white hover:bg-[#5D3A5E] disabled:opacity-60 transition-colors whitespace-nowrap"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {submitting ? 'Sending Enquiry...' : 'Send Enquiry'}
        </button>

        <p className="text-xs leading-relaxed text-[#635364]">
          Your details will be used only to respond to this message. Submitting an enquiry does not automatically confirm a table reservation. Please do not send payment information or sensitive personal details through this form.
        </p>
      </div>
    </form>
  );
}

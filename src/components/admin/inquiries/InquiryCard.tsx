import React from 'react';
import { MessageSquare, Phone, Calendar } from 'lucide-react';

export interface InquiryData {
  id: string;
  name: string;
  phone: string;
  message: string;
  property_title: string | null;
  created_at: string;
}

interface InquiryCardProps {
  inquiry: InquiryData;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('th-TH', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function InquiryCard({ inquiry }: InquiryCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 bg-gradient-to-br from-forest-400 to-forest-600 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-sm">
            {inquiry.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-bold text-gray-900">{inquiry.name}</span>
              {inquiry.property_title && (
                <span className="text-xs bg-forest-50 text-forest-700 border border-forest-100 px-2 py-0.5 rounded-full font-medium">
                  เกี่ยวกับ: {inquiry.property_title.length > 30 ? inquiry.property_title.slice(0, 30) + '...' : inquiry.property_title}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed mb-3">{inquiry.message}</p>

            <div className="flex items-center gap-1 text-gray-400 text-xs">
              <Calendar size={12} />
              {formatDate(inquiry.created_at)}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0">
          <a
            href={`tel:${inquiry.phone.replace(/-/g, '')}`}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-forest-600 text-white text-xs font-semibold rounded-xl hover:bg-forest-700 transition-colors"
          >
            <Phone size={12} /> {inquiry.phone}
          </a>
          <a
            href={`https://line.me/ti/p/~${inquiry.phone.replace(/-/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500 text-white text-xs font-semibold rounded-xl hover:bg-green-600 transition-colors"
          >
            <MessageSquare size={12} /> Line
          </a>
        </div>
      </div>
    </div>
  );
}

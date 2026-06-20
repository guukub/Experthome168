import React from 'react';

interface InquiryStatsProps {
  inquiries: {
    property_title: string | null;
  }[];
}

export default function InquiryStats({ inquiries }: InquiryStatsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-3xl font-bold text-gray-900">{inquiries.length}</div>
        <div className="text-sm text-gray-500 mt-1">ข้อความทั้งหมด</div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-3xl font-bold text-emerald-600">
          {inquiries.filter(i => i.property_title).length}
        </div>
        <div className="text-sm text-gray-500 mt-1">สอบถามเกี่ยวกับทรัพย์</div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="text-3xl font-bold text-blue-600">
          {inquiries.filter(i => !i.property_title).length}
        </div>
        <div className="text-sm text-gray-500 mt-1">สอบถามทั่วไป / ฝากขาย</div>
      </div>
    </div>
  );
}

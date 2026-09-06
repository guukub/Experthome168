import React from 'react'
import { Property } from '@/types/property'
import { formatPrice } from '@/lib/utils'

interface PropertyInfoSummaryProps {
  property: Property
}

export default function PropertyInfoSummary({ property }: PropertyInfoSummaryProps) {
  return (
    <div className="grid grid-cols-12 gap-6 mb-6">
      
      {/* Property Main Image */}
      <div className="col-span-4 rounded-xl overflow-hidden shadow-sm h-[320px]">
        {property.images && property.images.length > 0 ? (
          <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            ไม่มีรูปภาพ
          </div>
        )}
      </div>

      {/* Property Details */}
      <div className="col-span-4 border border-green-100 rounded-xl p-6 bg-white flex flex-col justify-center">
        <h3 className="text-xl font-bold text-forest-800 mb-6 border-b pb-2">ข้อมูลทรัพย์</h3>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">ชื่อทรัพย์</span>
            <span className="col-span-2 text-gray-800 font-medium">: {property.title}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">ประเภท</span>
            <span className="col-span-2 text-gray-800 font-medium">: {property.property_type}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">ที่ดิน</span>
            <span className="col-span-2 text-gray-800 font-medium">: {property.land_size}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">พื้นที่ใช้สอย</span>
            <span className="col-span-2 text-gray-800 font-medium">: {property.usable_area}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">จำนวนห้อง</span>
            <span className="col-span-2 text-gray-800 font-medium">: {property.bedrooms} ห้องนอน {property.bathrooms} ห้องน้ำ</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">ที่จอดรถ</span>
            <span className="col-span-2 text-gray-800 font-medium">: {property.parking} คัน</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">ทิศ</span>
            <span className="col-span-2 text-gray-800 font-medium">: {property.direction}</span>
          </div>
          <div className="grid grid-cols-3">
            <span className="font-bold text-gray-600">รหัสทรัพย์</span>
            <span className="col-span-2 text-gray-800 font-bold">: {property.property_code || `TBB-${property.id.substring(property.id.length - 6).toUpperCase()}`}</span>
          </div>
        </div>
      </div>

      {/* Price Details */}
      <div className="col-span-4 border border-green-100 rounded-xl p-6 bg-white flex flex-col">
        <h3 className="text-xl font-bold text-forest-800 mb-6 border-b pb-2">ข้อมูลราคา</h3>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-3 items-center">
            <span className="font-bold text-gray-600">ราคาขายเสนอ</span>
            <span className="col-span-2 text-gray-800 font-extrabold text-base">: {formatPrice(property.price)} บาท</span>
          </div>
        </div>
      </div>

    </div>
  )
}

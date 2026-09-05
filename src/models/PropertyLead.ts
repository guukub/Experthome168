import mongoose, { Schema } from 'mongoose'

const propertyLeadSchema = new mongoose.Schema({
  property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  contact_date: { type: String, required: true },
  customer_info: { type: String, required: true },
  customer_phone: { type: String },
  interest_level: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, required: true, enum: ['อยู่ระหว่างติดตาม', 'สนใจ', 'ไม่สนใจ', 'อื่นๆ'] },
  notes: { type: String },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

propertyLeadSchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});

propertyLeadSchema.set('toJSON', { virtuals: true });
propertyLeadSchema.set('toObject', { virtuals: true });

const PropertyLead = mongoose.models.PropertyLead || mongoose.model('PropertyLead', propertyLeadSchema)

export default PropertyLead

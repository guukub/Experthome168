import mongoose, { Schema } from 'mongoose'

const propertyMonthlyStatSchema = new mongoose.Schema({
  property_id: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
  month: { type: String, required: true }, // Format: "YYYY-MM"
  living_insider_views: { type: Number, default: 0 },
  living_insider_leads: { type: Number, default: 0 },
  ddproperty_views: { type: Number, default: 0 },
  ddproperty_leads: { type: Number, default: 0 },
  propertyhub_views: { type: Number, default: 0 },
  propertyhub_leads: { type: Number, default: 0 },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Compound index to ensure uniqueness of property + month
propertyMonthlyStatSchema.index({ property_id: 1, month: 1 }, { unique: true })

propertyMonthlyStatSchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});

propertyMonthlyStatSchema.set('toJSON', { virtuals: true });
propertyMonthlyStatSchema.set('toObject', { virtuals: true });

const PropertyMonthlyStat = mongoose.models.PropertyMonthlyStat || mongoose.model('PropertyMonthlyStat', propertyMonthlyStatSchema)

export default PropertyMonthlyStat

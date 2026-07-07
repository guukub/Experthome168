import mongoose from 'mongoose'

const propertySchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  property_type: { type: String, required: true },
  project_name: { type: String },
  location: { type: String, required: true },
  province: { type: String },
  district: { type: String },
  tambon: { type: String },
  postcode: { type: String },
  address: { type: String },
  price: { type: Number, required: true },
  original_price: { type: Number },
  status: { type: String, required: true },
  land_size: { type: String },
  usable_area: { type: String },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  parking: { type: Number },
  description: { type: String },
  video_url: { type: String },
  map_url: { type: String },
  highlights: [{ type: String }],
  is_featured: { type: Boolean, default: false },
  is_visible: { type: Boolean, default: true },
  images: [{ type: String }],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } // map to typescript interface
})

// Mongoose adds _id, but we use 'id' in our frontend code. 
// Let's create a virtual 'id' that maps to '_id'.
propertySchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
propertySchema.set('toJSON', {
  virtuals: true
});
propertySchema.set('toObject', {
  virtuals: true
});

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema)

export default Property

import mongoose from 'mongoose'

const portfolioSchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  date: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  is_visible: { type: Boolean, default: true },
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
})

// Virtual 'id' maps to '_id'
portfolioSchema.virtual('id').get(function(this: any) {
  return this._id.toHexString();
});

// Ensure virtual fields are serialized.
portfolioSchema.set('toJSON', {
  virtuals: true
});
portfolioSchema.set('toObject', {
  virtuals: true
});

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema)

export default Portfolio

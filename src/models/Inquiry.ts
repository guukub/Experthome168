import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IInquiry extends Document {
  name: string;
  phone: string;
  message: string;
  property_title?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a name'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
    },
    message: {
      type: String,
      required: [true, 'Please provide a message'],
    },
    property_title: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from recompiling the model if it already exists
export const Inquiry: Model<IInquiry> = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);

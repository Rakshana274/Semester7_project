import mongoose from 'mongoose';

const emergencySchema = new mongoose.Schema(
  {
    patientName: { type: String, required: true },
    age: { type: Number, default: 0 },
    condition: { type: String, required: true },
    room: { type: String, default: 'Emergency Triage' },
    priority: { type: String, default: 'Critical' },
    reportedAt: { type: String, default: () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
    status: { type: String, default: 'Pending Doctor Assignment' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        return ret;
      }
    }
  }
);

export const Emergency = mongoose.model('Emergency', emergencySchema);

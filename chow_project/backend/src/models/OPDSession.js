import mongoose from 'mongoose';

const opdSessionSchema = new mongoose.Schema(
  {
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    departmentName: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, default: '09:00 AM' },
    endTime: { type: String, default: '01:00 PM' },
    consultationDuration: { type: Number, default: 15 },
    capacity: { type: Number, default: 20 },
    booked: { type: Number, default: 0 },
    remaining: { type: Number, default: 20 },
    status: { type: String, default: 'Active' }
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

export const OPDSession = mongoose.model('OPDSession', opdSessionSchema);

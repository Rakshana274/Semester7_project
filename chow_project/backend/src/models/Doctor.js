import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    departmentId: { type: mongoose.Schema.Types.Mixed, ref: 'Department' },
    departmentName: { type: String, required: true },
    roomNo: { type: String, default: 'Room 101' },
    experience: { type: String, default: '5 Years' },
    status: { type: String, default: 'Active' },
    consultationTime: { type: String, default: '15 mins' }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.departmentId) ret.departmentId = ret.departmentId.toString();
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        if (ret.departmentId) ret.departmentId = ret.departmentId.toString();
        return ret;
      }
    }
  }
);

export const Doctor = mongoose.model('Doctor', doctorSchema);

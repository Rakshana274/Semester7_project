import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    appointmentCode: { type: String, unique: true },
    patientId: { type: String },
    patientName: { type: String, required: true },
    patientPhone: { type: String, default: '' },
    patientAge: { type: Number, default: 0 },
    patientGender: { type: String, default: 'Other' },
    doctorId: { type: String, required: true },
    doctorName: { type: String, required: true },
    departmentId: { type: String, required: true },
    departmentName: { type: String, required: true },
    date: { type: String, required: true },
    token: { type: String, required: true },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Emergency'],
      default: 'Medium'
    },
    priorityScore: { type: Number, default: 50 },
    consultationTime: { type: String, default: '10:00 AM' },
    status: {
      type: String,
      enum: ['Scheduled', 'Checked In', 'Waiting', 'In Consultation', 'Completed', 'Cancelled'],
      default: 'Scheduled'
    },
    checkInTime: { type: String, default: null },
    symptoms: { type: String, default: '' },
    clinicalNotes: { type: String, default: '' },
    prescription: { type: String, default: '' },
    isEmergency: { type: Boolean, default: false }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.appointmentCode || ret._id.toString();
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret.appointmentCode || ret._id.toString();
        return ret;
      }
    }
  }
);

export const Appointment = mongoose.model('Appointment', appointmentSchema);

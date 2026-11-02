import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    patientId: { type: String, required: true },
    userId: { type: String },
    type: { type: String, default: 'Appointment' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    time: { type: String, default: 'Just now' },
    read: { type: Boolean, default: false },
    unread: { type: Boolean, default: true }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.unread = !ret.read;
        return ret;
      }
    },
    toObject: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        ret.unread = !ret.read;
        return ret;
      }
    }
  }
);

export const Notification = mongoose.model('Notification', notificationSchema);

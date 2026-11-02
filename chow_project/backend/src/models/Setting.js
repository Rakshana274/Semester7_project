import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema(
  {
    // Booking & Priority Settings
    bookingCutoffTime: { type: String, default: '17:00' },
    nextDayBookingRules: { type: String, default: 'Allow next-day bookings up to 24 hours prior to OPD start time.' },
    highPriorityThreshold: { type: Number, default: 75 },
    mediumPriorityThreshold: { type: Number, default: 45 },
    emergencyAutoOverride: { type: Boolean, default: true },
    maxDailyBookingsPerPatient: { type: Number, default: 2 },
    walkinReservedPercentage: { type: Number, default: 20 },
    queueGenerationMode: { type: String, default: 'AI Dynamic Triage' },

    // Capacity Management
    normalBookingCapacity: { type: Number, default: 120 },
    walkinCapacity: { type: Number, default: 30 },
    totalCapacity: { type: Number, default: 150 },
    currentBookedNormal: { type: Number, default: 0 },
    currentBookedWalkin: { type: Number, default: 0 },
    utilizationRate: { type: String, default: '0%' },

    // Walk-in Management
    reservedSlots: { type: Number, default: 30 },
    availableSlots: { type: Number, default: 30 },
    usedSlots: { type: Number, default: 0 },
    allowSameDayWalkins: { type: Boolean, default: true },
    walkinStartTime: { type: String, default: '08:30 AM' },

    // General
    maxDailyCapacityPerDoctor: { type: Number, default: 30 },
    emergencyOverrideQuota: { type: Number, default: 5 },
    autoPrioritizationEnabled: { type: Boolean, default: true },
    cancellationWindowHours: { type: Number, default: 2 },
    walkinSlotPercentage: { type: Number, default: 30 }
  },
  {
    timestamps: true,
    strict: false,
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

export const Setting = mongoose.model('Setting', settingSchema);

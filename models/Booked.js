const mongoose = require('mongoose');

const BookedSchema = new mongoose.Schema(
  {
    rooms: { type: String, required: true },
    roomsid: { type: String, required: true },
    userid: { type: String, required: true },
    fromdate: { type: String, required: true },
    todate: { type: String, required: true },
    totalamount: { type: Number, required: true },
    totaldays: { type: Number, required: true },
    transactionid: { type: String, required: true },
    status: { type: String, required: true, default: 'Booked' },
  },
  { timestamps: true }
);

const BookedModel = mongoose.model('Booked', BookedSchema);
module.exports = BookedModel;

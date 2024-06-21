const mongoose = require("mongoose");

const roomSchema = mongoose.Schema({
    name: {type:String, required:true},
    maxcount:{ type: Number, required:true},
    phone:{ type: Number, required:true},
    rentprice:{ type: Number, required:true},
    imageurl:[],
    currentbooking:[],
    roomtype:{type:String, required:true},
    maps: { type: String, required: true }, // Adding the Google Maps link field
    description:{type:String, required:true}
   
}, {timestamps:true});

const roomModel = mongoose.model('rooms', roomSchema);
module.exports = roomModel;

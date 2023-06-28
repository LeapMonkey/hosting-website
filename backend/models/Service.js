import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  userid: {
    type: String,
  },
  currentBlockData: {
    type: Number,
  },
  servername: {
    type: String,
  },
});

export default mongoose.model("Service", ServiceSchema);

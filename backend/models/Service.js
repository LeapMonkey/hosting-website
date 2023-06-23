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
  port: {
    type: Object,
  },
});

export default mongoose.model("Service", ServiceSchema);

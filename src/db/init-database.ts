import mongoose from "mongoose";
import {Config} from "../domains/config"

const initDatabase = async () => {
    await mongoose.connect(Config.mongodbUrl);
}

export default initDatabase;
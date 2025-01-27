import { Schema, model, models } from "mongoose";

const Movie = new Schema({
    id:{
        type:String
    },
    media_type:{
        type:String
    },
    name:{
        type:String
    },
    title:{
        type:String
    },
    episode:{
        type:String
    },
    season:{
        type:String
    },
    m3u8:{
        type:String
    }
},{timestamps:true})


const movie = models.movie || model("movie", Movie)
export default movie

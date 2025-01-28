import { Schema, model, models } from "mongoose";

const Movie = new Schema({
    tmdb_id: { type: String, required: true, unique: true },
    type: { type: String, required: true }, // 'movie' or 'tv'
    season: { type: String, required: false }, // for TV shows
    episode: { type: String, required: false }, // for TV shows
    title: { type: String, required: true },
    requestUrl: { type: String, required: true },
    headers: { type: Object, required: true }, // Store headers as an object
    createdAt: { type: Date, default: Date.now },
},{timestamps:true})


const movie = models.movie || model("movie", Movie)
export default movie

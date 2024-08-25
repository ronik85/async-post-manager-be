import mongoose, { Document, Schema } from "mongoose";

interface IPost extends Document {
    timestamp: Date;
    title: string;
    message: string;
    tags: string[];
    location: string;
    images: string[];
    externalLinks: string[];
    numLikes: number;
    numBookmarks: number;
    numViews: number;
}

const PostSchema: Schema = new Schema({
    timestamp: { type: Date, default: Date.now },
    title: { type: String},
    message: { type: String},
    tags: [String],
    location: String,
    images: [String],
    externalLinks: [String],
    numLikes: { type: Number, default: 0 },
    numBookmarks: { type: Number, default: 0 },
    numViews: { type: Number, default: 0 },
});

export const Post = mongoose.model<IPost>("Post", PostSchema);

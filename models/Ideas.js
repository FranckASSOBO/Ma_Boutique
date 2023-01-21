const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const IdeasSchema = new Schema({
    title: {
        type : String,
        required: true
    },
    price: {
        type : Number,
        required: true
    },
    cut: {
        type : String,
        required: true
    },
    description: {
        type : String,
        required: true
    },
    user: {
        type : String,
        required: true
    },
    date: {
        type : Date,
        default: Date.now
    }
});

mongoose.model("ideas", IdeasSchema);
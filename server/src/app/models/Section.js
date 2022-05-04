const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Section = new Schema(
    {
        name: { type: String, default: '' },
        
        videos: [
            {
                type: mongoose.Schema.Types.Number,
                ref: 'Video',
            },
        ],
        docs: [
            {
                type: mongoose.Schema.Types.Number,
                ref: 'Document',
            },
        ],
    },
    {
        timestamps: true,
    },
);

// add plugin
module.exports = mongoose.model('Section', Section);
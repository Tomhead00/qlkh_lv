const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const Notification = new Schema(
    {
        subject: { type: String, default: '' },
        content: { type: String, default: '' },
        link: { type: String, default: '' },
        seen: { type: Boolean, default: false },
        courseID: { 
            type: mongoose.Schema.Types.Number, 
            ref: 'Course' 
        },
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
    },
    {
        timestamps: true,
    },
);

// add plugin
module.exports = mongoose.model('Notification', Notification);

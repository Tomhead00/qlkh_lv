const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Course = new Schema(
    {
        _id: { type: Number },
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        slug: { type: String, slug: 'name', unique: true },
        level: { type: String, default: ''},
        req: { type: String, default: ''},
        result: { type: String, default: ''},
        time: { type: Number, default: 0},
        actor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
        },
        sections: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Section',
            },
        ],
        livestreams: [
            {
                type: mongoose.Schema.Types.Number,
                ref: 'LiveStream',
            },
        ],
    },
    {
        _id: false,
        timestamps: true,
    },
);

// add plugin
mongoose.plugin(slug);
Course.plugin(AutoIncrement, { inc_field: '_id' });
Course.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('Course', Course);

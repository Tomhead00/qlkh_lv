const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const LiveStream = new Schema(
    {
        _id: { type: Number },
        name: { type: String, default: '' },
        description: { type: String, default: '' },
        image: { type: String, default: '' },
        slug: { type: String, slug: 'name', unique: true },
        liveID: { type: String, default: '' },
        time: { type: Number, default: 0},
    },
    {
        _id: false,
        timestamps: true,
    },
);

// add plugin
mongoose.plugin(slug);
LiveStream.plugin(AutoIncrement, { id: '_id_live', inc_field: '_id' });
LiveStream.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });

module.exports = mongoose.model('LiveStream', LiveStream);

const mongoose = require('mongoose');
const slug = require('mongoose-slug-generator');
const mongooseDelete = require('mongoose-delete');
const AutoIncrement = require('mongoose-sequence')(mongoose);

const Schema = mongoose.Schema;

const Document = new Schema(
    {
        _id: { type: Number },
        name: { type: String, default: '' },
        size: { type: Number, default: 0 },
    },
    {
        _id: false,
        timestamps: true,
    },
);

// add plugin
mongoose.plugin(slug);
Document.plugin(AutoIncrement, { id: '_id_document', inc_field: '_id' });
Document.plugin(mongooseDelete, { overrideMethods: 'all', deletedAt: true });
module.exports = mongoose.model('Document', Document);

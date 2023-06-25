const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    address: {
        type: mongoose.Schema.Types.String,
        required: true
    },
    nfts: {
        type: mongoose.Schema.Types.Array,
        required: true
    }
})

module.exports = mongoose.model('User', UserSchema, "user");
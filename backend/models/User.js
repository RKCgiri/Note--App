const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true, // ✅ Fix: `require` → `required`
    },
    email: {
        type: String,
        required: true,
        unique: true, // ✅ Email should be unique
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

// ✅ Correct Export
const User = mongoose.model('User', UserSchema);
module.exports = User;

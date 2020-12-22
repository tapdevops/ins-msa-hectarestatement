const mongoose = require('mongoose');

const TphSchema = mongoose.Schema({
    QRCODE_TPH: String,
    WERKS: String,
    AFD_CODE: String,
    BLOCK_CODE: String,
    NO_TPH: String,
    LAT: String,
    LONG: String,
    INSERT_USER: String,
    INSERT_TIME: {
        type: Number,
        get: v => Math.floor(v),
        set: v => Math.floor(v),
        alias: 'i',
        default: function () {
            return null;
        }
    },
});

module.exports = mongoose.model('TPH_v_2_2', TphSchema, 'TR_TPH');
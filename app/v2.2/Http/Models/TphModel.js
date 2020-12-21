const mongoose = require('mongoose');
let getDate = new Date()
let hour = getDate.getTime()

const TphSchema = mongoose.Schema({
    QRCODE_TPH: String,
    WERKS: String,
    AFD_CODE: String,
    BLOCK_CODE: String,
    NO_TPH: String,
    LAT: String,
    LONG: String,
    INSERT_USER: String,
    INSERT_TIME: { type: String, default: null }
});

module.exports = mongoose.model('TPH_v_2_2', TphSchema, 'TR_TPH');
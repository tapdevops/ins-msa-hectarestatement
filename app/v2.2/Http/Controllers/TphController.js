const TphModel = require('../Models/TphModel');

const HelperLib = require(_directory_base + '/app/v1.0/Http/Libraries/HelperLib.js');

const tphController = {
    create: async (req, res) => {
        try {
            const tphData = new TphModel(req.body)
            await tphData.save()
                .then(result => {
                    res.json({
                        status: true,
                        message: 'Success!',
                        data: result
                    })
                })
                .catch(err => {
                    res.json({
                        status: false,
                        message: "Insert Failed!",
                        error: err
                    })
                })
        }
        catch (err) {
            console.log("error: ", err);
        }
    },
    read: async (req, res) => {
        // console.log(res);
        // res.json({
        //     status: true,
        //     message: 'Success!',
        //     data: req.body
        // })
        let match = {};
        let QRCODE_TPH = req.body.QRCODE_TPH;
        let WERKS = req.body.WERKS;
        let AFD_CODE = req.body.AFD_CODE;
        let BLOCK_CODE = req.body.BLOCK_CODE;
        let NO_TPH = req.body.NO_TPH;
        let INSERT_USER = req.body.INSERT_USER;
        let INSERT_TIME_FROM = req.body.INSERT_TIME_FROM;
        let INSERT_TIME_TO = req.body.INSERT_TIME_TO;
        if(QRCODE_TPH){ match.QRCODE_TPH = QRCODE_TPH; }
        if(WERKS){ match.WERKS = WERKS; }
        if(AFD_CODE){ match.AFD_CODE = AFD_CODE; }
        if(BLOCK_CODE){ match.BLOCK_CODE = BLOCK_CODE; }
        if(NO_TPH){ match.NO_TPH = NO_TPH; }
        if(INSERT_USER){ match.INSERT_USER = INSERT_USER; }
        if(INSERT_TIME_FROM && INSERT_TIME_TO)
        {
            match.INSERT_TIME = { $gte: INSERT_TIME_FROM, $lte: INSERT_TIME_TO };
        }
        try {
            var query_tph = await TphModel.aggregate( 
                [
                    {
                        "$project": {
                            "_id": 0,
                            "QRCODE_TPH": 1,
                            "WERKS": 1,
                            "AFD_CODE": 1,
                            "BLOCK_CODE": 1,
                            "NO_TPH": 1,
                            "LAT": 1,
                            "LONG": 1,
                            "INSERT_USER": 1,
                            "INSERT_TIME": 1
                        }
                    },
                    {
                        "$match": match
                    }
                ] );
                return res.json({
                    status: true,
                    message: "Success! ",
                    data: query_tph
                });
            
        }
        catch (err) {
            console.log("error: ", err);
        }
    }
}

module.exports = tphController;
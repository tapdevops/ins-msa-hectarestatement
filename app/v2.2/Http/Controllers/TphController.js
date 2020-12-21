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
    }
}

module.exports = tphController;
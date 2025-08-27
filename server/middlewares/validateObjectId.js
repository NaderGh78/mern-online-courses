const mongoose = require("mongoose");

/*===========================================*/
/*===========================================*/
/*===========================================*/

module.exports.validateObjectId = (req, res, next) => {

    for (const param in req.params) {

        if (param.toLowerCase().includes("id")) {

            if (!mongoose.Types.ObjectId.isValid(req.params[param])) {

                return res.status(400).json({ message: `Invalid ID for param: ${param}` });

            }

        }

    }

    next();

} 
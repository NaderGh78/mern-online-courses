const jwt = require('jsonwebtoken');
const { UserModel } = require("../models/UserModel");

/*===========================================*/
/*===========================================*/
/*===========================================*/

// verify token
const verifyToken = async (req, res, next) => {

    const authToken = req.headers.authorization;

    if (authToken) {

        const token = authToken.split(" ")[1];

        try {

            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            req.userDecoded = await UserModel.findById(decoded.id);

            next();

        } catch (error) {

            res.status(403).json({ message: "invalid token" });

        }

    } else {

        res.status(403).json({ message: "no token provided" });

    }

};

/*===========================================*/

// verify token and admin
function verifyTokenAndAdmin(req, res, next) {

    verifyToken(req, res, () => {

        if (req.userDecoded.isAdmin) {

            next();

        } else {

            res.status(403).json({ message: "not allowed, only admin allowed" });

        }

    }
    );

}

/*===========================================*/

// verify token and only user himself
function verifyTokenAndOnlyUser(req, res, next) {

    verifyToken(req, res, () => {

        if (req.userDecoded.id === req.params.id) {

            next();

        } else {

            res.status(403).json({ message: "not allowed, only user himself" });

        }

    }
    );

}

/*===========================================*/

// verify token and authorization (user or admin)
function verifyTokenAndAuthorization(req, res, next) {

    verifyToken(req, res, () => {

        if ((req.userDecoded.id === req.params.id) || req.userDecoded.isAdmin) {

            next();

        } else {

            res.status(403).json({ message: "not allowed, only user himself or admin" });

        }

    }
    );

}

/*===========================================*/

// verify token and teacher role
const verifyTeacher = (req, res, next) => {

    verifyToken(req, res, () => {

        if (req.userDecoded.role !== "Teacher") {

            return res.status(403).json({ message: "Access denied. Teachers only!" });

        }

        next();

    }

    );

};

/*===========================================*/

module.exports = {
    verifyToken,
    verifyTokenAndAdmin,
    verifyTokenAndOnlyUser,
    verifyTokenAndAuthorization,
    verifyTeacher
}; 
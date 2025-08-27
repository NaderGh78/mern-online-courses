const express = require("express");
const path = require('path');
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = require('./config/db');
const AuthPath = require("./routes/authRoute");
const UsersPath = require("./routes/usersRoute");
const PlaylistPath = require("./routes/PlaylistRoute");
const CoursePath = require("./routes/coursesRoute");
const CommentPath = require("./routes/commentRoute");
const CategoriesPath = require("./routes/categoriesRoute");

/*=========================================*/
/*=========================================*/
/*=========================================*/

const app = express();

connectDB();

// Make the 'uploads' directory publicly accessible via /uploads URL path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// middleware 
// here in case we need to use it localy and in production
const corsOptions = {
    origin: [
        "http://localhost:3000", // local React   
        "https://mern-online-courses.vercel.app" // production frontend
    ],
    credentials: true
};

app.use(cors(corsOptions));

app.use(express.json());

/*=========================================*/

// routes 
app.use("/api/auth", AuthPath);
app.use("/api/users", UsersPath);
app.use("/api/playlists", PlaylistPath);
app.use("/api/courses", CoursePath);
app.use("/api/comments", CommentPath);
app.use("/api/categories", CategoriesPath);

/*=========================================*/

const PORT = process.env.PORT || 8000;

app.listen(PORT, (req, res) => {
    console.log(`the server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)

});  
const express = require("express");
const path = require("node:path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pgSession = require("connect-pg-simple")(session);
const bcrypt = require("bcryptjs");
const indexRouter = require("./routes/indexRouter");
const signInRouter = require("./routes/signInRouter");
const logInRouter = require("./routes/logInRouter");
const uploadFileRouter = require("./routes/uploadFileRouter");
const createFolderRoute = require("./routes/createFolderRoute");
const folderUserRoute = require("./routes/folderUserRoute");
const deleteFolderRouter = require("./routes/deleteFolderRoute")
const deleteFileRouter = require("./routes/deleteFileRoute");
const { getUserByEmail, getUserById } = require("./db/queries");
const cloudinary  = require("cloudinary").v2;
require("dotenv").config();

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET ,
});

const app = express();
const PORT  = process.env.PORT || 3000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.use(express.urlencoded({ extended: true }));
app.use(session({ 
    secret: process.env.SESSION_SECRET, 
    resave: false, 
    saveUninitialized: false,
    store: new (pgSession)({
        conString: process.env.DATABASE_URL,
        createTableIfMissing: true,
    }),
}));
app.use(passport.initialize());
app.use(passport.session()); //to use serialize and deserialize

app.get("/favicon.ico", (req, res) => res.status(204)); 
app.use("/", indexRouter);
app.use("/signIn", signInRouter);
app.use("/logIn", logInRouter);
app.get("/logOut", (req, res, next) => {
    req.logOut((err) => {
        if(err) {
            return next(err);
        }
        return res.redirect("/");
    });
});
app.use("/uploadFile", uploadFileRouter);
app.use("/createFolder", createFolderRoute);
app.use("/folder", folderUserRoute);
app.use("/deleteFolder", deleteFolderRouter);
app.use("/deleteFile", deleteFileRouter);

passport.use(
    new LocalStrategy(
        {
            usernameField: "email",
        },

        async (email, password, done) => {
            try{
                const user = await getUserByEmail(email);

                if (!user) {
                    return done(null, false, {message: "Incorrect email"});
                }

                const match = await bcrypt.compare(password, user.password);
                if (!match) {
                    return done(null, false, {message: "Incorrect password"})
                }
                return done(null, user);

            }catch(error) {
                return done(error);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await getUserById(id);
        done(null, user);
    } catch(error) {
        done(error);
    }
});

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});


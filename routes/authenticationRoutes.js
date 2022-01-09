const mongoose = require('mongoose');
const Account = mongoose.model('AccountDetails');

const argon2i = require('argon2-ffi').argon2i;
const crypto = require('crypto');

const passwordRegex = new RegExp("(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,24})");

module.exports = app => {

    //Create Route
    app.post('/account/create', async(req, res) => {

        var response = {};

        const { rUsername, rPassword, rPlayerName, rFBSignIn, rCheckParam} = req.body;

        if(rCheckParam.toLowerCase() === 'true')
        {
            if(rUsername == null || rUsername.length < 3 || rUsername.length > 24)
            {
                response.code = 1;
                response.msg = "Invalid Credentials";
                res.send(response);
                return;
            }

            if(!passwordRegex.test(rPassword))
            {
                response.code = 2;
                response.msg = "Password Not Secure";
                res.send(response);
                return;
            }
        }

        var userAccount = await Account.findOne({Username : rUsername},'_id');

        if(userAccount == null)
        {
            //Create new account
            console.log("Create new account...")

            // Generate a unique access token
            crypto.randomBytes(32, function(err, salt)
            {
                if(err)
                {
                    console.log(err);
                }

                argon2i.hash(rPassword, salt).then(async (hash) =>{

                    var newAccount = new Account({
                        Username : rUsername,
                        Password : hash,
                        Salt: salt,
                        PlayerName: rPlayerName,
                        TutorialPlayed: false,
                        FBSignIn: (rFBSignIn.toLowerCase() === 'true'),
                        PlayerLevel: 1,
                        PlayerXP: 1,
                        NoAdPurchased: false,
                        BGMLevel: 10,
                        SFXLevel: 10,
                        LastAuthentication : Date.now()

                    });

                    await newAccount.save();
            
                    response.code = 0;
                    response.msg = "Account Created";
                    response.data = ( ({ Username, PlayerName, TutorialPlayed, FBSignIn, PlayerLevel, PlayerXP, NoAdPurchased, BGMLevel, SFXLevel, LastAuthentication }) => ({ Username, PlayerName, TutorialPlayed, FBSignIn, PlayerLevel, PlayerXP, NoAdPurchased, BGMLevel, SFXLevel, LastAuthentication }) )(newAccount);
                    res.send(response);
                    return;
            
                });
            });
        }
        else
        {
            response.code = 3;
            response.msg = "Account already exist";
            res.send(response);
        }

        return;
    });

    //Login Route
    app.post('/account/login', async(req, res) => {

        var response = {};

        const { rUsername, rPassword, rCheckParam} = req.body;

        if(rCheckParam.toLowerCase() === 'true')
        {
            if(rUsername == null || !passwordRegex.test(rPassword))
            {
                response.code = 1;
                response.msg = "Invalid Credentials";
                res.send(response);
                return;
            }
        }

        var userAccount = await Account.findOne({Username : rUsername}, 'Username Password PlayerName TutorialPlayed FBSignIn PlayerLevel PlayerXP NoAdPurchased BGMLevel SFXLevel LastAuthentication ');

        if(userAccount != null)
        {
            argon2i.verify(userAccount.Password, rPassword).then(async (success) => {

                if(success)
                {
                    //Account Found
                    console.log("Account Found...");

                    userAccount.LastAuthentication = Date.now();
                    await userAccount.save();
                    
                    response.code = 0;
                    response.msg = "Account Found";
                    response.data = ( ({ Username, PlayerName, TutorialPlayed, FBSignIn, PlayerLevel, PlayerXP, NoAdPurchased, BGMLevel, SFXLevel, LastAuthentication }) => ({ Username, PlayerName, TutorialPlayed, FBSignIn, PlayerLevel, PlayerXP, NoAdPurchased, BGMLevel, SFXLevel, LastAuthentication }) )(userAccount);
                    res.send(response);

                    return;
                }
                else
                {
                    response.code = 1;
                    response.msg = "Invalid Credentials";
                    res.send(response);
                    return;
                }
            });
        }
        else
        {
            response.code = 2;
            response.msg = "Username doesn't exist."
            res.send(response);
            return;
        }
    });

    app.post('/account/saveaccount', async(req, res) => {

        console.log("save : " + req.params);
        console.log("save : " + req.body);

        /*const { rUsername, rPassword} = req.body;

        if(rUsername == null || rPassword == null)
        {
            res.send('Invalid Credentials');
            return;
        }

        var userAccount = await Account.findOne({username : rUsername});

        if(userAccount == null)
        {
            //Create new account
            console.log("Create new account...")

            var newAccount = new Account({
                username : rUsername,
                password : rPassword,

                lastAuthentication : Date.now()
            });

            await newAccount.save();

            res.send(newAccount);
            return;
        }
        else
        {
            res.send("Username already taken.");
        }

        res.send('Invalid Credentials');*/
        return;
    });
}
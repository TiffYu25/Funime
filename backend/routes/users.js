var secrets = require('../config/secrets');
const User = require('../models/user');
module.exports = function (router) {

    var usersRoute = router.route('/users');
    var usersIdRoute = router.route('/users/:id');

    usersRoute.post(async function (req, res) {
        const user = req.body;
        const newUser = new User(req.body);
        const err = newUser.validateSync();
        
      
        if (err) {
            console.log(req.body);
            res.status(400).json({message: "Invalid request", data: err});
            return;
        }
        
        try {

          await User.db.transaction(async (session) => {
            const savedUser = await newUser.save();
          });

        }
        catch(err){
          res.status(500).json({message: "Internal server error", data: err});
          console.log(err);
          return;
        }
        
        
        res.status(201).json({message: "User created", data: newUser});
        
    });

    usersRoute.get(async function (req, res) {
        var connectionString = secrets.token;

        const query = User.find();
        query.collection(User.collection);

        if (req.query["where"]) {
            query.where(JSON.parse(req.query["where"]));
        }
        if (req.query["sort"]) {
            query.sort(JSON.parse(req.query["sort"]));
        }
        if (req.query["skip"]) {
            query.skip(JSON.parse(req.query["skip"]));
        }
        if (req.query["limit"]) {
            query.limit(JSON.parse(req.query["limit"]));
        }
        if (req.query["count"]) {
            query.countDocuments();
        }
        if (req.query["select"]) {
            query.select(JSON.parse(req.query["select"]));
        }

        try{
          const result = await query.exec();
          res.status(200).json({message: "Users found", data: result});
        } catch(err){
          res.status(500).json({message: "Internal server error", data: err});
        }
    });

    usersIdRoute.get(async function (req, res) {
        const id = req.params["id"];
        try {
          const result = await User.findById(id);
          if (result) {
            res.status(200).json({message: "User found", data: result});
          } else {
            res.status(404).json({message: "User not found", data: req.params});
          }
        } catch(err){
          res.status(500).json({message: "Internal server error", data: err});
        }
    });

    usersIdRoute.put(async function (req, res) {
        const id = req.params["id"];
        const user = req.body;
        try {
          const result = await User.findByIdAndUpdate(id, user);
          if (result) {
            res.status(200).json({message: "User updated", data: result});
          } else {
            res.status(404).json({message: "User not found", data: req.params});
          }
        } catch(err){
          res.status(500).json({message: "Internal server error", data: err});
        }
    });
    //delete user
    usersIdRoute.delete(async function (req, res) {
        const id = req.params["id"];
        try {
          const result = await User.findByIdAndDelete(id);
          if (result) {
            res.status(200).json({message: "User deleted", data: result});
          } else {
            res.status(404).json({message: "User not found", data: req.params});
          }
        } catch(err){
          res.status(500).json({message: "Internal server error", data: err});
        }
    });

    // PATCH REQUESTS NOT WORKING RIGHT NOW
    // //change username
    //   usersIdRoute.patch(async function (req, res) {
    //     const id = req.params["id"];
    //     const { name } = req.body;
    
    //     if (!name) {
    //         return res.status(400).json({ message: "Name field is required" });
    //     }
    
    //     try {
    //         const updatedUser = await User.findByIdAndUpdate(
    //             id,
    //             { name: name },
    //             { new: true, runValidators: true } 
    //         );
    
    //         if (updatedUser) {
    //             res.status(200).json({ message: "Username updated", data: updatedUser });
    //         } else {
    //             res.status(404).json({ message: "User not found", data: { id } });
    //         }
    //     } catch (err) {
    //         res.status(500).json({ message: "Internal server error", data: err });
    //     }
    // });
    
    // //change password 
    // const bcrypt = require('bcrypt'); 

    // usersIdRoute.patch('/password', async function (req, res) {
    //     const id = req.params["id"];
    //     const { currentPassword, newPassword } = req.body;

    //     if (!currentPassword || !newPassword) {
    //         return res.status(400).json({ message: "Both Current Password and New Password fields are required" });
    //     }

    //     try {
    //         const user = await User.findById(id);

    //         if (!user) {
    //             return res.status(404).json({ message: "User not found", data: { id } });
    //         }

    //         const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    //         if (!passwordMatch) {
    //             return res.status(400).json({ message: "Current password is incorrect" });
    //         }

    //         const hashedPassword = await bcrypt.hash(newPassword, 10);

    //         user.password = hashedPassword;
    //         await user.save();

    //         res.status(200).json({ message: "Password updated successfully" });
    //     } catch (err) {
    //         res.status(500).json({ message: "Internal server error", data: err });
    //     }
    // });


  return router;
}

const User = require('../models/User')

exports.createUser = async (req, res) => {
    try {
        const { firebaseUID, username } = req.body;

        if (!firebaseUID || !username) {
            return res.status(400).json({message: 'Missing UID or username.'})
        }

        const newUser = new User ({
            firebaseUID,
            username,
            broughtTrades: [],
            soldTrades: [],
            accountBalance: 1000.00
        })

        await newUser.save();
        res.status(201).json(newUser);


    } catch (error) {
        console.error('Error creating User', error);
        res.status(500).json({message: 'Server error'})
    }
};


exports.getUserByUID = async (req, res) => {
    try {
        const {firebaseUID} = req.params;
        const user = await User.findOne({firebaseUID})

        if (!user) {
            return res.status(404).json({message: 'User not found'});
        }
        
        res.status(200).json(user);

    } catch (error) {
        console.error('Error finding user:', error);
        res.status(500).json({message: 'Server error'})

    }
}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        if (users.length === 0 || !users) {
            return res.status(404).json({ message: 'No users found'})
        }

        res.status(200).json(users)
    } catch (error) {
        console.error('Error fetching all users',error)
        res.status(500).json({message: 'Server error'});
    }
}
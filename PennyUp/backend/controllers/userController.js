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
        console.log('Received firebase UID: ',firebaseUID)

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


exports.updateFavouriteStock = async (req, res) => {
    const { firebaseUID, stockSymbol } = req.body;

    try {
        const user = await User.findOne({ firebaseUID });
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (user.favouriteStocks.includes(stockSymbol)) {
            // Stock exists, remove it (Unfavourite)
            user.favouriteStocks = user.favouriteStocks.filter(symbol => symbol !== stockSymbol);
        } else {
            // Stock does not exist, add it (Favourite)
            user.favouriteStocks.push(stockSymbol);
        }

        await user.save();
        return res.json({ favouriteStocks: user.favouriteStocks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Server error' });
    }
};



const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'secretkey'; 

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());

mongoose.connect('mongodb://localhost:27017/housePriceComparison', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    savedProperties: [String]
});

const User = mongoose.model('User', userSchema);

app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.json({ success: true, message: 'Registration successful.' });
    } catch (err) {
        console.error('Error during registration:', err);
        res.json({ success: false, message: 'Registration failed. Username might be taken.' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
            res.json({ success: true, token });
        } else {
            res.json({ success: false, message: 'Invalid username or password.' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.json({ success: false, message: 'Login failed due to server error.' });
    }
});

app.post('/save-property', async (req, res) => {
    const { username, result } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            user.savedProperties.push(result);
            await user.save();
            res.json({ success: true, message: 'Property saved successfully.' });
        } else {
            res.json({ success: false, message: 'User not found.' });
        }
    } catch (err) {
        console.error('Error saving property:', err);
        res.json({ success: false, message: 'Failed to save property.' });
    }
});

app.post('/get-saved-properties', async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            res.json({ success: true, savedProperties: user.savedProperties });
        } else {
            res.json({ success: false, message: 'User not found.' });
        }
    } catch (err) {
        console.error('Error retrieving saved properties:', err);
        res.json({ success: false, message: 'Failed to retrieve saved properties.' });
    }
});

app.post('/remove-saved-property', async (req, res) => {
    const { username, property } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            user.savedProperties = user.savedProperties.filter(prop => prop !== property);
            await user.save();
            res.json({ success: true, message: 'Property removed successfully.' });
        } else {
            res.json({ success: false, message: 'User not found.' });
        }
    } catch (err) {
        console.error('Error removing property:', err);
        res.json({ success: false, message: 'Failed to remove property.' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

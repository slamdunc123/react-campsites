const express = require('express');
const router = express.Router();
const config = require('config');
const Campsite = require('../../models/Campsite');

// @router  GET api/campsites - http://localhost:5000/api/campsites
// @desc    campsites test route
// @access  Public
// router.get('/', (req, res) => res.send('campsites test route'));

// @router  GET api/campsites - http://localhost:5000/api/campsites
// @desc    Get all campsites
// @access  Public

router.get('/', async (req, res) => {
	try {
		const campsites = await Campsite.find();
		res.json(campsites);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @router  GET api/campsites - http://localhost:5000/api/campsites/1
// @desc    Get campsite by userId
// @access  Public

router.get('/:userId', async (req, res) => {
	console.log(req.params);
	try {
		const campsites = await Campsite.find({ userId: req.params.userId });
		res.json(campsites);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route POST api/campsites
// @desc Create an campsite
// @access Public

router.post('/', async (req, res) => {
	console.log('req.body', req.body);
	const { userId, name, desc } = req.body;
	try {
		// check if campsite naem already exists
		let campsite = await Campsite.findOne({
			userId: userId,
			name: name,
		});
		if (campsite) {
			return res.status(400).json({
				errors: [{ msg: 'Campsite already exists' }],
			});
		}

		const newCampsite = new Campsite({
			name: req.body.name,
			desc: req.body.desc,
			age: req.body.age,
			dob: req.body.dob,
			imageFile: req.body.imageFile,
			userId: req.body.userId,
		});
		console.log('newCampsite', newCampsite);
		// save item to database
		campsite = await newCampsite.save();
		res.json({ campsite: campsite, msg: 'Campsite created' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route DELETE api/campsites
// @desc Delete an campsite
// @access Public

router.delete('/:id', async (req, res) => {
	try {
		// check if campsite exists
		const campsite = await Campsite.findById(req.params.id);

		// if id is a valid format but doesn't exist in database
		if (!campsite) {
			return res.status(404).json({
				msg: 'Campsite not found',
			});
		}

		await campsite.remove();

		res.json({
			msg: 'Campsite deleted successfully.',
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route UPDATE api/campsites
// @desc Update an campsite
// @access Public

router.put('/:id', async (req, res) => {
	try {
		// check if campsite exists
		let campsite = await Campsite.findById(req.params.id);

		// if id is a valid format but doesn't exist in database
		if (!campsite) {
			return res.status(404).json({
				msg: 'Campsite not found',
			});
		}
		campsite = await Campsite.findByIdAndUpdate(req.params.id, req.body);
		await res.json({
			msg: 'Item updated successfully.',
			campsite: campsite,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;

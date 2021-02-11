const express = require('express');
const router = express.Router();
const config = require('config');
const Pet = require('../../models/Pet');

// @router  GET api/pets - http://localhost:5000/api/pets
// @desc    pets test route
// @access  Public
// router.get('/', (req, res) => res.send('pets test route'));

// @router  GET api/pets - http://localhost:5000/api/pets
// @desc    Get all pets
// @access  Public

router.get('/', async (req, res) => {
	try {
		const pets = await Pet.find();
		res.json(pets);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @router  GET api/pets - http://localhost:5000/api/pets/1
// @desc    Get pet by userId
// @access  Public

router.get('/:userId', async (req, res) => {
	console.log(req.params);
	try {
		const pets = await Pet.find({ userId: req.params.userId });
		res.json(pets);
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route POST api/pets
// @desc Create an pet
// @access Public

router.post('/', async (req, res) => {
	console.log('req.body', req.body);
	const { userId, name, desc } = req.body;
	try {
		// check if pet naem already exists
		let pet = await Pet.findOne({
			userId: userId,
			name: name,
		});
		if (pet) {
			return res.status(400).json({
				errors: [{ msg: 'Pet already exists' }],
			});
		}

		const newPet = new Pet({
			name: req.body.name,
			desc: req.body.desc,
			age: req.body.age,
			dob: req.body.dob,
			imageFile: req.body.imageFile,
			userId: req.body.userId,
		});
		console.log('newPet', newPet);
		// save item to database
		pet = await newPet.save();
		res.json({ pet: pet, msg: 'Pet created' });
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route DELETE api/pets
// @desc Delete an pet
// @access Public

router.delete('/:id', async (req, res) => {
	try {
		// check if pet exists
		const pet = await Pet.findById(req.params.id);

		// if id is a valid format but doesn't exist in database
		if (!pet) {
			return res.status(404).json({
				msg: 'Pet not found',
			});
		}

		await pet.remove();

		res.json({
			msg: 'Pet deleted successfully.',
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

// @route UPDATE api/pets
// @desc Update an pet
// @access Public

router.put('/:id', async (req, res) => {
	try {
		// check if pet exists
		let pet = await Pet.findById(req.params.id);

		// if id is a valid format but doesn't exist in database
		if (!pet) {
			return res.status(404).json({
				msg: 'Pet not found',
			});
		}
		pet = await Pet.findByIdAndUpdate(req.params.id, req.body);
		await res.json({
			msg: 'Item updated successfully.',
			pet: pet,
		});
	} catch (err) {
		console.error(err.message);
		res.status(500).send('Server error');
	}
});

module.exports = router;

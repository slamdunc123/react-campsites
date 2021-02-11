const mongoose = require('mongoose');

const PetSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	desc: {
		type: String,
		required: true,
	},
	age: {
		type: String,
		required: true,
	},
	dob: {
		type: Date,
		required: true,
	},
	imageFile: {
		type: String,
	},
	userId: {
		type: String,
		required: true,
	},
});

module.exports = Pet = mongoose.model('pet', PetSchema);

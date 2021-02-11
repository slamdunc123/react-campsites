import axios from 'axios';
import { GET_PETS } from './types';
import { CREATE_PET } from './types';
import { DELETE_PET } from './types';
import { UPDATE_PET } from './types';
import { setAlert } from './alertActions';

// get pets
export const getPets = (id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/pets/${id}`);

		dispatch({
			type: GET_PETS,
			payload: res.data,
		});
	} catch (err) {
		console.error(err.error);
	}
};

// create pet
export const createPet = (formData, userId) => async (dispatch) => {
	console.log('createPet fired', formData, userId);
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = { ...formData, userId };
	console.log(body);

	try {
		const res = await axios.post('/api/pets', body, config);
		console.log(res.data.pet);

		dispatch({
			type: CREATE_PET,
			payload: res.data.pet,
		});
		dispatch(setAlert(res.data.msg, 'success'));
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
	}
};

// delete pet
export const deletePet = (id) => async (dispatch) => {
	console.log('deletePet fired', id);
	try {
		const res = await axios.delete(`/api/pets/${id}`);

		dispatch({
			type: DELETE_PET,
			payload: id,
		});
		dispatch(setAlert(res.data.msg, 'success'));
	} catch (err) {
		console.error(err.error);
	}
};

export const updatePet = (id, formData) => async (dispatch) => {
	console.log('udpatePet fired', id, formData);
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = formData;
	console.log(body);
	try {
		const res = await axios.put(`/api/pets/${id}`, body, config); // pass edited pet id, new formData, headers
		dispatch({
			type: UPDATE_PET,
			payload: res.data,
		});
		dispatch(setAlert(res.data.msg, 'success'));
	} catch (err) {
		console.error(err.error);
	}
};

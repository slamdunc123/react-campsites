import axios from 'axios';
import { GET_CAMPSITES } from './types';
import { CREATE_CAMPSITE } from './types';
import { DELETE_CAMPSITE } from './types';
import { UPDATE_CAMPSITE } from './types';
import { setAlert } from './alertActions';

// get campsites
export const getCampsites = (id) => async (dispatch) => {
	try {
		const res = await axios.get(`/api/campsites/${id}`);

		dispatch({
			type: GET_CAMPSITES,
			payload: res.data,
		});
	} catch (err) {
		console.error(err.error);
	}
};

// create campsite
export const createCampsite = (formData, userId) => async (dispatch) => {
	console.log('createCampsite fired', formData, userId);
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = { ...formData, userId };
	console.log(body);

	try {
		const res = await axios.post('/api/campsites', body, config);
		console.log(res.data.campsite);

		dispatch({
			type: CREATE_CAMPSITE,
			payload: res.data.campsite,
		});
		dispatch(setAlert(res.data.msg, 'success'));
	} catch (err) {
		const errors = err.response.data.errors;

		if (errors) {
			errors.forEach((error) => dispatch(setAlert(error.msg, 'danger')));
		}
	}
};

// delete campsite
export const deleteCampsite = (id) => async (dispatch) => {
	console.log('deleteCampsite fired', id);
	try {
		const res = await axios.delete(`/api/campsites/${id}`);

		dispatch({
			type: DELETE_CAMPSITE,
			payload: id,
		});
		dispatch(setAlert(res.data.msg, 'success'));
	} catch (err) {
		console.error(err.error);
	}
};

export const updateCampsite = (id, formData) => async (dispatch) => {
	console.log('udpateCampsite fired', id, formData);
	const config = {
		headers: {
			'Content-Type': 'application/json',
		},
	};
	const body = formData;
	console.log(body);
	try {
		const res = await axios.put(`/api/campsites/${id}`, body, config); // pass edited campsite id, new formData, headers
		dispatch({
			type: UPDATE_CAMPSITE,
			payload: res.data,
		});
		dispatch(setAlert(res.data.msg, 'success'));
	} catch (err) {
		console.error(err.error);
	}
};

import { GET_CAMPSITES } from '../actions/types';
import { CREATE_CAMPSITE } from '../actions/types';
import { DELETE_CAMPSITE } from '../actions/types';
import { UPDATE_CAMPSITE } from '../actions/types';

const initialState = {
	campsites: [],
	loading: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_CAMPSITES:
			console.log('GET_CAMPSITES called', payload);
			return {
				...state,
				campsites: payload,
				loading: false,
			};
		case CREATE_CAMPSITE:
			console.log('CREATE_CAMPSITE called', payload);
			return {
				...state,
				campsites: [...state.campsites, payload],
				loading: false,
			};
		case DELETE_CAMPSITE:
			console.log('DELETE_CAMPSITE called', payload);
			return {
				...state,
				campsites: state.campsites.filter(
					(campsite) => campsite._id !== payload
				),
				loading: false,
			};

		case UPDATE_CAMPSITE:
			console.log('UPDATE_CAMPSITE called', payload);
			state.campsites.find((campsite) => {
				if (campsite._id === payload.id) {
					campsite.name = payload.name;
					campsite.desc = payload.desc;
					campsite.age = payload.age;
					campsite.dob = payload.dob;
					return {
						...state,
						campsites: [...state.campsites, payload],
						loading: false,
					};
				} else return state;
			});
		default:
			return state;
	}
}

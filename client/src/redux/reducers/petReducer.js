import { GET_PETS } from '../actions/types';
import { CREATE_PET } from '../actions/types';
import { DELETE_PET } from '../actions/types';
import { UPDATE_PET } from '../actions/types';

const initialState = {
	pets: [],
	loading: true,
};

export default function (state = initialState, action) {
	const { type, payload } = action;

	switch (type) {
		case GET_PETS:
			console.log('GET_PETS called', payload);
			return {
				...state,
				pets: payload,
				loading: false,
			};
		case CREATE_PET:
			console.log('CREATE_PET called', payload);
			return {
				...state,
				pets: [...state.pets, payload],
				loading: false,
			};
		case DELETE_PET:
			console.log('DELETE_PET called', payload);
			return {
				...state,
				pets: state.pets.filter((pet) => pet._id !== payload),
				loading: false,
			};

		case UPDATE_PET:
			console.log('UPDATE_PET called', payload);
			state.pets.find((pet) => {
				if (pet._id === payload.id) {
					pet.name = payload.name;
					pet.desc = payload.desc;
					pet.age = payload.age;
					pet.dob = payload.dob;
					return {
						...state,
						pets: [...state.pets, payload],
						loading: false,
					};
				} else return state;
			});
		default:
			return state;
	}
}

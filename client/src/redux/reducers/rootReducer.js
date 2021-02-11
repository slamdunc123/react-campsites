import { combineReducers } from 'redux';
import petReducer from './petReducer';
import reminderReducer from './reminderReducer';
import authReducer from './authReducer';
import alertReducer from './alertReducer';

export default combineReducers({
	petReducer: petReducer,
	reminderReducer: reminderReducer,
	authReducer: authReducer,
	alertReducer: alertReducer,
});

import { combineReducers } from 'redux';
import campsiteReducer from './campsiteReducer';
import reminderReducer from './reminderReducer';
import authReducer from './authReducer';
import alertReducer from './alertReducer';

export default combineReducers({
	campsiteReducer: campsiteReducer,
	reminderReducer: reminderReducer,
	authReducer: authReducer,
	alertReducer: alertReducer,
});

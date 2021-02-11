import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Alert from '../components/partials/Alert/Alert';
import Campsites from '../components/pages/Campsites/Campsites';
import Home from '../components/pages/Home/Home';
import Login from '../components/pages/Login/Login';
import Register from '../components/pages/Register/Register';
import CampsiteProfile from '../components/pages/Campsites/CampsiteProfile';
import Reminders from '../components/pages/Reminders/Reminders';
import NotFound from '../components/pages/NotFound/NotFound';
import PrivateRoute from './PrivateRoute';

const Routes = () => {
	return (
		<>
			<Alert />
			<Switch>
				<PrivateRoute component={Campsites} path='/campsites' exact />
				<PrivateRoute
					component={CampsiteProfile}
					path='/campsites/:id'
					exact
				/>
				<PrivateRoute component={Reminders} path='/reminders/' exact />
				{/* <PrivateRoute component={Login} path='/login' exact />
				<PrivateRoute component={Register} path='/register' exact /> */}
				{/* <Route path='/campsites'>
					<Campsites />
				</Route> */}
				<Route exact path='/'>
					<Home />
				</Route>
				<Route path='/login'>
					<Login />
				</Route>
				<Route path='/register'>
					<Register />
				</Route>
				<Route component={NotFound} />
			</Switch>
		</>
	);
};

export default Routes;

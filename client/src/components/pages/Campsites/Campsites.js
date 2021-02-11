import React, { useState, useEffect } from 'react';
import Spinner from '../../partials/Spinner/Spinner';
import CampsitesForm from './CampsitesForm';
import CampsiteRecord from './CampsiteRecord';
import CampsitesTable from './CampsitesTable';

import { useDispatch, useSelector } from 'react-redux';
import {
	getCampsites,
	createCampsite,
	deleteCampsite,
	updateCampsite,
} from '../../../redux/actions/campsiteActions';
import { resetAlerts } from '../../../redux/actions/alertActions';
import Modal from '../../partials/Modal/Modal';

const Campsites = () => {
	const alerts = useSelector((state) => state.alertReducer);
	const { token, isAuthenticated, user } = useSelector(
		(state) => state.authReducer
	);
	const campsites = useSelector((state) => state.campsiteReducer.campsites); //gets from rootReducer which has campsiteReducer imported
	const loading = useSelector((state) => state.campsiteReducer.loading); //gets from rootReducer which has campsiteReducer imported
	const dispatch = useDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [editedCampsite, setEditedCampsite] = useState({
		id: '',
		name: '',
		desc: '',
		dob: '',
		age: '',
	});
	const [updatedCampsite, setUpdatedCampsite] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [campsiteId, setCampsiteId] = useState();
	const [display, setDisplay] = useState('records');

	const getUserId = () => {
		let userId;
		if (user !== null) {
			userId = user._id;
		} else {
			userId = localStorage.getItem('userId');
		}
		return userId;
	};

	const handleCreate = (formData) => {
		setShowModal(false);
		setIsEditing(false);
		dispatch(createCampsite(formData, getUserId()));
	};

	const handleAdd = () => {
		setShowModal(true);
		setIsEditing(false);
		setModalTitle('add');
	};

	const handleUpdate = (id, formData) => {
		setShowModal(false);
		setIsEditing(false);
		setUpdatedCampsite(true);
		dispatch(updateCampsite(id, formData));
	};

	const handleEdit = (id, name, desc, age, dob) => {
		setShowModal(true);
		setModalTitle('edit');
		setIsEditing(true);
		setEditedCampsite({
			id: id,
			name: name,
			desc: desc,
			age: age,
			dob: dob,
		});
	};

	const handleDelete = () => {
		setShowModal(false);
		dispatch(deleteCampsite(campsiteId));
	};

	const handleRemove = (id) => {
		setCampsiteId(id);
		setShowModal(true);
		setModalTitle('delete');
	};

	const getModalBody = () => {
		return modalTitle === 'delete' ? (
			<>
				<h3>Are you sure?</h3>
				<hr />
				<button className='btn btn-danger' onClick={handleDelete}>
					Delete
				</button>
			</>
		) : (
			<CampsitesForm
				isEditing={isEditing}
				editedCampsite={editedCampsite}
				handleCreate={handleCreate}
				handleUpdate={handleUpdate}
			/>
		);
	};

	const getModal = () => {
		return (
			<Modal
				title={modalTitle}
				body={getModalBody()}
				setShowModal={setShowModal}
			/>
		);
	};

	const handleDisplay = (e) => {
		const { value } = e.target;
		setDisplay(value);

		console.log(e.target.value);
	};

	const getCampsiteRecordsDisplay = () => {
		return campsites.map((campsite) => (
			<div key={campsite._id} className='col-lg-4 col-sm-6 mb-4'>
				<CampsiteRecord
					campsite={campsite}
					handleRemove={handleRemove}
					handleEdit={handleEdit}
					handleAdd={handleAdd}
				/>
			</div>
		));
	};

	const getCampsiteTableDisplay = () => (
		<CampsitesTable
			campsites={campsites}
			handleRemove={handleRemove}
			handleEdit={handleEdit}
			handleAdd={handleAdd}
		/>
	);

	const getDisplay = () => {
		if (display === 'records') {
			return getCampsiteRecordsDisplay();
		} else {
			return getCampsiteTableDisplay();
		}
	};

	useEffect(() => {
		dispatch(resetAlerts());
		dispatch(getCampsites(getUserId()));
		setUpdatedCampsite(false);
	}, [updatedCampsite, dispatch]);

	return (
		<div className='container'>
			{showModal ? getModal() : false}
			<h3>Campsites</h3>
			<button
				className='btn'
				disabled={alerts.length > 0}
				onClick={handleAdd}
			>
				<i className='fas fa-plus-circle fa-lg text-success'></i>
			</button>
			<div className='custom-control custom-radio custom-control-inline'>
				<input
					type='radio'
					id='rd_1'
					name='rd'
					className='custom-control-input'
					value='records'
					onClick={handleDisplay}
					checked={display === 'records'}
				/>
				<label className='custom-control-label' htmlFor='rd_1'>
					Records
				</label>
			</div>
			<div className='custom-control custom-radio custom-control-inline'>
				<input
					type='radio'
					id='rd_2'
					name='rd'
					className='custom-control-input'
					value='table'
					onClick={handleDisplay}
					checked={display === 'table'}
				/>
				<label className='custom-control-label' htmlFor='rd_2'>
					Table
				</label>
			</div>
			<div className='row mt-4'>
				{loading ? (
					<Spinner />
				) : campsites.length > 0 ? (
					getDisplay()
				) : (
					<p>No campsites to display - please add one</p>
				)}
			</div>
		</div>
	);
};

export default Campsites;

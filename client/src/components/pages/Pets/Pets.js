import React, { useState, useEffect } from 'react';
import Spinner from '../../partials/Spinner/Spinner';
import PetsForm from './PetsForm';
import PetRecord from './PetRecord';
import PetsTable from './PetsTable';

import { useDispatch, useSelector } from 'react-redux';
import {
	getPets,
	createPet,
	deletePet,
	updatePet,
} from '../../../redux/actions/petActions';
import { resetAlerts } from '../../../redux/actions/alertActions';
import Modal from '../../partials/Modal/Modal';

const Pets = () => {
	const alerts = useSelector((state) => state.alertReducer);
	const { token, isAuthenticated, user } = useSelector(
		(state) => state.authReducer
	);
	const pets = useSelector((state) => state.petReducer.pets); //gets from rootReducer which has petReducer imported
	const loading = useSelector((state) => state.petReducer.loading); //gets from rootReducer which has petReducer imported
	const dispatch = useDispatch();
	const [isEditing, setIsEditing] = useState(false);
	const [editedPet, setEditedPet] = useState({
		id: '',
		name: '',
		desc: '',
		dob: '',
		age: '',
	});
	const [updatedPet, setUpdatedPet] = useState(false);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [petId, setPetId] = useState();
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
		dispatch(createPet(formData, getUserId()));
	};

	const handleAdd = () => {
		setShowModal(true);
		setIsEditing(false);
		setModalTitle('add');
	};

	const handleUpdate = (id, formData) => {
		setShowModal(false);
		setIsEditing(false);
		setUpdatedPet(true);
		dispatch(updatePet(id, formData));
	};

	const handleEdit = (id, name, desc, age, dob) => {
		setShowModal(true);
		setModalTitle('edit');
		setIsEditing(true);
		setEditedPet({
			id: id,
			name: name,
			desc: desc,
			age: age,
			dob: dob,
		});
	};

	const handleDelete = () => {
		setShowModal(false);
		dispatch(deletePet(petId));
	};

	const handleRemove = (id) => {
		setPetId(id);
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
			<PetsForm
				isEditing={isEditing}
				editedPet={editedPet}
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

	const getPetRecordsDisplay = () => {
		return pets.map((pet) => (
			<div key={pet._id} className='col-lg-4 col-sm-6 mb-4'>
				<PetRecord
					pet={pet}
					handleRemove={handleRemove}
					handleEdit={handleEdit}
					handleAdd={handleAdd}
				/>
			</div>
		));
	};

	const getPetTableDisplay = () => (
		<PetsTable
			pets={pets}
			handleRemove={handleRemove}
			handleEdit={handleEdit}
			handleAdd={handleAdd}
		/>
	);

	const getDisplay = () => {
		if (display === 'records') {
			return getPetRecordsDisplay();
		} else {
			return getPetTableDisplay();
		}
	};

	useEffect(() => {
		dispatch(resetAlerts());
		dispatch(getPets(getUserId()));
		setUpdatedPet(false);
	}, [updatedPet, dispatch]);

	return (
		<div className='container'>
			{showModal ? getModal() : false}
			<h3>Pets</h3>
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
				) : pets.length > 0 ? (
					getDisplay()
				) : (
					<p>No pets to display - please add one</p>
				)}
			</div>
		</div>
	);
};

export default Pets;

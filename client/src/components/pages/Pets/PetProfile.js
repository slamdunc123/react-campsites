import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PetsForm from './PetsForm';
import Modal from '../../partials/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	getPets,
	deletePet,
	updatePet,
} from '../../../redux/actions/petActions';
import { resetAlerts } from '../../../redux/actions/alertActions';

const PetProfile = () => {
	const dispatch = useDispatch();
	const pets = useSelector((state) => state.petReducer.pets);
	const alerts = useSelector((state) => state.alertReducer);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editedPet, setEditedPet] = useState({
		id: '',
		name: '',
		desc: '',
	});
	const [updatedPet, setUpdatedPet] = useState(false);
	const [petId, setPetId] = useState();

	const history = useHistory();
	const { location: pathname } = history;
	const pathUrl = pathname.pathname;
	const pathUrlLastItem = pathUrl.substring(pathUrl.lastIndexOf('/') + 1);
	console.log(pathUrlLastItem);

	const getUserId = () => {
		const userId = localStorage.getItem('userId');
		return userId;
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
		history.push('/pets');
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

	//TODO: not clear why this is fixing the refresh issue on a selected pet profile page
	let pet;
	if (pets !== []) {
		pet = pets.find((pet) => pet._id === pathUrlLastItem);
	}

	useEffect(() => {
		dispatch(resetAlerts());
		dispatch(getPets(getUserId()));
		setUpdatedPet(false);
	}, [updatedPet, dispatch]);

	return (
		<>
			<div>Pet Profile</div>
			{showModal ? getModal() : false}
			{pet !== undefined ? (
				<div className='card'>
					<div className='text-center'>
						{pet.imageFile ? (
							<img
								src={pet.imageFile}
								alt=''
								class='rounded-circle'
								width='100'
								height='100'
							/>
						) : (
							<i className='fas fa-paw fa-4x text-primary'></i>
						)}
					</div>
					<div className='card-body'>
						<h5 className='card-title text-center'>{pet.name}</h5>
						<p className='card-text'>{pet.desc}</p>
						<div className='row justify-content-center'>
							<button
								onClick={() =>
									handleEdit(
										pet._id,
										pet.name,
										pet.desc,
										pet.age,
										pet.dob
									)
								}
								className='btn'
								disabled={alerts.length > 0}
							>
								<i className='fas fa-pencil-alt text-warning'></i>
							</button>
							<button
								onClick={() => handleRemove(pet._id)}
								className='btn'
								disabled={alerts.length > 0}
							>
								<i className='fas fa-trash text-danger'></i>
							</button>
							<Link
								// className='badge badge-primary'
								className='btn'
								title='reminders'
								to={{
									pathname: '/reminders',
									petId: pathUrlLastItem,
								}}
							>
								<i className='fas fa-clock text-info'></i>
							</Link>
						</div>
					</div>
				</div>
			) : (
				false
			)}
		</>
	);
};

export default PetProfile;

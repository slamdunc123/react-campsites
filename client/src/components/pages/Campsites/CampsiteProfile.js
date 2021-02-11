import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CampsitesForm from './CampsitesForm';
import Modal from '../../partials/Modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
	getCampsites,
	deleteCampsite,
	updateCampsite,
} from '../../../redux/actions/campsiteActions';
import { resetAlerts } from '../../../redux/actions/alertActions';

const CampsiteProfile = () => {
	const dispatch = useDispatch();
	const campsites = useSelector((state) => state.campsiteReducer.campsites);
	const alerts = useSelector((state) => state.alertReducer);
	const [showModal, setShowModal] = useState(false);
	const [modalTitle, setModalTitle] = useState('');
	const [isEditing, setIsEditing] = useState(false);
	const [editedCampsite, setEditedCampsite] = useState({
		id: '',
		name: '',
		desc: '',
	});
	const [updatedCampsite, setUpdatedCampsite] = useState(false);
	const [campsiteId, setCampsiteId] = useState();

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
		history.push('/campsites');
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

	//TODO: not clear why this is fixing the refresh issue on a selected campsite profile page
	let campsite;
	if (campsites !== []) {
		campsite = campsites.find(
			(campsite) => campsite._id === pathUrlLastItem
		);
	}

	useEffect(() => {
		dispatch(resetAlerts());
		dispatch(getCampsites(getUserId()));
		setUpdatedCampsite(false);
	}, [updatedCampsite, dispatch]);

	return (
		<>
			<div>Campsite Profile</div>
			{showModal ? getModal() : false}
			{campsite !== undefined ? (
				<div className='card'>
					<div className='text-center'>
						{campsite.imageFile ? (
							<img
								src={campsite.imageFile}
								alt=''
								class='rounded-circle'
								width='100'
								height='100'
							/>
						) : (
							<i className='fas fa-campground fa-4x text-primary'></i>
						)}
					</div>
					<div className='card-body'>
						<h5 className='card-title text-center'>
							{campsite.name}
						</h5>
						<p className='card-text'>{campsite.desc}</p>
						<div className='row justify-content-center'>
							<button
								onClick={() =>
									handleEdit(
										campsite._id,
										campsite.name,
										campsite.desc,
										campsite.age,
										campsite.dob
									)
								}
								className='btn'
								disabled={alerts.length > 0}
							>
								<i className='fas fa-pencil-alt text-warning'></i>
							</button>
							<button
								onClick={() => handleRemove(campsite._id)}
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
									campsiteId: pathUrlLastItem,
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

export default CampsiteProfile;

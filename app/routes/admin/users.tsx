import { useEffect, useState } from "react";
import { getAllPosts, getAllUsers, getAllVerificationRequests, getUserById, getVerificationRequestById, handleVerificationRequest, unverifyUserById, verifyUserById } from "../../../firebase.config";
import type { Route } from "./+types/users";
import Modal from "~/components/modal";

export function loader() {
    return { name: "React Router" };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
    const [users, setUsers] = useState([{}]);
    const [verificationRequests, setVerificationRequests] = useState([{}]);
    const [posts, setPosts] = useState([{}]);
    const [currentUser, setCurrentUser] = useState<any>({});
    const [currentRequest, setCurrentRequest] = useState<any>({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);

    const openModal = (id: string) => {
        setCurrentRequest(getVerificationRequestById(verificationRequests, id));
        setModalOpen(true);
    }

    const closeModal = () => {
        setModalOpen(false);
    }

    const openUserModal = (id: string) => {
        setCurrentUser(getUserById(users, id));
        setUserModalOpen(true);
    }

    const closeUserModal = () => {
        setUserModalOpen(false);
    }

    const approveVerificationRequest = (requestId: string, requesterId: string) => {
        handleVerificationRequest(requestId);
        verifyUserById(requesterId);
        closeModal();
    }

    const removeVerificationStatus = (id: string) => {
        unverifyUserById(id);
        closeUserModal();
    }

    const getSubmitterName = (id: string) => {
        const submitter: any = getUserById(users, id);
        return submitter?.firstName + " " + submitter?.lastName;
    }

    useEffect(() => {
        return getAllPosts(setPosts);
    }, []);

    useEffect(() => {
        return getAllUsers(setUsers);
    }, []);
    
    useEffect(() => {
        return getAllVerificationRequests(setVerificationRequests);
    }, []);

    return (
        <div>
            <h1>Users</h1>
            {
                users.length <= 0 ?
                    <p>There are currently no users.</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Full Name</th>
                                <th>Username</th>
                                <th>Verified</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user: any) => {
                                return (
                                    <tr key={user?.id}>
                                        <td>{user?.email}</td>
                                        <td>{user?.firstName + " " + user?.lastName}</td>
                                        <td>{user.username}</td>
                                        <td>{user?.verified ? "✓" : "x"}</td>
                                        <td><button onClick={() => openUserModal(user?.id)}>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <h1>Verification Requests</h1>
            {
                verificationRequests.length <= 0 ?
                    <p>No Verification Requests so far.</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Submitted At</th>
                                <th>User Email</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {verificationRequests.map((request: any) => {
                                return (
                                    <tr key={request?.id}>
                                        <td>{request?.submittedAt?.toDate()?.toString()}</td>
                                        <td>{request?.userEmail}</td>
                                        <td>{getSubmitterName(request?.userId)}</td>
                                        <td>{request?.status}</td>
                                        <td><button onClick={() => openModal(request?.id)}>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <Modal isOpen={isModalOpen}>
                <div className="flex flex-col justify-center">
                    <div className="flex flex-row">
                        <b>Submitted By: </b>
                        <p>{getSubmitterName(currentRequest?.userId)}</p>
                    </div>
                    <div className="flex flex-row">
                        <b>Submission Date: </b>
                        {currentRequest?.submittedAt?.toDate()?.toString()}
                    </div>
                    <img src={currentRequest?.licenseImageUrl} />
                </div>
                <div className="flex flex-row">
                    <button onClick={closeModal}>Close</button>
                    {
                        (currentRequest?.status === "pending") &&
                        <button onClick={() => approveVerificationRequest(currentRequest?.id, currentRequest?.userId)}>Approve</button>
                    }
                </div>
            </Modal>
            <Modal isOpen={isUserModalOpen}>
                <div className="flex flex-col justify-center">
                    {
                        (currentUser?.imageUrl) &&
                        <img src={currentUser?.imageUrl} />
                    }
                    <div className="flex flex-row">
                        <b>Full Name: </b>
                        <p>{currentUser?.firstName} {currentUser?.lastName}</p>
                    </div>
                    <div className="flex flex-row">
                        <b>Username: </b>
                        {currentUser?.username}
                    </div>
                    <div className="flex flex-row">
                        <b>Email: </b>
                        {currentUser?.email}
                    </div>
                </div>
                <div className="flex flex-row">
                    <button onClick={closeUserModal}>Close</button>
                    {
                        (currentUser?.verified) &&
                        <button onClick={() => removeVerificationStatus(currentUser?.id)}>Remove Verification</button>
                    }
                </div>
            </Modal>
        </div>
    );
}

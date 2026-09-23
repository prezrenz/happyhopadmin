import { useEffect, useState } from "react";
import { deletePinById, getAllPosts, getAllUsers, getAllVerificationRequests, getAllVetPins, getPinsById, getUserById, getVerificationRequestById, handleVerificationRequest, unverifySupplierUserById, unverifyUserById, unverifyVetUserById, verifySupplierUserById, verifyUserById } from "../../../firebase.config";
import type { Route } from "./+types/users";
import Modal from "~/components/modal";
import WideModal from "~/components/wideModal";

export function loader() {
    return { name: "React Router" };
}

export default function Reports({ loaderData }: Route.ComponentProps) {
    const [users, setUsers] = useState([{}]);
    const [verificationRequests, setVerificationRequests] = useState([{}]);
    const [posts, setPosts] = useState([{}]);
    const [pins, setPins] = useState([{}]);
    const [currentUser, setCurrentUser] = useState<any>({});
    const [currentPins, setCurrentPins] = useState([{}])
    const [currentRequest, setCurrentRequest] = useState<any>({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);

    const openModal = (id: string) => {
        setCurrentRequest(getVerificationRequestById(verificationRequests, id));
        setModalOpen(true);
    }

    const closeModal = () => {
        setCurrentRequest(null);
        setModalOpen(false);
    }

    const openUserModal = (id: string) => {
        setCurrentUser(getUserById(users, id));
        setUserModalOpen(true);
    }

    const closeUserModal = () => {
        setCurrentUser(null);
        setCurrentPins([{}]);
        setUserModalOpen(false);
    }

    const approveVerificationRequest = (requestId: string, requesterId: string, verificationType: string) => {
        handleVerificationRequest(requestId);
        if (verificationType === "feed_supplier") {
            verifySupplierUserById(requesterId);
        } else {
            verifyUserById(requesterId);
        }
        closeModal();
    }

    const removeVerificationStatus = (id: string, type: string) => {
        switch(type) {
            case "verified":
            case "verifiedVet":
                unverifyUserById(id);
                unverifyVetUserById(id);
                break;
            case "verifiedFeedSupplier":
                unverifySupplierUserById(id);
                break;
        }
        closeUserModal();
    }

    const getVerifications = (id: string) => {
        const user: any = getUserById(users, id);
        var verifications: string[] = [];
        if(user?.verified || user?.verifiedVet) {
            verifications.push("Veterinarian");
        }
        if(user?.verifiedFeedSupplier) {
            verifications.push("Feed Supplier");
        }
        if(verifications.length <= 0) {
            return "This user has no verifications.";
        }

        return verifications.join(", ");
    }

    const getSubmitterName = (id: string) => {
        const submitter: any = getUserById(users, id);
        return submitter?.firstName + " " + submitter?.lastName;
    }

    const deleteMapPin = (id: string) => {
        deletePinById(id);
        closeUserModal();
    }

    const getVetPins = () => {
        return currentPins.filter((pin: any) => pin?.type === "vet");
    }

    const getFeedPins = () => {
        return currentPins.filter((pin: any) => pin?.type === "feed");
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

    useEffect(() => {
        return getAllVetPins(setPins);
    }, []);

    useEffect(() => {
        if (currentUser?.verified || currentUser?.verifiedVet || currentUser?.verifiedFeedSupplier) {
            setCurrentPins(getPinsById(pins, currentUser?.id));
        } else {
            setCurrentPins([{}]);
        }
    }, [currentUser]);

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl">Users</h1>
            {
                users.length <= 0 ?
                    <p>There are currently no users.</p> :
                    <table className="border border-black rounded-2xl overflow-hidden">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="px-4 py-2 text-left">Email</th>
                                <th className="px-4 py-2 text-left">Full Name</th>
                                <th className="px-4 py-2 text-left">Username</th>
                                <th className="px-4 py-2 text-left">Verified</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                            {users.map((user: any) => {
                                return (
                                    <tr key={user?.id}>
                                        <td className="px-4 py-2">{user?.email}</td>
                                        <td className="px-4 py-2">{user?.firstName + " " + user?.lastName}</td>
                                        <td className="px-4 py-2">{user.username}</td>
                                        <td className="px-4 py-2">{user?.verified || user?.verifiedVet || user?.verifiedFeedSupplier ? "✓" : "x"}</td>
                                        <td className="px-4 py-2"><button onClick={() => openUserModal(user?.id)}>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <h1 className="font-bold text-2xl">Verification Requests</h1>
            {
                verificationRequests.length <= 0 ?
                    <p>No Verification Requests so far.</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Submitted At</th>
                                <th>User Email</th>
                                <th>Name</th>
                                <th>Type</th>
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
                                        <td>{request?.verificationType === "feed_supplier" ? "Feed Supplier" : "Veterinarian"}</td>
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
                    <div className="flex flex-row">
                        <b>Type: </b>
                        {currentRequest?.verificationType === "feed_supplier" ? "Feed Supplier" : "Veterinarian"}
                    </div>
                    <img src={currentRequest?.licenseImageUrl} />
                </div>
                <div className="flex flex-row">
                    <button onClick={closeModal}>Close</button>
                    {
                        (currentRequest?.status === "pending") &&
                        <button onClick={() => approveVerificationRequest(currentRequest?.id, currentRequest?.userId, currentRequest?.verificationType)}>Approve</button>
                    }
                </div>
            </Modal>
            <WideModal isOpen={isUserModalOpen}>
                <div className="flex flex-row">
                    <div className="flex flex-col justify-center">
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
                        <div className="flex flex-row">
                            <b>Verifications: </b>
                            {getVerifications(currentUser?.id)}
                        </div>
                    </div>
                    {
                        (currentUser?.imageUrl) &&
                        <img className="object-scale-down max-w-1/12 m-auto" src={currentUser?.imageUrl} />
                    }
                </div>
                {
                    (currentUser?.verified || currentUser?.verifiedVet) &&
                    <>
                        <h1 className="font-bold text-2xl">Vet Map Pins</h1>
                        {
                            getVetPins().length <= 0 ?
                                <p>This user has no veterinary clinic map pins.</p> :
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Submitted At</th>
                                            <th>Clinic Name</th>
                                            <th>Type</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getVetPins().map((pin: any) => {
                                            return (
                                                <tr key={pin?.id}>
                                                    <td>{pin?.clinicName}</td>
                                                    <td>Veterinary Clinic</td>
                                                    <td>{pin?.latitude}</td>
                                                    <td>{pin?.longitude}</td>
                                                    <td><button onClick={() => deleteMapPin(pin?.id)}>Delete</button></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                        }
                    </>
                }
                {
                    (currentUser?.verifiedFeedSupplier) &&
                    <>
                        <h1 className="font-bold text-2xl">Feed Supplier Map Pins</h1>
                        {
                            getFeedPins().length <= 0 ?
                                <p>This user has no feed supplier map pins.</p> :
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Submitted At</th>
                                            <th>Store Name</th>
                                            <th>Type</th>
                                            <th>Latitude</th>
                                            <th>Longitude</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getFeedPins().map((pin: any) => {
                                            return (
                                                <tr key={pin?.id}>
                                                    <td>{pin?.clinicName}</td>
                                                    <td>Feed Supplier</td>
                                                    <td>{pin?.latitude}</td>
                                                    <td>{pin?.longitude}</td>
                                                    <td><button onClick={() => deleteMapPin(pin?.id)}>Delete</button></td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </table>
                        }
                    </>
                }
                <div className="flex flex-row">
                    <button onClick={closeUserModal}>Close</button>
                    {
                        (currentUser?.verified || currentUser?.verifiedVet) &&
                        <button onClick={() => removeVerificationStatus(currentUser?.id, "verified")}>Remove Veterinarian Verification</button>
                    }
                    {
                        (currentUser?.verifiedFeedSupplier) &&
                        <button onClick={() => removeVerificationStatus(currentUser?.id, "verifiedFeedSupplier")}>Remove Feed Supplier Verification</button>
                    }
                </div>
            </WideModal>
        </div>
    );
}
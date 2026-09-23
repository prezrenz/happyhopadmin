import { useEffect, useState } from "react";
import { deletePinById, disableUserById, enableUserById, getAllPosts, getAllUsers, getAllVerificationRequests, getAllVetPins, getPinsById, getUserById, getVerificationRequestById, handleVerificationRequest, unverifySupplierUserById, unverifyUserById, unverifyVetUserById, updatePinById, verifySupplierUserById, verifyUserById } from "../../../firebase.config";
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

    const [isEditPinModalOpen, setEditPinModalOpen] = useState(false);
    const [editingPin, setEditingPin] = useState<any>(null);
    const [editClinicName, setEditClinicName] = useState("");
    const [editLatitude, setEditLatitude] = useState("");
    const [editLongitude, setEditLongitude] = useState("");

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

    const toggleAccountDisabled = (id: string, isDisabled: boolean) => {
        if (isDisabled) {
            enableUserById(id);
        } else {
            disableUserById(id);
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

    const openEditPinModal = (pin: any) => {
        setEditingPin(pin);
        setEditClinicName(pin?.clinicName ?? "");
        setEditLatitude(pin?.latitude?.toString() ?? "");
        setEditLongitude(pin?.longitude?.toString() ?? "");
        setEditPinModalOpen(true);
    }

    const closeEditPinModal = () => {
        setEditingPin(null);
        setEditClinicName("");
        setEditLatitude("");
        setEditLongitude("");
        setEditPinModalOpen(false);
    }

    const saveEditPin = () => {
        if (!editingPin?.id) return;
        updatePinById(editingPin.id, {
            clinicName: editClinicName,
            latitude: parseFloat(editLatitude),
            longitude: parseFloat(editLongitude),
        });
        setCurrentPins((prev: any[]) =>
            prev.map((pin: any) =>
                pin?.id === editingPin.id
                    ? { ...pin, clinicName: editClinicName, latitude: parseFloat(editLatitude), longitude: parseFloat(editLongitude) }
                    : pin
            )
        );
        closeEditPinModal();
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

    const renderPinTable = (pinList: any[], nameLabel: string, typeLabel: string) => {
        if (pinList.length <= 0) {
            return <p className="text-gray-600">This user has no {nameLabel.toLowerCase()} map pins.</p>;
        }
        return (
            <table className="w-full border border-black rounded-2xl overflow-hidden">
                <thead className="bg-gray-100">
                    <tr className="border-b border-black">
                        <th className="px-4 py-2 text-left">{nameLabel}</th>
                        <th className="px-4 py-2 text-left">Type</th>
                        <th className="px-4 py-2 text-left">Latitude</th>
                        <th className="px-4 py-2 text-left">Longitude</th>
                        <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-black">
                    {pinList.map((pin: any) => {
                        return (
                            <tr key={pin?.id}>
                                <td className="px-4 py-2">{pin?.clinicName}</td>
                                <td className="px-4 py-2">{typeLabel}</td>
                                <td className="px-4 py-2">{pin?.latitude}</td>
                                <td className="px-4 py-2">{pin?.longitude}</td>
                                <td className="px-4 py-2">
                                    <div className="flex flex-row gap-2">
                                        <button
                                            className="px-3 py-1 border border-black rounded-lg"
                                            onClick={() => openEditPinModal(pin)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="px-3 py-1 border border-black rounded-lg"
                                            onClick={() => deleteMapPin(pin?.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 p-6">
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
                                <th className="px-4 py-2 text-left">Status</th>
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
                                        <td className="px-4 py-2">{user?.disabled ? "Disabled" : "Active"}</td>
                                        <td className="px-4 py-2"><button className="px-3 py-1 border border-black rounded-lg" onClick={() => openUserModal(user?.id)}>View Details</button></td>
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
                    <table className="border border-black rounded-2xl overflow-hidden">
                        <thead>
                            <tr className="border-b border-black">
                                <th className="px-4 py-2 text-left">Submitted At</th>
                                <th className="px-4 py-2 text-left">User Email</th>
                                <th className="px-4 py-2 text-left">Name</th>
                                <th className="px-4 py-2 text-left">Type</th>
                                <th className="px-4 py-2 text-left">Status</th>
                                <th className="px-4 py-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black">
                            {verificationRequests.map((request: any) => {
                                return (
                                    <tr key={request?.id}>
                                        <td className="px-4 py-2">{request?.submittedAt?.toDate()?.toString()}</td>
                                        <td className="px-4 py-2">{request?.userEmail}</td>
                                        <td className="px-4 py-2">{getSubmitterName(request?.userId)}</td>
                                        <td className="px-4 py-2">{request?.verificationType === "feed_supplier" ? "Feed Supplier" : "Veterinarian"}</td>
                                        <td className="px-4 py-2">{request?.status}</td>
                                        <td className="px-4 py-2"><button className="px-3 py-1 border border-black rounded-lg" onClick={() => openModal(request?.id)}>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <Modal isOpen={isModalOpen}>
                <div className="flex flex-col gap-2 justify-center">
                    <div className="flex flex-row gap-1">
                        <b>Submitted By: </b>
                        <p>{getSubmitterName(currentRequest?.userId)}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Submission Date: </b>
                        {currentRequest?.submittedAt?.toDate()?.toString()}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Type: </b>
                        {currentRequest?.verificationType === "feed_supplier" ? "Feed Supplier" : "Veterinarian"}
                    </div>
                    <img className="mt-2 rounded-lg" src={currentRequest?.licenseImageUrl} />
                </div>
                <div className="flex flex-row gap-2 mt-4">
                    <button className="px-3 py-1 border border-black rounded-lg" onClick={closeModal}>Close</button>
                    {
                        (currentRequest?.status === "pending") &&
                        <button className="px-3 py-1 border border-black rounded-lg" onClick={() => approveVerificationRequest(currentRequest?.id, currentRequest?.userId, currentRequest?.verificationType)}>Approve</button>
                    }
                </div>
            </Modal>
            <WideModal isOpen={isUserModalOpen}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row gap-6">
                        <div className="flex flex-col gap-1 justify-center">
                            <div className="flex flex-row gap-1">
                                <b>Full Name: </b>
                                <p>{currentUser?.firstName} {currentUser?.lastName}</p>
                            </div>
                            <div className="flex flex-row gap-1">
                                <b>Username: </b>
                                {currentUser?.username}
                            </div>
                            <div className="flex flex-row gap-1">
                                <b>Email: </b>
                                {currentUser?.email}
                            </div>
                            <div className="flex flex-row gap-1">
                                <b>Verifications: </b>
                                {getVerifications(currentUser?.id)}
                            </div>
                            <div className="flex flex-row gap-1">
                                <b>Account Status: </b>
                                {currentUser?.disabled ? "Disabled" : "Active"}
                            </div>
                        </div>
                        {
                            (currentUser?.imageUrl) &&
                            <img className="object-scale-down max-w-1/12 m-auto rounded-lg" src={currentUser?.imageUrl} />
                        }
                    </div>
                    {
                        (currentUser?.verified || currentUser?.verifiedVet) &&
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold text-2xl">Vet Map Pins</h1>
                            {renderPinTable(getVetPins(), "Clinic Name", "Veterinary Clinic")}
                        </div>
                    }
                    {
                        (currentUser?.verifiedFeedSupplier) &&
                        <div className="flex flex-col gap-2">
                            <h1 className="font-bold text-2xl">Feed Supplier Map Pins</h1>
                            {renderPinTable(getFeedPins(), "Store Name", "Feed Supplier")}
                        </div>
                    }
                    <div className="flex flex-row gap-2">
                        <button className="px-3 py-1 border border-black rounded-lg" onClick={closeUserModal}>Close</button>
                        {
                            (currentUser?.verified || currentUser?.verifiedVet) &&
                            <button className="px-3 py-1 border border-black rounded-lg" onClick={() => removeVerificationStatus(currentUser?.id, "verified")}>Remove Veterinarian Verification</button>
                        }
                        {
                            (currentUser?.verifiedFeedSupplier) &&
                            <button className="px-3 py-1 border border-black rounded-lg" onClick={() => removeVerificationStatus(currentUser?.id, "verifiedFeedSupplier")}>Remove Feed Supplier Verification</button>
                        }
                        <button className="px-3 py-1 border border-black rounded-lg" onClick={() => toggleAccountDisabled(currentUser?.id, currentUser?.disabled)}>
                            {currentUser?.disabled ? "Enable Account" : "Disable Account"}
                        </button>
                    </div>
                </div>
            </WideModal>
            <Modal isOpen={isEditPinModalOpen}>
                <div className="flex flex-col gap-3">
                    <h1 className="font-bold text-xl">Edit Pin</h1>
                    <label className="flex flex-col gap-1">
                        <span className="font-bold">Name</span>
                        <input
                            className="border border-black rounded-lg px-2 py-1"
                            value={editClinicName}
                            onChange={(e) => setEditClinicName(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="font-bold">Latitude</span>
                        <input
                            className="border border-black rounded-lg px-2 py-1"
                            value={editLatitude}
                            onChange={(e) => setEditLatitude(e.target.value)}
                        />
                    </label>
                    <label className="flex flex-col gap-1">
                        <span className="font-bold">Longitude</span>
                        <input
                            className="border border-black rounded-lg px-2 py-1"
                            value={editLongitude}
                            onChange={(e) => setEditLongitude(e.target.value)}
                        />
                    </label>
                    <div className="flex flex-row gap-2 mt-2">
                        <button className="px-3 py-1 border border-black rounded-lg" onClick={closeEditPinModal}>Cancel</button>
                        <button className="px-3 py-1 border border-black rounded-lg" onClick={saveEditPin}>Save</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
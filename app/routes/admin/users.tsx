import { useEffect, useState } from "react";
import {
    deletePinById,
    disableUserById,
    enableUserById,
    getAllPosts,
    getAllUsers,
    getAllVerificationRequests,
    getAllVetPins,
    getPinsById,
    getUserById,
    getVerificationRequestById,
    handleVerificationRequest,
    unverifySupplierUserById,
    unverifyUserById,
    unverifyVetUserById,
    updatePinById,
    verifySupplierUserById,
    verifyUserById
} from "../../../firebase.config";
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
    const [currentPins, setCurrentPins] = useState([{}]);
    const [currentRequest, setCurrentRequest] = useState<any>({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isEditPinModalOpen, setEditPinModalOpen] = useState(false);
    const [editingPin, setEditingPin] = useState<any>(null);
    const [editClinicName, setEditClinicName] = useState("");
    const [editLatitude, setEditLatitude] = useState("");
    const [editLongitude, setEditLongitude] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    const openModal = (id: string) => {
        setCurrentRequest(getVerificationRequestById(verificationRequests, id));
        setModalOpen(true);
    };

    const closeModal = () => {
        setCurrentRequest(null);
        setModalOpen(false);
    };

    const openUserModal = (id: string) => {
        setCurrentUser(getUserById(users, id));
        setUserModalOpen(true);
    };

    const closeUserModal = () => {
        setCurrentUser(null);
        setCurrentPins([{}]);
        setUserModalOpen(false);
    };

    const approveVerificationRequest = (
        requestId: string,
        requesterId: string,
        verificationType: string
    ) => {
        handleVerificationRequest(requestId);

        if (verificationType === "feed_supplier") {
            verifySupplierUserById(requesterId);
        } else {
            verifyUserById(requesterId);
        }

        closeModal();
    };

    const removeVerificationStatus = (id: string, type: string) => {
        switch (type) {
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
    };

    const toggleAccountDisabled = (id: string, isDisabled: boolean) => {
        if (isDisabled) {
            enableUserById(id);
        } else {
            disableUserById(id);
        }

        closeUserModal();
    };

    const getVerifications = (id: string) => {
        const user: any = getUserById(users, id);
        const verifications: string[] = [];

        if (user?.verified || user?.verifiedVet) {
            verifications.push("Veterinarian");
        }

        if (user?.verifiedFeedSupplier) {
            verifications.push("Feed Supplier");
        }

        if (verifications.length <= 0) {
            return "This user has no verifications.";
        }

        return verifications.join(", ");
    };

    const getSubmitterName = (id: string) => {
        const submitter: any = getUserById(users, id);
        return submitter?.firstName + " " + submitter?.lastName;
    };

    const deleteMapPin = (id: string) => {
        deletePinById(id);
        closeUserModal();
    };

    const getVetPins = () => {
        return currentPins.filter((pin: any) => pin?.type === "vet");
    };

    const getFeedPins = () => {
        return currentPins.filter((pin: any) => pin?.type === "feed");
    };

    const openEditPinModal = (pin: any) => {
        setEditingPin(pin);
        setEditClinicName(pin?.clinicName ?? "");
        setEditLatitude(pin?.latitude?.toString() ?? "");
        setEditLongitude(pin?.longitude?.toString() ?? "");
        setEditPinModalOpen(true);
    };

    const closeEditPinModal = () => {
        setEditingPin(null);
        setEditClinicName("");
        setEditLatitude("");
        setEditLongitude("");
        setEditPinModalOpen(false);
    };

    const saveEditPin = () => {
        if (!editingPin?.id) return;

        updatePinById(editingPin.id, {
            clinicName: editClinicName,
            latitude: parseFloat(editLatitude),
            longitude: parseFloat(editLongitude)
        });

        setCurrentPins((prev: any[]) =>
            prev.map((pin: any) =>
                pin?.id === editingPin.id
                    ? {
                        ...pin,
                        clinicName: editClinicName,
                        latitude: parseFloat(editLatitude),
                        longitude: parseFloat(editLongitude)
                    }
                    : pin
            )
        );

        closeEditPinModal();
    };

    const runSearch = () => {
        setSearchQuery(searchInput);
    };

    const clearSearch = () => {
        setSearchInput("");
        setSearchQuery("");
    };

    const getFilteredUsers = () => {
        if (!searchQuery.trim()) return users;

        const query = searchQuery.trim().toLowerCase();

        return users.filter((user: any) => {
            const fullName = `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.toLowerCase();
            const username = (user?.username ?? "").toLowerCase();
            const email = (user?.email ?? "").toLowerCase();

            return (
                fullName.includes(query) ||
                username.includes(query) ||
                email.includes(query)
            );
        });
    };

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
        if (
            currentUser?.verified ||
            currentUser?.verifiedVet ||
            currentUser?.verifiedFeedSupplier
        ) {
            setCurrentPins(getPinsById(pins, currentUser?.id));
        } else {
            setCurrentPins([{}]);
        }
    }, [currentUser]);

    const renderPinTable = (
        pinList: any[],
        nameLabel: string,
        typeLabel: string
    ) => {
        if (pinList.length <= 0) {
            return (
                <p className="text-sm text-gray-600">
                    This user has no {nameLabel.toLowerCase()} map pins.
                </p>
            );
        }

        return (
            <div className="overflow-hidden rounded-lg border border-black">
                <table className="w-full border-collapse text-sm">
                    <thead>
                        <tr className="border-b border-black bg-orange-100">
                            <th className="px-4 py-3 text-left font-semibold">
                                {nameLabel}
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                                Type
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                                Latitude
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                                Longitude
                            </th>
                            <th className="px-4 py-3 text-left font-semibold">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {pinList.map((pin: any) => (
                            <tr
                                key={pin?.id}
                                className="border-b border-black last:border-b-0"
                            >
                                <td className="px-4 py-3">
                                    {pin?.clinicName}
                                </td>
                                <td className="px-4 py-3">
                                    {typeLabel}
                                </td>
                                <td className="px-4 py-3">
                                    {pin?.latitude}
                                </td>
                                <td className="px-4 py-3">
                                    {pin?.longitude}
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                        <button
                                            className="rounded-md border border-black px-3 py-1.5 hover:bg-orange-100"
                                            onClick={() => openEditPinModal(pin)}
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="rounded-md border border-black px-3 py-1.5 hover:bg-red-50"
                                            onClick={() => deleteMapPin(pin?.id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    };

    return (
        <div className="flex min-h-full flex-col items-center gap-6 bg-orange-50 p-6">
            <h1 className="text-2xl font-bold">
                Users
            </h1>

            <div className="flex w-full max-w-6xl items-center justify-end gap-2">
                <input
                    className="rounded-md border border-black bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange-400"
                    placeholder="Search by name, username, or email"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyDown={(e) =>
                        e.key === "Enter" && runSearch()
                    }
                />

                <button
                    className="rounded-md border border-black bg-white px-4 py-2 text-sm hover:bg-orange-100"
                    onClick={runSearch}
                >
                    Search
                </button>

                {searchQuery && (
                    <button
                        className="rounded-md border border-black bg-white px-4 py-2 text-sm hover:bg-orange-100"
                        onClick={clearSearch}
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="w-full max-w-6xl overflow-hidden rounded-lg border border-black">
                {getFilteredUsers().length <= 0 ? (
                    <div className="p-6 text-center">
                        {searchQuery
                            ? "No users match your search."
                            : "There are currently no users."}
                    </div>
                ) : (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-black bg-orange-100">
                                <th className="px-6 py-4 text-left font-bold">
                                    Email
                                </th>
                                <th className="px-6 py-4 text-left font-bold">
                                    Full Name
                                </th>
                                <th className="px-6 py-4 text-left font-bold">
                                    Username
                                </th>
                                <th className="px-6 py-4 text-center font-bold">
                                    Verified
                                </th>
                                <th className="px-6 py-4 text-center font-bold">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {getFilteredUsers().map((user: any) => (
                                <tr
                                    key={user?.id}
                                    className="border-b border-black last:border-b-0"
                                >
                                    <td className="px-6 py-5">
                                        {user?.email}
                                    </td>

                                    <td className="px-6 py-5">
                                        {user?.firstName} {user?.lastName}
                                    </td>

                                    <td className="px-6 py-5">
                                        {user?.username}
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        {user?.verified ||
                                        user?.verifiedVet ||
                                        user?.verifiedFeedSupplier ? (
                                            <span className="text-2xl font-bold text-green-500">
                                                ✓
                                            </span>
                                        ) : (
                                            <span className="text-2xl font-bold text-red-500">
                                                ✕
                                            </span>
                                        )}
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <span
                                            className={
                                                user?.disabled
                                                    ? "font-semibold text-red-500"
                                                    : "font-semibold text-green-500"
                                            }
                                        >
                                            {user?.disabled
                                                ? "Disabled"
                                                : "Active"}
                                        </span>
                                    </td>

                                    <td className="px-6 py-5 text-center">
                                        <button
                                            className="rounded-md border border-black bg-white px-3 py-2 hover:bg-orange-100"
                                            onClick={() =>
                                                openUserModal(user?.id)
                                            }
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <h1 className="mt-2 text-2xl font-bold">
                Verification Requests
            </h1>

            <div className="w-full max-w-6xl overflow-hidden rounded-lg border border-black">
                {verificationRequests.length <= 0 ? (
                    <p className="p-6 text-center">
                        No Verification Requests so far.
                    </p>
                ) : (
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-black bg-orange-100">
                                <th className="px-5 py-3 text-left font-bold">
                                    Submitted At
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    User Email
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    Name
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    Type
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    Status
                                </th>
                                <th className="px-5 py-3 text-center font-bold">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {verificationRequests.map((request: any) => (
                                <tr
                                    key={request?.id}
                                    className="border-b border-black last:border-b-0"
                                >
                                    <td className="px-5 py-4">
                                        {request?.submittedAt
                                            ?.toDate()
                                            ?.toString()}
                                    </td>

                                    <td className="px-5 py-4">
                                        {request?.userEmail}
                                    </td>

                                    <td className="px-5 py-4">
                                        {getSubmitterName(request?.userId)}
                                    </td>

                                    <td className="px-5 py-4">
                                        {request?.verificationType ===
                                        "feed_supplier"
                                            ? "Feed Supplier"
                                            : "Veterinarian"}
                                    </td>

                                    <td
                                        className={`px-5 py-4 font-semibold ${
                                            request?.status === "approved"
                                                ? "text-green-500"
                                                : request?.status ===
                                                    "rejected"
                                                  ? "text-red-500"
                                                  : "text-orange-500"
                                        }`}
                                    >
                                        {request?.status}
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        <button
                                            className="rounded-md border border-black bg-white px-3 py-2 hover:bg-orange-100"
                                            onClick={() =>
                                                openModal(request?.id)
                                            }
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <Modal isOpen={isModalOpen}>
                <div className="flex flex-col gap-3">
                    <div className="flex flex-row gap-1">
                        <b>Submitted By:</b>
                        <p>
                            {getSubmitterName(
                                currentRequest?.userId
                            )}
                        </p>
                    </div>

                    <div className="flex flex-row gap-1">
                        <b>Submission Date:</b>
                        <p>
                            {currentRequest?.submittedAt
                                ?.toDate()
                                ?.toString()}
                        </p>
                    </div>

                    <div className="flex flex-row gap-1">
                        <b>Type:</b>
                        <p>
                            {currentRequest?.verificationType ===
                            "feed_supplier"
                                ? "Feed Supplier"
                                : "Veterinarian"}
                        </p>
                    </div>

                    <img
                        className="mt-2 max-h-96 rounded-lg object-contain"
                        src={currentRequest?.licenseImageUrl}
                    />
                </div>

                <div className="mt-5 flex flex-row gap-2">
                    <button
                        className="rounded-md border border-black px-4 py-2 hover:bg-orange-100"
                        onClick={closeModal}
                    >
                        Close
                    </button>

                    {currentRequest?.status === "pending" && (
                        <button
                            className="rounded-md border border-black px-4 py-2 hover:bg-green-100"
                            onClick={() =>
                                approveVerificationRequest(
                                    currentRequest?.id,
                                    currentRequest?.userId,
                                    currentRequest?.verificationType
                                )
                            }
                        >
                            Approve
                        </button>
                    )}
                </div>
            </Modal>

            <WideModal isOpen={isUserModalOpen}>
                <div className="flex flex-col gap-6">
                    <div className="flex flex-row gap-8">
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-row gap-2">
                                <b>Full Name:</b>
                                <p>
                                    {currentUser?.firstName}{" "}
                                    {currentUser?.lastName}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <b>Username:</b>
                                <p>{currentUser?.username}</p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <b>Email:</b>
                                <p>{currentUser?.email}</p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <b>Verifications:</b>
                                <p>
                                    {getVerifications(
                                        currentUser?.id
                                    )}
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <b>Account Status:</b>
                                <p
                                    className={
                                        currentUser?.disabled
                                            ? "font-semibold text-red-500"
                                            : "font-semibold text-green-500"
                                    }
                                >
                                    {currentUser?.disabled
                                        ? "Disabled"
                                        : "Active"}
                                </p>
                            </div>
                        </div>

                        {currentUser?.imageUrl && (
                            <img
                                className="m-auto max-h-32 max-w-32 rounded-lg object-cover"
                                src={currentUser?.imageUrl}
                            />
                        )}
                    </div>

                    {(currentUser?.verified ||
                        currentUser?.verifiedVet) && (
                        <div className="flex flex-col gap-3">
                            <h1 className="text-xl font-bold">
                                Vet Map Pins
                            </h1>

                            {renderPinTable(
                                getVetPins(),
                                "Clinic Name",
                                "Veterinary Clinic"
                            )}
                        </div>
                    )}

                    {currentUser?.verifiedFeedSupplier && (
                        <div className="flex flex-col gap-3">
                            <h1 className="text-xl font-bold">
                                Feed Supplier Map Pins
                            </h1>

                            {renderPinTable(
                                getFeedPins(),
                                "Store Name",
                                "Feed Supplier"
                            )}
                        </div>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <button
                            className="rounded-md border border-black px-4 py-2 hover:bg-orange-100"
                            onClick={closeUserModal}
                        >
                            Close
                        </button>

                        {(currentUser?.verified ||
                            currentUser?.verifiedVet) && (
                            <button
                                className="rounded-md border border-black px-4 py-2 hover:bg-red-50"
                                onClick={() =>
                                    removeVerificationStatus(
                                        currentUser?.id,
                                        "verified"
                                    )
                                }
                            >
                                Remove Veterinarian Verification
                            </button>
                        )}

                        {currentUser?.verifiedFeedSupplier && (
                            <button
                                className="rounded-md border border-black px-4 py-2 hover:bg-red-50"
                                onClick={() =>
                                    removeVerificationStatus(
                                        currentUser?.id,
                                        "verifiedFeedSupplier"
                                    )
                                }
                            >
                                Remove Feed Supplier Verification
                            </button>
                        )}

                        <button
                            className="rounded-md border border-black px-4 py-2 hover:bg-orange-100"
                            onClick={() =>
                                toggleAccountDisabled(
                                    currentUser?.id,
                                    currentUser?.disabled
                                )
                            }
                        >
                            {currentUser?.disabled
                                ? "Enable Account"
                                : "Disable Account"}
                        </button>
                    </div>
                </div>
            </WideModal>

            <Modal isOpen={isEditPinModalOpen}>
                <div className="flex flex-col gap-4">
                    <h1 className="text-xl font-bold">
                        Edit Pin
                    </h1>

                    <label className="flex flex-col gap-1">
                        <span className="font-semibold">
                            Name
                        </span>

                        <input
                            className="rounded-md border border-black px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                            value={editClinicName}
                            onChange={(e) =>
                                setEditClinicName(e.target.value)
                            }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="font-semibold">
                            Latitude
                        </span>

                        <input
                            className="rounded-md border border-black px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                            value={editLatitude}
                            onChange={(e) =>
                                setEditLatitude(e.target.value)
                            }
                        />
                    </label>

                    <label className="flex flex-col gap-1">
                        <span className="font-semibold">
                            Longitude
                        </span>

                        <input
                            className="rounded-md border border-black px-3 py-2 outline-none focus:ring-2 focus:ring-orange-400"
                            value={editLongitude}
                            onChange={(e) =>
                                setEditLongitude(e.target.value)
                            }
                        />
                    </label>

                    <div className="mt-2 flex flex-row gap-2">
                        <button
                            className="rounded-md border border-black px-4 py-2 hover:bg-orange-100"
                            onClick={closeEditPinModal}
                        >
                            Cancel
                        </button>

                        <button
                            className="rounded-md border border-black bg-orange-400 px-4 py-2 hover:bg-orange-500"
                            onClick={saveEditPin}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
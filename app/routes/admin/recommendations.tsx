import { useEffect, useState } from "react";
import { getAllVetRecommendations, getVetRecommendationById, getUserById, getAllUsers, approveVetRecommendation, deleteVetRecommendation } from "../../../firebase.config";
import type { Route } from "./+types/recommendations";
import Modal from "~/components/modal";

export function loader() {
    return { name: "Recommendations" };
}

export default function Recommendations({ loaderData }: Route.ComponentProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [recommendations, setRecommendations] = useState<any[]>([]);
    const [currentRecommendation, setCurrentRecommendation] = useState<any>({});
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = (id: string) => {
        setCurrentRecommendation(getVetRecommendationById(recommendations, id));
        setModalOpen(true);
    }

    const closeModal = () => {
        setCurrentRecommendation(null);
        setModalOpen(false);
    }

    const approveRecommendation = (id: string) => {
        approveVetRecommendation(id);
        closeModal();
    }

    const deleteRecommendation = (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this recommendation? This cannot be undone.");
        if (!confirmed) return;

        deleteVetRecommendation(id);
        closeModal();
    }

    const getVetName = (id: string) => {
        const vet: any = getUserById(users, id);
        return vet?.firstName + " " + vet?.lastName;
    }

    useEffect(() => {
        return getAllUsers(setUsers);
    }, []);

    useEffect(() => {
        return getAllVetRecommendations(setRecommendations);
    }, []);

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl">Pending Recommendations</h1>
            {
                recommendations.filter((rec: any) => rec?.status === "pending_approval").length <= 0 ?
                    <p>There are currently no pending recommendations.</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Submitted At</th>
                                <th>Vet</th>
                                <th>Breed</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.filter((rec: any) => rec?.status === "pending_approval").map((rec: any) => {
                                return (
                                    <tr key={rec?.id}>
                                        <td>{rec?.createdAt?.toDate()?.toString()}</td>
                                        <td>{getVetName(rec?.vetUid)}</td>
                                        <td>{rec?.breed}</td>
                                        <td>{rec?.status}</td>
                                        <td><button onClick={() => openModal(rec?.id)}>View Details</button></td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <h1 className="font-bold text-2xl">Approved Recommendations</h1>
            {
                recommendations.filter((rec: any) => rec?.status === "approved" || rec?.approved).length <= 0 ?
                    <p>No recommendations have been approved so far.</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Submitted At</th>
                                <th>Vet</th>
                                <th>Breed</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recommendations.filter((rec: any) => rec?.status === "approved" || rec?.approved).map((rec: any) => {
                                return (
                                    <tr key={rec?.id}>
                                        <td>{rec?.createdAt?.toDate()?.toString()}</td>
                                        <td>{getVetName(rec?.vetUid)}</td>
                                        <td>{rec?.breed}</td>
                                        <td>{rec?.status}</td>
                                        <td>
                                            <button onClick={() => openModal(rec?.id)}>View Details</button>
                                            <button onClick={() => deleteRecommendation(rec?.id)}>Delete</button>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
            }
            <Modal isOpen={isModalOpen}>
                <div className="flex flex-col justify-center max-w-md mx-auto p-4 gap-1">
                    <div className="flex flex-row gap-1">
                        <b>Vet: </b>
                        <p>{getVetName(currentRecommendation?.vetUid)}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Submitted At: </b>
                        {currentRecommendation?.createdAt?.toDate()?.toString()}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Breed: </b>
                        {currentRecommendation?.breed}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Disease Result: </b>
                        {currentRecommendation?.diseaseResult ?? "N/A"}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Care Recommendation: </b>
                        {currentRecommendation?.careRecommendation}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Diet Recommendation: </b>
                        {currentRecommendation?.dietRecommendation}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Treatment Recommendation: </b>
                        {currentRecommendation?.treatmentRecommendation}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Status: </b>
                        {currentRecommendation?.status}
                    </div>
                    {
                        currentRecommendation?.approved &&
                        <div className="flex flex-row gap-1">
                            <b>Approved By: </b>
                            {getVetName(currentRecommendation?.approvedBy)}
                        </div>
                    }
                </div>
                <div className="flex flex-row gap-2 justify-center mt-2">
                    <button onClick={closeModal}>Close</button>
                    {
                        (currentRecommendation?.status === "pending_approval") &&
                        <button onClick={() => approveRecommendation(currentRecommendation?.id)}>Approve</button>
                    }
                    {
                        (currentRecommendation?.status === "approved" || currentRecommendation?.approved) &&
                        <button onClick={() => deleteRecommendation(currentRecommendation?.id)}>Delete</button>
                    }
                </div>
            </Modal>
        </div>
    );
}   
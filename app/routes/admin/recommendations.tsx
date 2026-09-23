import { useEffect, useState } from "react";
import {
    getAllVetRecommendations,
    getVetRecommendationById,
    getUserById,
    getAllUsers,
    approveVetRecommendation,
    deleteVetRecommendation
} from "../../../firebase.config";
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
        setCurrentRecommendation(
            getVetRecommendationById(recommendations, id)
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setCurrentRecommendation(null);
        setModalOpen(false);
    };

    const approveRecommendation = (id: string) => {
        approveVetRecommendation(id);
        closeModal();
    };

    const deleteRecommendation = (id: string) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this recommendation? This cannot be undone."
        );

        if (!confirmed) return;

        deleteVetRecommendation(id);
        closeModal();
    };

    const getVetName = (id: string) => {
        const vet: any = getUserById(users, id);
        return vet?.firstName + " " + vet?.lastName;
    };

    useEffect(() => {
        return getAllUsers(setUsers);
    }, []);

    useEffect(() => {
        return getAllVetRecommendations(setRecommendations);
    }, []);

    const pendingRecommendations = recommendations.filter(
        (rec: any) => rec?.status === "pending_approval"
    );

    const approvedRecommendations = recommendations.filter(
        (rec: any) => rec?.status === "approved" || rec?.approved
    );

    return (
        <div className="flex min-h-full flex-col items-center gap-6 bg-orange-50 p-6">
            <h1 className="text-2xl font-bold">
                Pending Recommendations
            </h1>

            {pendingRecommendations.length <= 0 ? (
                <p className="text-sm text-gray-600">
                    There are currently no pending recommendations.
                </p>
            ) : (
                <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-black">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-black bg-orange-100">
                                <th className="px-5 py-3 text-left font-bold">
                                    Submitted At
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    Vet
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    Breed
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
                            {pendingRecommendations.map((rec: any) => (
                                <tr
                                    key={rec?.id}
                                    className="border-b border-black last:border-b-0"
                                >
                                    <td className="px-5 py-4">
                                        {rec?.createdAt
                                            ?.toDate()
                                            ?.toString()}
                                    </td>

                                    <td className="px-5 py-4">
                                        {getVetName(rec?.vetUid)}
                                    </td>

                                    <td className="px-5 py-4">
                                        {rec?.breed}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="font-semibold text-orange-500">
                                            {rec?.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4 text-center">
                                        <button
                                            className="rounded-md border border-black bg-white px-3 py-2 hover:bg-orange-100"
                                            onClick={() =>
                                                openModal(rec?.id)
                                            }
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <h1 className="mt-2 text-2xl font-bold">
                Approved Recommendations
            </h1>

            {approvedRecommendations.length <= 0 ? (
                <p className="text-sm text-gray-600">
                    No recommendations have been approved so far.
                </p>
            ) : (
                <div className="w-full max-w-5xl overflow-hidden rounded-lg border border-black">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="border-b border-black bg-orange-100">
                                <th className="px-5 py-3 text-left font-bold">
                                    Submitted At
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    Vet
                                </th>
                                <th className="px-5 py-3 text-left font-bold">
                                    Breed
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
                            {approvedRecommendations.map((rec: any) => (
                                <tr
                                    key={rec?.id}
                                    className="border-b border-black last:border-b-0"
                                >
                                    <td className="px-5 py-4">
                                        {rec?.createdAt
                                            ?.toDate()
                                            ?.toString()}
                                    </td>

                                    <td className="px-5 py-4">
                                        {getVetName(rec?.vetUid)}
                                    </td>

                                    <td className="px-5 py-4">
                                        {rec?.breed}
                                    </td>

                                    <td className="px-5 py-4">
                                        <span className="font-semibold text-green-500">
                                            {rec?.status}
                                        </span>
                                    </td>

                                    <td className="px-5 py-4">
                                        <div className="flex justify-center gap-2">
                                            <button
                                                className="rounded-md border border-black bg-white px-3 py-2 hover:bg-orange-100"
                                                onClick={() =>
                                                    openModal(rec?.id)
                                                }
                                            >
                                                View Details
                                            </button>

                                            <button
                                                className="rounded-md border border-black bg-white px-3 py-2 hover:bg-red-50"
                                                onClick={() =>
                                                    deleteRecommendation(
                                                        rec?.id
                                                    )
                                                }
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
            )}

            <Modal isOpen={isModalOpen}>
                <div className="mx-auto flex max-w-md flex-col gap-3 p-4">
                    <div className="flex flex-row gap-2">
                        <b>Vet:</b>
                        <p>
                            {getVetName(
                                currentRecommendation?.vetUid
                            )}
                        </p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Submitted At:</b>
                        <p>
                            {currentRecommendation?.createdAt
                                ?.toDate()
                                ?.toString()}
                        </p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Breed:</b>
                        <p>{currentRecommendation?.breed}</p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Disease Result:</b>
                        <p>
                            {currentRecommendation?.diseaseResult ??
                                "N/A"}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <b>Care Recommendation:</b>
                        <p>
                            {currentRecommendation?.careRecommendation}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <b>Diet Recommendation:</b>
                        <p>
                            {currentRecommendation?.dietRecommendation}
                        </p>
                    </div>

                    <div className="flex flex-col gap-1">
                        <b>Treatment Recommendation:</b>
                        <p>
                            {
                                currentRecommendation?.treatmentRecommendation
                            }
                        </p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Status:</b>
                        <p
                            className={
                                currentRecommendation?.status ===
                                "approved"
                                    ? "font-semibold text-green-500"
                                    : "font-semibold text-orange-500"
                            }
                        >
                            {currentRecommendation?.status}
                        </p>
                    </div>

                    {currentRecommendation?.approved && (
                        <div className="flex flex-row gap-2">
                            <b>Approved By:</b>
                            <p>
                                {getVetName(
                                    currentRecommendation?.approvedBy
                                )}
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-2 flex flex-row justify-center gap-2">
                    <button
                        className="rounded-md border border-black px-4 py-2 hover:bg-orange-100"
                        onClick={closeModal}
                    >
                        Close
                    </button>

                    {currentRecommendation?.status ===
                        "pending_approval" && (
                        <button
                            className="rounded-md border border-black px-4 py-2 hover:bg-green-100"
                            onClick={() =>
                                approveRecommendation(
                                    currentRecommendation?.id
                                )
                            }
                        >
                            Approve
                        </button>
                    )}

                    {(currentRecommendation?.status === "approved" ||
                        currentRecommendation?.approved) && (
                        <button
                            className="rounded-md border border-black px-4 py-2 hover:bg-red-50"
                            onClick={() =>
                                deleteRecommendation(
                                    currentRecommendation?.id
                                )
                            }
                        >
                            Delete
                        </button>
                    )}
                </div>
            </Modal>
        </div>
    );
}
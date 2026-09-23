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
        <div className="flex min-h-full flex-col items-center bg-orange-50 p-4">
            <div className="w-full max-w-5xl">
                <h1 className="mb-3 text-center text-xl font-normal">
                    Pending Recommendations
                </h1>

                {pendingRecommendations.length <= 0 ? (
                    <p className="text-center text-sm text-gray-600">
                        There are currently no pending recommendations.
                    </p>
                ) : (
                    <div className="mx-auto w-[90%] overflow-hidden border border-black">
                        <table className="w-full table-fixed border-collapse text-[11px]">
                            <thead>
                                <tr>
                                    <th className="w-[20%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Submitted At
                                    </th>
                                    <th className="w-[20%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Vet
                                    </th>
                                    <th className="w-[20%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Breed
                                    </th>
                                    <th className="w-[15%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Status
                                    </th>
                                    <th className="w-[15%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {pendingRecommendations.map((rec: any) => (
                                    <tr key={rec?.id}>
                                        <td className="border border-black px-2 py-2 align-middle">
                                            {rec?.createdAt
                                                ?.toDate()
                                                ?.toString()}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            {getVetName(rec?.vetUid)}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            {rec?.breed}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            {rec?.status}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            <button
                                                className="rounded border border-black bg-white px-2 py-1 text-[10px] hover:bg-orange-100"
                                                onClick={() =>
                                                    openModal(rec?.id)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                <tr>
                                    <td className="h-8 border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                </tr>

                                <tr>
                                    <td className="h-8 border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                </tr>

                                <tr>
                                    <td className="h-8 border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                <h1 className="mb-1 mt-5 text-center text-xl font-normal">
                    Approved Recommendations
                </h1>

                {approvedRecommendations.length <= 0 ? (
                    <p className="text-center text-[10px] text-gray-600">
                        No recommendations have been approved so far.
                    </p>
                ) : (
                    <div className="mx-auto mt-3 w-[90%] overflow-hidden border border-black">
                        <table className="w-full table-fixed border-collapse text-[11px]">
                            <thead>
                                <tr>
                                    <th className="w-[20%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Submitted At
                                    </th>
                                    <th className="w-[20%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Vet
                                    </th>
                                    <th className="w-[20%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Breed
                                    </th>
                                    <th className="w-[15%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Status
                                    </th>
                                    <th className="w-[15%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {approvedRecommendations.map((rec: any) => (
                                    <tr key={rec?.id}>
                                        <td className="border border-black px-2 py-2">
                                            {rec?.createdAt
                                                ?.toDate()
                                                ?.toString()}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center">
                                            {getVetName(rec?.vetUid)}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center">
                                            {rec?.breed}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center">
                                            {rec?.status}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center">
                                            <div className="flex justify-center gap-1">
                                                <button
                                                    className="rounded border border-black bg-white px-2 py-1 text-[10px] hover:bg-orange-100"
                                                    onClick={() =>
                                                        openModal(rec?.id)
                                                    }
                                                >
                                                    View Details
                                                </button>

                                                <button
                                                    className="rounded border border-black bg-white px-2 py-1 text-[10px] hover:bg-red-50"
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

                                <tr>
                                    <td className="h-8 border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                </tr>

                                <tr>
                                    <td className="h-8 border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                </tr>

                                <tr>
                                    <td className="h-8 border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                    <td className="border border-black"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

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
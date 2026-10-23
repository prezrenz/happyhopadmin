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

const tableWrapperClass =
    "mx-auto mt-3 w-[90%] overflow-hidden rounded border-2 border-black";
const tableClass =
    "w-full table-fixed border-separate border-spacing-2 text-xs";
const thClass =
    "border border-black bg-orange-100 px-2 py-3 text-center font-normal";
const tdClass =
    "break-words border border-black px-2 py-3 text-center align-middle";
const actionButtonClass =
    "rounded-lg border-2 border-black bg-white px-3 py-1 text-xs hover:bg-orange-100";

const renderFillerRows = (columns: number) =>
    [0, 1, 2].map((row) => (
        <tr key={`filler-${row}`}>
            {Array.from({ length: columns }).map((_, col) => (
                <td
                    key={`filler-${row}-${col}`}
                    className="h-10 border border-black"
                ></td>
            ))}
        </tr>
    ));

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
                    <div className={tableWrapperClass}>
                        <table className={tableClass}>
                            <thead>
                                <tr>
                                    <th className={`${thClass} w-[25%]`}>
                                        Submitted At
                                    </th>
                                    <th className={`${thClass} w-[20%]`}>
                                        Vet
                                    </th>
                                    <th className={`${thClass} w-[20%]`}>
                                        Breed
                                    </th>
                                    <th className={`${thClass} w-[15%]`}>
                                        Status
                                    </th>
                                    <th className={`${thClass} w-[20%]`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {pendingRecommendations.map((rec: any) => (
                                    <tr key={rec?.id}>
                                        <td className={tdClass}>
                                            {rec?.createdAt
                                                ?.toDate()
                                                ?.toString()}
                                        </td>

                                        <td className={tdClass}>
                                            {getVetName(rec?.vetUid)}
                                        </td>

                                        <td className={tdClass}>
                                            {rec?.breed}
                                        </td>

                                        <td className={tdClass}>
                                            {rec?.status}
                                        </td>

                                        <td className={tdClass}>
                                            <button
                                                className={actionButtonClass}
                                                onClick={() =>
                                                    openModal(rec?.id)
                                                }
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}

                                {renderFillerRows(5)}
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
                    <div className={tableWrapperClass}>
                        <table className={tableClass}>
                            <thead>
                                <tr>
                                    <th className={`${thClass} w-[25%]`}>
                                        Submitted At
                                    </th>
                                    <th className={`${thClass} w-[20%]`}>
                                        Vet
                                    </th>
                                    <th className={`${thClass} w-[20%]`}>
                                        Breed
                                    </th>
                                    <th className={`${thClass} w-[15%]`}>
                                        Status
                                    </th>
                                    <th className={`${thClass} w-[20%]`}>
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {approvedRecommendations.map((rec: any) => (
                                    <tr key={rec?.id}>
                                        <td className={tdClass}>
                                            {rec?.createdAt
                                                ?.toDate()
                                                ?.toString()}
                                        </td>

                                        <td className={tdClass}>
                                            {getVetName(rec?.vetUid)}
                                        </td>

                                        <td className={tdClass}>
                                            {rec?.breed}
                                        </td>

                                        <td className={tdClass}>
                                            {rec?.status}
                                        </td>

                                        <td className={tdClass}>
                                            <div className="flex justify-center gap-1">
                                                <button
                                                    className={actionButtonClass}
                                                    onClick={() =>
                                                        openModal(rec?.id)
                                                    }
                                                >
                                                    View Details
                                                </button>

                                                <button
                                                    className="rounded-lg border-2 border-black bg-white px-3 py-1 text-xs hover:bg-red-50"
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

                                {renderFillerRows(5)}
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
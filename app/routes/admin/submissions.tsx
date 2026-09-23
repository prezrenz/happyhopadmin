import { useEffect, useState } from "react";
import {
    getAllVetImageSubmissions,
    getVetImageSubmissionById,
    deleteVetImageSubmissionById,
    getUserById,
    getAllUsers
} from "../../../firebase.config";
import type { Route } from "./+types/submissions";
import Modal from "~/components/modal";

export function loader() {
    return { name: "Image Submissions" };
}

export default function Submissions({ loaderData }: Route.ComponentProps) {
    const [users, setUsers] = useState<any[]>([]);
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [currentSubmission, setCurrentSubmission] = useState<any>({});
    const [isModalOpen, setModalOpen] = useState(false);
    const [breedFilter, setBreedFilter] = useState("All");
    const [diseaseFilter, setDiseaseFilter] = useState("All");

    const breeds = ["Holland", "California", "New Zealand", "Lionhead"];
    const diseases = [
        "Myxomatosis",
        "Mites",
        "Malocclusion",
        "Pasteurellosis"
    ];

    const openModal = (id: string) => {
        setCurrentSubmission(
            getVetImageSubmissionById(submissions, id)
        );
        setModalOpen(true);
    };

    const closeModal = () => {
        setCurrentSubmission(null);
        setModalOpen(false);
    };

    const deleteSubmission = (id: string) => {
        deleteVetImageSubmissionById(id);
        closeModal();
    };

    const getVetName = (uid: string) => {
        const vet: any = getUserById(users, uid);
        return vet?.firstName + " " + vet?.lastName;
    };

    useEffect(() => {
        return getAllUsers(setUsers);
    }, []);

    useEffect(() => {
        return getAllVetImageSubmissions(setSubmissions);
    }, []);

    const filteredSubmissions = submissions.filter((sub: any) => {
        const breedMatch =
            breedFilter === "All" || sub?.breed === breedFilter;

        const diseaseMatch =
            diseaseFilter === "All" || sub?.disease === diseaseFilter;

        return breedMatch && diseaseMatch;
    });

    return (
        <div className="flex min-h-full flex-col items-center bg-orange-50 p-4">
            <div className="w-full max-w-5xl">
                <h1 className="mb-4 text-center text-xl font-normal">
                    Image Submissions
                </h1>

                <div className="mb-3 flex flex-row justify-center gap-8 text-[11px]">
                    <label className="flex flex-row items-center gap-1">
                        <span>Breed:</span>
                        <select
                            className="bg-transparent text-[11px] outline-none"
                            value={breedFilter}
                            onChange={(e) =>
                                setBreedFilter(e.target.value)
                            }
                        >
                            <option value="All">ALL</option>
                            {breeds.map((breed) => (
                                <option key={breed} value={breed}>
                                    {breed}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex flex-row items-center gap-1">
                        <span>Disease:</span>
                        <select
                            className="bg-transparent text-[11px] outline-none"
                            value={diseaseFilter}
                            onChange={(e) =>
                                setDiseaseFilter(e.target.value)
                            }
                        >
                            <option value="All">ALL</option>
                            {diseases.map((disease) => (
                                <option key={disease} value={disease}>
                                    {disease}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {filteredSubmissions.length <= 0 ? (
                    <p className="text-center text-sm text-gray-600">
                        There are currently no image submissions matching
                        these filters.
                    </p>
                ) : (
                    <div className="mx-auto w-[90%] overflow-hidden border border-black">
                        <table className="w-full table-fixed border-collapse text-[10px]">
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
                                        Disease
                                    </th>

                                    <th className="w-[15%] border border-black bg-orange-100 px-2 py-2 font-normal">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredSubmissions.map((sub: any) => (
                                    <tr key={sub?.id}>
                                        <td className="border border-black px-2 py-2 align-middle">
                                            {sub?.createdAt
                                                ?.toDate()
                                                ?.toString()}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            {getVetName(sub?.vetUid)}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            {sub?.breed}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            {sub?.disease || "Not specified"}
                                        </td>

                                        <td className="border border-black px-2 py-2 text-center align-middle">
                                            <button
                                                className="rounded border border-black bg-white px-2 py-1 text-[9px] hover:bg-orange-100"
                                                onClick={() =>
                                                    openModal(sub?.id)
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
            </div>

            <Modal isOpen={isModalOpen}>
                <div className="mx-auto flex max-w-md flex-col gap-3 p-4">
                    <div className="flex flex-row gap-2">
                        <b>Vet:</b>
                        <p>
                            {getVetName(
                                currentSubmission?.vetUid
                            )}
                        </p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Vet Email:</b>
                        <p>{currentSubmission?.vetEmail}</p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Submitted At:</b>
                        <p>
                            {currentSubmission?.createdAt
                                ?.toDate()
                                ?.toString()}
                        </p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Breed:</b>
                        <p>{currentSubmission?.breed}</p>
                    </div>

                    <div className="flex flex-row gap-2">
                        <b>Disease:</b>
                        <p>
                            {currentSubmission?.disease ||
                                "Not specified"}
                        </p>
                    </div>

                    <img
                        src={currentSubmission?.imageUrl}
                        className="max-h-48 w-full rounded object-cover"
                    />
                </div>

                <div className="mt-2 flex flex-row justify-center gap-2">
                    <button
                        className="rounded-md border border-black px-4 py-2 hover:bg-orange-100"
                        onClick={closeModal}
                    >
                        Close
                    </button>

                    <button
                        className="rounded-md border border-black px-4 py-2 hover:bg-red-50"
                        onClick={() =>
                            deleteSubmission(
                                currentSubmission?.id
                            )
                        }
                    >
                        Delete
                    </button>
                </div>
            </Modal>
        </div>
    );
}
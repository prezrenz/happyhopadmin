import { useEffect, useState } from "react";
import { getAllVetImageSubmissions, getVetImageSubmissionById, deleteVetImageSubmissionById, getUserById, getAllUsers } from "../../../firebase.config";
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
    const diseases = ["Myxomatosis", "Mites", "Malocclusion", "Pasteurellosis"];

    const openModal = (id: string) => {
        setCurrentSubmission(getVetImageSubmissionById(submissions, id));
        setModalOpen(true);
    }

    const closeModal = () => {
        setCurrentSubmission(null);
        setModalOpen(false);
    }

    const deleteSubmission = (id: string) => {
        deleteVetImageSubmissionById(id);
        closeModal();
    }

    const getVetName = (uid: string) => {
        const vet: any = getUserById(users, uid);
        return vet?.firstName + " " + vet?.lastName;
    }

    useEffect(() => {
        return getAllUsers(setUsers);
    }, []);

    useEffect(() => {
        return getAllVetImageSubmissions(setSubmissions);
    }, []);

    const filteredSubmissions = submissions.filter((sub: any) => {
        const breedMatch = breedFilter === "All" || sub?.breed === breedFilter;
        const diseaseMatch = diseaseFilter === "All" || sub?.disease === diseaseFilter;
        return breedMatch && diseaseMatch;
    });

    return (
        <div className="flex flex-col items-center">
            <h1 className="font-bold text-2xl">Image Submissions</h1>

            <div className="flex flex-row gap-4 my-2">
                <label className="flex flex-row gap-1 items-center">
                    <b>Breed:</b>
                    <select value={breedFilter} onChange={(e) => setBreedFilter(e.target.value)}>
                        <option value="All">All</option>
                        {breeds.map((breed) => (
                            <option key={breed} value={breed}>{breed}</option>
                        ))}
                    </select>
                </label>
                <label className="flex flex-row gap-1 items-center">
                    <b>Disease:</b>
                    <select value={diseaseFilter} onChange={(e) => setDiseaseFilter(e.target.value)}>
                        <option value="All">All</option>
                        {diseases.map((disease) => (
                            <option key={disease} value={disease}>{disease}</option>
                        ))}
                    </select>
                </label>
            </div>

            {
                filteredSubmissions.length <= 0 ?
                    <p>There are currently no image submissions matching these filters.</p> :
                    <table>
                        <thead>
                            <tr>
                                <th>Submitted At</th>
                                <th>Vet</th>
                                <th>Breed</th>
                                <th>Disease</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubmissions.map((sub: any) => {
                                return (
                                    <tr key={sub?.id}>
                                        <td>{sub?.createdAt?.toDate()?.toString()}</td>
                                        <td>{getVetName(sub?.vetUid)}</td>
                                        <td>{sub?.breed}</td>
                                        <td>{sub?.disease}</td>
                                        <td><button onClick={() => openModal(sub?.id)}>View Details</button></td>
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
                        <p>{getVetName(currentSubmission?.vetUid)}</p>
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Vet Email: </b>
                        {currentSubmission?.vetEmail}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Submitted At: </b>
                        {currentSubmission?.createdAt?.toDate()?.toString()}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Breed: </b>
                        {currentSubmission?.breed}
                    </div>
                    <div className="flex flex-row gap-1">
                        <b>Disease: </b>
                        {currentSubmission?.disease}
                    </div>
                    <img
                        src={currentSubmission?.imageUrl}
                        className="w-full max-h-48 object-cover rounded"
                    />
                </div>
                <div className="flex flex-row gap-2 justify-center mt-2">
                    <button onClick={closeModal}>Close</button>
                    <button onClick={() => deleteSubmission(currentSubmission?.id)}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
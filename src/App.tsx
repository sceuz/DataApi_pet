import React, { useState, useEffect } from 'react';
import './App.css';

interface Pet {
    id: number;
    name: string;
    status: string;
}

const App: React.FC = () => {
    const [petId, setPetId] = useState<number>(0);
    const [petName, setPetName] = useState<string>('');
    const [petStatus, setPetStatus] = useState<string>('');
    const [responseMessage, setResponseMessage] = useState<string>('');
    const [petsList, setPetsList] = useState<Pet[]>([]);
    const [showPetsList, setShowPetsList] = useState<boolean>(true);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await fetch('https://petstore.swagger.io/v2/pet/findByStatus?status=available');
                if (!response.ok) {
                    throw new Error('Failed to fetch pets');
                }
                const data: Pet[] = await response.json();
                const uniquePets = data.filter((pet: Pet, index: number, self: Pet[]) => (
                    self.findIndex((p) => p.id === pet.id) === index
                ));
                setPetsList(uniquePets);
            } catch (error: any) {
                console.error('Error:', error.message);
            }
        };

        fetchPets();
    }, []);

    const togglePetsList = () => {
        setShowPetsList(!showPetsList);
    };

    const handleGetPet = () => {
        const pet = petsList.find((pet: Pet) => pet.id === petId);
        if (pet) {
            setResponseMessage(JSON.stringify(pet));
        } else {
            setResponseMessage('Pet not found');
        }
    };

    const handleAddPet = () => {
        const newPet: Pet = { id: petId, name: petName, status: petStatus };
        setPetsList([...petsList, newPet]);
        setResponseMessage('Pet added successfully');
    };

    const handleUpdatePet = () => {
        const updatedPetsList = petsList.map((pet: Pet) => {
            if (pet.id === petId) {
                return { ...pet, name: petName, status: petStatus };
            }
            return pet;
        });
        setPetsList(updatedPetsList);
        setResponseMessage('Pet updated successfully');
    };

    const handleDeletePet = () => {
        const updatedPetsList = petsList.filter((pet: Pet) => pet.id !== petId);
        setPetsList(updatedPetsList);
        setResponseMessage('Pet deleted successfully');
    };

    return (
        <div className="container">
            <h1>PET STORE API DATA</h1>
            <div className="button-container">
                <button onClick={togglePetsList}>{showPetsList ? 'Hide Pets List' : 'Show Pets List'}</button>
            </div>
            {showPetsList && (
                <div>
                    <h2>Pets List:</h2>
                    <ul>
                        {petsList.map((pet: Pet) => (
                            <li key={pet.id}>
                                <strong>ID:</strong> {pet.id}, <strong>Name:</strong> {pet.name}, <strong>Status:</strong> {pet.status}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            <div className="input-container">
                <label>Pet ID:</label>
                <input type="number" value={petId} onChange={(e) => setPetId(parseInt(e.target.value))} />
            </div>
            <div className="input-container">
                <label>Pet Name:</label>
                <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} />
            </div>
            <div className="input-container">
                <label>Pet Status:</label>
                <input type="text" value={petStatus} onChange={(e) => setPetStatus(e.target.value)} />
            </div>
            <div className="button-container">
                <button onClick={handleGetPet}>Get Pet</button>
                <button onClick={handleAddPet}>Add Pet</button>
                <button onClick={handleUpdatePet}>Update Pet</button>
                <button onClick={handleDeletePet}>Delete Pet</button>
            </div>
            <div className="response-container">
                <h2>Response:</h2>
                <p>{responseMessage}</p>
            </div>
        </div>
    );
};

export default App;

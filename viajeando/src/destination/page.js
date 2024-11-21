import { useRoute } from 'wouter';
import { useState, useEffect } from 'react';
import MainHeader from '../components/Header';
import { Button } from '@mui/material';

function DestinationPage() {
    const [match, params] = useRoute("/destinos/:id");
    const [destino, setDestino] = useState(null);
    const [loading, setLoading] = useState(true);

    const { id } = params; // Obtén el ID o nombre del destino

    useEffect(() => {
        // Obtener los detalles del destino usando el ID
        async function fetchDestinoData() {
            try {
                const response = await fetch(`http://localhost:8000/destinos/${id}`);
                const data = await response.json();
                setDestino(data);
            } catch (error) {
                console.error("Error al obtener los detalles del destino:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchDestinoData();
    }, [id]);

    if (!match) return <p>Destino no encontrado</p>;
    if (loading) return <p>Cargando...</p>;
    if (!destino) return <p>Error al cargar el destino</p>;

    return (
        <>
            <MainHeader />
            <div className="w-full h-[756px] overflow-hidden relative bg-transparent z-0">
                <img
                    src={`/images/${destino.NOMBRE}.png`}
                    alt={destino.NOMBRE}
                    className="w-full h-full object-cover object-center absolute z-[-1]"
                />
                <div className="h-full inset-0 flex justify-center items-center">
                    <div className="bg-white bg-opacity-[85%] p-6 rounded-lg text-center shadow-lg flex flex-col gap-5 pt-12">
                        <h2 className="text-xl font-light w-[264px] text-center text-[#2E9BC6]">{destino.NOMBRE}</h2>
                        <Button sx={{ color: '#2E9BC6', textTransform: 'none' }}>Continuar</Button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default DestinationPage;

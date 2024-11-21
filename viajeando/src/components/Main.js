import { useState, useEffect } from 'react';
import { Grid2, Container, Button, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Search, Menu, Favorite, FavoriteBorder } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'wouter';

function getEmailFromToken() {
  const token = localStorage.getItem('authToken');
  if (!token) {
    return null;
  }

  try {
    const decodedToken = jwtDecode(token);
    return decodedToken.email;
  } catch (error) {
    console.error("Error decoding token", error);
    return null;
  }
}

function Main() {
  const [searchQuery, setSearchQuery] = useState('');
  const [destinos, setDestinos] = useState([]);
  const [modal, setModal] = useState({ visible: false, message: '' });
  const [, setLocation] = useLocation();
  const [favoriteStates, setFavoriteStates] = useState({}); // Estado para manejar los favoritos individuales

  useEffect(() => {
    async function fetchDestinos() {
      try {
        const response = await fetch('http://localhost:8000/destinos');
        const data = await response.json();
        setDestinos(data);
      } catch (error) {
        console.error('Error al obtener destinos:', error);
      }
    }
    fetchDestinos();
  }, []);

  useEffect(() => {
    const syncFavorites = async () => {
      const favorites = JSON.parse(localStorage.getItem('favoritos')) || [];
      const email = getEmailFromToken();
      if (email && favorites.length > 0) {
        try {
          // Sincroniza los favoritos con el backend
          await fetch('http://localhost:8000/favoritos/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, favoritos: favorites }),
          });
          console.log('Favoritos sincronizados con el backend.');
        } catch (error) {
          console.error('Error al sincronizar favoritos:', error);
        }
      }

      // Actualiza el estado de los favoritos (si los tiene)
      const initialFavoriteStates = favorites.reduce((acc, id) => {
        acc[id] = true;
        return acc;
      }, {});
      setFavoriteStates(initialFavoriteStates); // Esto actualizará el estado de los favoritos
    };

    const email = getEmailFromToken();
    if (email) {
      syncFavorites();
    }
  }, []);
  
  useEffect(() => {
    const fetchUserFavorites = async () => {
      const email = getEmailFromToken();
      if (email) {
        try {
          const response = await fetch(`http://localhost:8000/favoritos/${email}`);
          const data = await response.json();
          if (data && Array.isArray(data)) {
            // Mapear los destinos favoritos a un estado que mantenga el estado de favoritos
            const updatedFavoriteStates = data.reduce((acc, destino) => {
              acc[destino.ID] = true;
              return acc;
            }, {});
            setFavoriteStates(updatedFavoriteStates); // Actualizar el estado de favoritos
          }
        } catch (error) {
          console.error('Error al obtener los favoritos del usuario:', error);
        }
      }
    };
  
    fetchUserFavorites();
  }, []);

  const handleDestinationClick = (destino) => {
    const email = getEmailFromToken();
    if (email) {
      setLocation(`/destinos/${destino.ID}`);
    } else {
      setModal({ visible: true, message: 'Para realizar esta acción debe iniciar sesión...' });
    }
  };

  const closeModal = () => {
    setModal({ visible: false, message: '' });
  };

  const toggleFavorite = (id_destino) => {
    const favorites = JSON.parse(localStorage.getItem('favoritos')) || [];
    if (favorites.includes(id_destino)) {
      // Eliminar favorito
      const updatedFavorites = favorites.filter(fav => fav !== id_destino);
      localStorage.setItem('favoritos', JSON.stringify(updatedFavorites));
      setFavoriteStates(prevState => ({ ...prevState, [id_destino]: false }));
    } else {
      // Agregar favorito
      favorites.push(id_destino);
      localStorage.setItem('favoritos', JSON.stringify(favorites));
      setFavoriteStates(prevState => ({ ...prevState, [id_destino]: true }));
    }
  };


  const filteredDestinos = destinos.filter((destino) =>
    destino.NOMBRE.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem('favoritos')) || [];
    const initialFavoriteStates = storedFavorites.reduce((acc, id) => {
      acc[id] = true;
      return acc;
    }, {});
    setFavoriteStates(initialFavoriteStates);
  }, []);

  useEffect(() => {
    const email = getEmailFromToken();
    if (email) {
      const syncFavorites = async () => {
        const favorites = JSON.parse(localStorage.getItem('favoritos')) || [];
        if (favorites.length > 0) {
          try {
            await fetch('http://localhost:8000/favoritos/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, favoritos: favorites }),
            });
            console.log('Favoritos sincronizados con el backend.');
          } catch (error) {
            console.error('Error al sincronizar favoritos:', error);
          }
        }
      };
      syncFavorites();
    }
  }, []);


  return (
    <Container maxWidth={false} sx={{ maxWidth: 1044, marginX: 'auto', paddingTop: '2rem' }}>
      <OutlinedInput
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Destino..."
        startAdornment={
          <InputAdornment position="start">
            <IconButton>
              <Menu />
            </IconButton>
          </InputAdornment>
        }
        endAdornment={
          <InputAdornment position="end">
            <IconButton>
              <Search />
            </IconButton>
          </InputAdornment>
        }
        sx={{
          backgroundColor: '#e0e0e0',
          borderRadius: '30px',
          padding: '0px 15px',
          maxWidth: '506px',
          width: "100%",
          marginBottom: '64px',
        }}
      />
      <div className='flex gap-[15px] items-center mb-[48px] text-[#3BC4FA]'>
        <h2 className='text-[32px]'>Sugerencias</h2>
      </div>
      <Grid2 container justifyContent="center" gap="48px">
        {filteredDestinos.map((destino) => (
          <Grid2 key={destino.ID}>
            <button
              className="w-[300px] rounded-t-lg rounded-b-lg overflow-hidden bg-white relative"
              onClick={() => handleDestinationClick(destino)}
            >
              <div className="w-[300px] h-[200px] overflow-hidden">
                <img
                  src={`/images/${destino.NOMBRE}.png`}
                  alt={destino.NOMBRE}
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <span className="block border-solid border-2 rounded-b-lg h-[45px]">
                {destino.NOMBRE}
              </span>
              <IconButton
                onClick={(event) => {
                  event.stopPropagation(); // Detiene la propagación del clic al contenedor padre
                  toggleFavorite(destino.ID);
                }}
                color={favoriteStates[destino.ID] ? "error" : "default"}
                aria-label="favorito"
                sx={{
                  position: "absolute",
                  top: 5,
                  right: 5,
                  backgroundColor: favoriteStates[destino.ID] ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.7)",
                  boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.3)",
                  "&:hover": {
                    backgroundColor: "#FFF",
                  },
                }}
              >
                {favoriteStates[destino.ID] ? <Favorite sx={{ color: "#FFF000" }} /> : <FavoriteBorder />}
              </IconButton>

            </button>
          </Grid2>
        ))}
      </Grid2>

      {modal.visible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg text-center shadow-lg relative flex flex-col gap-5 pt-12">
            <button
              className="absolute top-2 right-4 text-gray-600 hover:text-gray-800 text-xl"
              onClick={closeModal}
              aria-label="Cerrar"
            >
              &times;
            </button>
            <h2 className="text-xl font-light w-[264px] text-start">{modal.message}</h2>
            <div>
              <Button sx={{ color: '#2E9BC6', textTransform: 'none', marginLeft: '37px' }}>Registrarse</Button>
              <Button href="/login" sx={{ color: '#2E9BC6', textTransform: 'none' }}>Iniciar sesión</Button>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
}

export default Main;

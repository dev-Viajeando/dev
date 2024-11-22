import { useState, useEffect } from 'react';
import { Grid2, Container, Button, OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { Search, Menu, Favorite, FavoriteBorder } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import { useLocation } from 'wouter';

function getIdFromToken() {
  const token = localStorage.getItem('authToken');
  if (!token) return null;

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      localStorage.removeItem('authToken'); // Eliminar token caducado
      return null;
    }
    return decodedToken.id;
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
  const [favoriteStates, setFavoriteStates] = useState({});
  const [allFavorites, setAllFavorites] = useState([]); // Estado para manejar los favoritos individuales

  // Cargar destinos al inicializar
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
    const fetchFavorites = async () => {
      const id = getIdFromToken();
      if (!id) return;

      try {
        // Obtener los favoritos desde el backend
        const response = await fetch(`http://localhost:8000/favoritos/${id}`);
        const backendFavorites = await response.json();

        // Almacenar los favoritos tanto en localStorage como en state
        const favoritosIds = backendFavorites.map((fav) => {
          if (fav.ID_DESTINO !== undefined) {  // Verifica que ID_DESTINO existe
            console.log(fav.ID_DESTINO);  // Imprime el ID_DESTINO
            return fav.ID_DESTINO;        // Retorna el valor si existe
          }
          return null;  // Retorna null si no existe ID_DESTINO
        }).filter(id => id !== null);  // Filtra los valores nulos

        setAllFavorites(backendFavorites);
        
        // Guardar en localStorage
        localStorage.setItem('favoritos', JSON.stringify(favoritosIds));

        // Crear el estado inicial de los favoritos para usar en la UI (mapeando los IDs de los favoritos a 'true')
        const initialFavoriteStates = backendFavorites.reduce((acc, { ID_DESTINO }) => {
          if (ID_DESTINO !== undefined) {
            acc[ID_DESTINO] = true;
          }
          return acc;
        }, {});
        setFavoriteStates(initialFavoriteStates);
      } catch (error) {
        console.error('Error al obtener favoritos:', error);
      }
    };

    fetchFavorites();
  }, []);


  // Sincronizar favoritos con el backend cuando el usuario se va a otra página o cierra sesión
  useEffect(() => {
    const syncFavorites = async () => {
      const id = getIdFromToken();
      if (!id) return;
    
      try {
        const backendFavorites = allFavorites;
    
        // Obtener todos los destinos favoritos desde favoriteStates (claves del objeto)
        const localFavorites = Object.keys(favoriteStates).filter(
          (key) => favoriteStates[key]
        );
    
        // Obtener los IDs de los favoritos del backend
        const backendIds = new Set(backendFavorites.map((fav) => fav.ID_DESTINO));
        const favoritesToSync = localFavorites.filter((fav) => !backendIds.has(Number(fav)));
    
        if (favoritesToSync.length > 0 || localFavorites.length !== backendIds.size) {
          // Validar que no haya favoritos nulos o vacíos
          const validFavorites = localFavorites.filter((fav) => fav != null && fav !== "");
    
          if (validFavorites.length > 0) {
            // Cambié aquí para usar PATCH en lugar de POST
            await fetch('http://localhost:8000/favoritos/sync', {
              method: 'PATCH',  // Cambié de POST a PATCH
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                id_usuario: id,  // Asegúrate de enviar id_usuario y no id
                favoritos: validFavorites,  // Aquí va la lista de favoritos
              }),
            });
            console.log('Favoritos sincronizados con el backend.');
          } else {
            console.log('No hay favoritos válidos para sincronizar.');
          }
        } else {
          console.log('No hay cambios en los favoritos, no se sincroniza.');
        }
      } catch (error) {
        console.error('Error al sincronizar favoritos:', error);
      }
    };
    
  
    // Aquí podrías usar algún hook que te indique cuando el usuario cambió de página o cerró sesión
    // Para este ejemplo, solo simulo la sincronización cuando el componente se desmonta
    return () => {
      syncFavorites();
    };
  }, [favoriteStates, allFavorites]); // Dependemos de favoriteStates y allFavorites


  // Obtener favoritos del usuario y actualizar el estado de favoritos
  useEffect(() => {
    const fetchUserFavorites = async () => {
      const id = getIdFromToken();
      if (id) {
        try {
          const response = await fetch(`http://localhost:8000/favoritos/${id}`);
          const data = await response.json();
          if (data && Array.isArray(data)) {
            const updatedFavoriteStates = data.reduce((acc, destino) => {
              acc[destino.ID] = true;
              return acc;
            }, {});
            setFavoriteStates(updatedFavoriteStates);
          }
        } catch (error) {
          console.error('Error al obtener los favoritos del usuario:', error);
        }
      }
    };

    fetchUserFavorites();
  }, []);

  const handleDestinationClick = (destino) => {
    const id = getIdFromToken();
    if (id) {
      setLocation(`/destinos/${destino.ID}`);
    } else {
      setModal({ visible: true, message: 'Para realizar esta acción debe iniciar sesión...' });
    }
  };

  const closeModal = () => {
    setModal({ visible: false, message: '' });
  };

  const toggleFavorite = (id_destino) => {
    setFavoriteStates((prevState) => {
      // Si el destino ya es un favorito, lo eliminamos
      if (prevState[id_destino]) {
        const newState = { ...prevState };
        delete newState[id_destino]; // Eliminar el destino de favoritos
        return newState;
      } else {
        // Si el destino no es un favorito, lo agregamos
        return { ...prevState, [id_destino]: true };
      }
    });
  };

  const filteredDestinos = destinos.filter((destino) =>
    destino.NOMBRE.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                {favoriteStates[destino.ID] ? <Favorite sx={{ color: "#FA713B" }} /> : <FavoriteBorder />}
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

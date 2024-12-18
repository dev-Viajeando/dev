import { useState, useEffect } from 'react';
import {
    Menu,
    MenuItem,
    Typography,
    Tooltip,
} from '@mui/material';
import { Favorite, AccountCircle } from '@mui/icons-material';
import { Link, useLocation } from "wouter";
import { jwtDecode } from 'jwt-decode';

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

function MainHeader() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [, setLocation] = useLocation();
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsLoggedIn(!!token);
    }, []);

    const handleLogout = async () => {
        const favorites = JSON.parse(localStorage.getItem('favoritos')) || [];
        const email = getEmailFromToken();
        if (email && favorites.length > 0) {
            try {
                await fetch('http://localhost:8000/api/favoritos/sync', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, favoritos: favorites }),
                });
                console.log('Favoritos sincronizados al cerrar sesión.');
            } catch (error) {
                console.error('Error al sincronizar favoritos:', error);
            }
        }

        localStorage.removeItem('favoritos');
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setLocation('/login');
    };

    const openMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    return (
        <header className="h-[95px] border-b-[1px] border-[#E7E0EC] bg-white py-2.5">
            <nav className="bg-white border-gray-200 px-4 lg:px-6">
                <div className="flex flex-wrap justify-between items-center mx-auto max-w-[1440px]">
                    <Link href="/" className="flex items-center">
                        <svg className="w-12 md:w-16 h-16" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M57.292 0.558552C56.6636 0.558552 57.9669 0.400004 57.3385 0.400004C57.3385 0.400004 57.4811 0.520448 57.1732 0.479621C56.4694 0.870882 58.2792 0.376192 57.6822 0.525892C57.6822 0.525892 57.5936 0.407492 57.2857 0.366665C56.5819 0.678313 57.8506 0.343527 57.2537 0.493227C57.3485 0.753842 61.4808 -0.731588 57.7608 0.486427C57.1324 0.486427 0.97637 15.9314 0.347988 15.9314C0.347988 15.9314 -0.431203 16.7622 0.342336 15.945C-0.200587 16.3921 4.04539 14.9434 0.539017 16.175C-0.0893656 16.175 1.21327 16.175 0.584892 16.175C0.584892 16.175 0.772149 16.2594 0.464242 16.2185C0.300862 17.1644 1.13158 15.9049 0.53462 16.0546C0.53462 16.0546 0.584263 16.0192 0.498175 15.9784C0.112977 16.1655 1.20636 15.9021 0.609395 16.0518C0.609395 16.0518 0.726275 15.9613 0.424652 15.9001C0.0790413 16.5874 1.17745 15.7416 0.536505 16.1226C0.536505 16.1226 0.276985 15.7865 0.314688 16.1199C0.917306 16.95 21.493 28.6253 21.6369 28.6001C21.6659 28.7668 21.1858 28.3021 21.559 28.6015C22.3696 28.9009 21.7073 27.6393 21.5754 28.6056C21.7909 34.9338 21.1053 48.1285 21.1412 50.2488C22.0774 51.1198 20.0245 50.3053 21.0488 50.3121C23.7823 46.3518 32.7204 38.3225 33.0653 37.8972C33.1659 38.0482 45.3628 49.5745 45.3389 49.7174C45.9673 49.7174 44.7237 49.7174 45.3521 49.7174C46.7031 44.9746 59.6208 1.74255 59.7043 0.987922C59.7043 0.647694 59.6478 1.36897 59.7043 1.04235C59.8426 0.800112 59.6516 0.858634 59.7785 1.08455C59.6654 0.581008 59.0873 0.661303 59.6842 0.600062C59.6842 0.600062 60.1241 0.928037 59.8156 0.864074C59.754 0.851146 59.8885 1.20771 59.5045 0.97227C60.3654 0.257792 59.9117 1.26078 59.5787 0.879727C59.6591 0.378231 59.3663 0.841623 59.6245 0.76201C59.6245 0.76201 59.8087 0.826654 59.8212 0.486427C59.8658 0.691244 59.6704 0.811679 59.7358 0.570798C59.6698 0.51296 59.6044 1.60849 59.6044 0.472134C58.7687 0.472134 57.9267 0.472134 57.0909 0.472134C56.4487 0.836859 57.7953 0.583049 57.6018 0.717099M55.5394 3.86692C54.9689 4.33984 56.3802 3.46886 55.5281 3.93361C55.3553 4.10713 55.4458 3.91864 55.6054 3.75261C55.4376 3.91184 55.4483 3.94041 55.4263 3.9513C55.3798 3.97376 22.3294 24.5977 21.9989 24.7957C21.5119 25.204 22.1208 24.878 21.9813 24.7004C21.3906 24.3126 7.15462 17.227 6.41313 17.3291C5.82245 16.9412 6.72293 16.9752 5.98144 17.0773C5.57927 15.696 5.22047 16.9167 6.04365 16.9575C6.72418 16.6125 40.3005 7.58289 55.4508 3.92204C55.6645 3.9234 55.4232 3.8785 55.4402 3.90844C55.3503 3.87918 55.5244 3.94586 55.5149 3.9792M44.456 45.9456C44.456 46.2858 44.5377 45.8408 44.456 46.1538C44.4705 46.179 44.7897 45.7789 44.6301 46.0626C44.4699 45.9803 31.3555 32.7216 31.3272 32.4535C31.5503 32.1249 32.0404 31.077 31.4988 32.0623C31.2613 32.495 31.113 32.8223 31.3247 32.623C32.1196 31.8745 55.4684 7.72511 55.821 7.29846C56.34 6.66972 51.6303 9.30444 55.8341 7.27669C53.0693 16.0478 44.2279 45.4944 44.2418 45.8905M47.8971 11.6187C47.4798 12.1229 48.2464 11.2934 47.7921 11.6996C47.4578 12.1222 49.6616 10.1761 47.789 11.6051C46.2746 12.3604 48.127 11.4445 47.7406 11.6969C47.3805 12.1542 26.867 33.4837 23.7866 36.5363C23.7866 35.8558 23.5648 37.1487 23.5648 36.4682C23.277 36.6029 25.548 35.1754 23.6761 36.5594C23.7075 36.226 23.7496 27.4549 23.7496 27.4549C30.9119 22.0303 47.2831 11.7167 47.6652 11.3594C47.9806 11.0648 48.9911 11.4526 47.8348 11.5547M23.803 39.7514C23.9595 39.3289 29.1637 35.0549 29.4182 34.4357C29.5715 35.1522 29.1656 34.8875 29.4421 34.4514C29.8939 34.45 29.87 36.26 29.1009 37.9958C28.0314 40.4087 23.8244 43.9464 23.7634 43.7212C23.6195 43.1898 23.7753 39.7827 23.803 39.7514Z" fill="#3BC4FA" fillOpacity="0.95" />
                            <path d="M24.4749 58.0495C24.4749 58.0495 24.7821 56.1111 24.4098 58.0235C24.5311 58.0853 24.3757 58.0655 25.7759 60C25.7759 60 25.5572 59.9436 25.7932 59.8118C26.5444 58.705 35.5532 49.719 36.2279 48.8256C36.7783 48.0977 35.1624 48.4796 35.4737 47.4742C34.6718 47.6556 25.905 56.807 24.4749 58.0495Z" fill="#3BC4FA" fillOpacity="0.9" />
                            <path d="M2.50894 56.1896C2.50894 56.1896 2.79937 54.4326 2.44739 56.1652C2.56213 56.2208 2.41452 56.2033 3.73999 57.9557C3.73999 57.9557 3.53323 57.9038 3.75613 57.7849C4.46727 56.7826 12.9908 48.6427 13.629 47.8339C14.1496 47.1738 12.6209 47.5199 12.9155 46.609C12.1566 46.7744 3.8619 55.063 2.50894 56.1896Z" fill="#3BC4FA" fillOpacity="0.9" />
                            <path d="M1.35506 39.5362C1.35506 39.5362 1.66104 37.7808 1.29053 39.5126C1.41124 39.5682 1.25646 39.5507 2.65066 41.3031C2.65066 41.3031 2.43313 41.252 2.66799 41.1331C3.41618 40.13 12.3861 31.9901 13.0578 31.1813C13.6058 30.522 11.9965 30.8673 12.3067 29.9564C11.5083 30.1211 2.77914 38.4112 1.35506 39.5362Z" fill="#3BC4FA" fillOpacity="0.9" />
                        </svg>
                    </Link>
                    <div className="flex items-center order-2">
                        {isLoggedIn ? (
                            <>
                                <div
                                    onClick={openMenu}
                                    style={{
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AccountCircle
                                        style={{
                                            fontSize: 50, // Tamaño del icono ajustado
                                            color: '#2E9BC6',
                                        }}
                                    />
                                </div>
                                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                                    <MenuItem onClick={() => setLocation('/favorites')}>
                                        <Favorite sx={{ color: '#FA713B', marginRight: 1 }} />
                                        Favoritos
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Tooltip title="Login" arrow>
                                <Link
                                    href="/login"
                                    style={{
                                        textDecoration: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <AccountCircle
                                        style={{
                                            fontSize: 50,
                                            color: '#2E9BC6',
                                        }}
                                    />
                                </Link>
                            </Tooltip>
                        )}
                    </div>
                    <div className="justify-between items-center flex w-auto order-1">
                        <Typography variant="subtitle1" fontFamily={"Inter"} color="#3BC4FA" fontSize={{ xs: "25px", sm: "32px" }} fontWeight={300}>
                            Viajeando
                        </Typography>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default MainHeader;

export const Navbar = () => {
    return (
        <>
            <nav class="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
                <div class="container-fluid">
  
                    <a class="navbar-brand d-flex align-items-center" href="#">
                    <img src="https://img.freepik.com/vector-premium/pictograma-tv-pantalla-television-icono-negro-redondo_53562-15456.jpg?w=740" height="30" width="30" alt="Logo" class="me-2"/>
                    <span class="text-white">noWatch</span>
                    </a>

                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse justify-content-center" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                        <a class="nav-link" href="#">Tv en vivo</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Categorias</a>
                        </li>
                        <li class="nav-item">
                        <a class="nav-link" href="#">Buscar</a>
                        </li>
                    </ul>
                    </div>

                    <div class="dropdown ms-auto">
                    <a href="#" class="d-flex align-items-center" id="dropdownMenuLink" data-bs-toggle="dropdown" aria-expanded="false">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/002/318/271/small_2x/user-profile-icon-free-vector.jpg" alt="User Image" width="30" height="30" class="rounded-circle"/>
                    </a>
                    <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="dropdownMenuLink">
                        <li><a class="dropdown-item" href="#">Registrarse</a></li>
                        <li><a class="dropdown-item" href="#">Acceso</a></li>
                    </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

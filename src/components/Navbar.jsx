export const Navbar = () => {
    return (
        <>
            <nav class="navbar navbar-expand-lg bg-dark border-bottom border-body" data-bs-theme="dark">
                <div class="container-fluid">
                    <a class="navbar-brand d-flex align-items-center" href="#">
                    <img src="https://img.icons8.com/?size=100&id=115361&format=png" height="35" width="35" alt="Logo" class="me-2"/>
                    NOWATH
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
                </div>
            </nav>
        </>
    )
}

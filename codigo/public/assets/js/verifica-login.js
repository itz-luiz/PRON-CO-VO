// Verifica o estado de login e atualiza a navbar
function updateNavbar() {
    const nav = document.querySelector('nav ul');
    const usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    
    // Remove itens existentes para evitar duplicação
    const existingProfileItem = document.querySelector('.profile-item');
    if (existingProfileItem) {
        existingProfileItem.remove();
    }
    
    const existingLoginItem = document.querySelector('nav ul li a[href="modulos/login/login.html"]');
    if (existingLoginItem && existingLoginItem.parentElement) {
        existingLoginItem.parentElement.remove();
    }

    // Verifica se o usuário está logado
    if (usuarioCorrenteJSON) {
        const usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
        
        // Cria o item de perfil com dropdown
        const profileItem = document.createElement('li');
        profileItem.className = 'profile-item';
        profileItem.innerHTML = `
            <a href="#" class="profile-btn">${usuarioCorrente.nome.split(' ')[0]}</a>
            <div class="profile-dropdown">
                <a href="perfil.html">Abrir Perfil</a>
                <a href="#" class="logout-link">Sair da Conta</a>
            </div>
        `;
        nav.appendChild(profileItem);

        // Adiciona eventos
        const profileBtn = profileItem.querySelector('.profile-btn');
        const dropdown = profileItem.querySelector('.profile-dropdown');
        const logoutLink = profileItem.querySelector('.logout-link');

        profileBtn.addEventListener('click', function(e) {
            e.preventDefault();
            dropdown.classList.toggle('show');
        });

        logoutLink.addEventListener('click', function(e) {
            e.preventDefault();
            logoutUser();
        });

        // Fecha o dropdown ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.profile-item')) {
                dropdown.classList.remove('show');
            }
        });
    } else {
        // Adiciona o botão de login
        const loginItem = document.createElement('li');
        loginItem.innerHTML = '<a href="modulos/login/login.html">Login</a>';
        nav.appendChild(loginItem);
    }
}

// Chama a função quando a página é carregada
document.addEventListener('DOMContentLoaded', function() {
    updateNavbar();
    
    // Atualiza quando o estado de login muda
    window.addEventListener('storage', function(e) {
        if (e.key === 'usuarioCorrente') {
            updateNavbar();
        }
    });
});

// Atualiza a navbar após login/logout
function logoutUser() {
    sessionStorage.removeItem('usuarioCorrente');
    updateNavbar();
    window.location.href = "/modulos/login/login.html";
}
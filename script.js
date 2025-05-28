// PRIMEIRO BLOCO DOMContentLoaded (Navbar, Footer, Toggles de Senha) - SEM ALTERAÇÕES AQUI
document.addEventListener("DOMContentLoaded", function() {
    // Função para carregar um componente HTML em um placeholder
    function loadHTMLComponent(componentPath, placeholderId, callback) {
        fetch(componentPath)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erro ao carregar " + componentPath + ": " + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (placeholder) {
                    placeholder.innerHTML = data;
                    if (callback) {
                        callback(); // Executa um callback após carregar, se necessário
                    }
                } else {
                    // Não é um erro se o placeholder não estiver na página atual
                    // console.warn("Placeholder não encontrado:", placeholderId);
                }
            })
            .catch(error => console.error("Erro ao carregar componente:", error));
    }

    // Carrega a navbar e depois define o link ativo
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    if (navbarPlaceholder) {
        loadHTMLComponent('navbar.html', 'navbar-placeholder', setActiveNavLink);
    }

    // Carrega o footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        loadHTMLComponent('footer.html', 'footer-placeholder');
    }

    // Para página de Login e Cadastro (toggles de senha)
    // A função setupPasswordToggle já verifica se os elementos existem
    setupPasswordToggle('password', 'togglePassword'); 
    setupPasswordToggle('passwordConfirm', 'togglePasswordConfirm');
});

// FUNÇÕES GLOBAIS (Definidas fora do DOMContentLoaded para estarem disponíveis)

function navigateTo(page) {
    window.location.href = page;
}

function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html'; // Default para index.html se vazio
    const navButtons = document.querySelectorAll('#navbar-placeholder .nav-buttons .ff-button');

    navButtons.forEach(button => {
        const buttonPage = button.getAttribute('data-page');
        if (buttonPage === currentPage) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

function handleLogin() {
    const emailInput = document.getElementById('emailAddress');
    const passwordInput = document.getElementById('password');

    // Verifica se os campos existem antes de tentar ler .value
    const email = emailInput ? emailInput.value : null;
    const password = passwordInput ? passwordInput.value : null;

    if (email && password) {
        console.log("Tentativa de Login com:", { email, password });
        alert("Login simulado com sucesso para: " + email);
        // navigateTo('home.html'); // Descomente para redirecionar após login
    } else {
        alert("Por favor, preencha email e senha.");
    }
}

function handleCadastro() {
    const emailInput = document.getElementById('emailAddress');
    const phoneInput = document.getElementById('phone');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('passwordConfirm');

    const email = emailInput ? emailInput.value : null;
    const phone = phoneInput ? phoneInput.value : null;
    const password = passwordInput ? passwordInput.value : null;
    const passwordConfirm = passwordConfirmInput ? passwordConfirmInput.value : null;

    if (!email || !password || !passwordConfirm) {
        alert("Por favor, preencha email, senha e confirmação de senha.");
        return;
    }
    if (password !== passwordConfirm) {
        alert("As senhas não coincidem!");
        return;
    }
    console.log("Tentativa de Cadastro com:", { email, phone, password });
    alert("Conta criada com sucesso para: " + email + " (Simulação)");
    // navigateTo('login.html'); // Descomente para redirecionar após cadastro
}

function setupPasswordToggle(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const toggleIcon = document.getElementById(toggleId);

    if (passwordInput && toggleIcon) { // Verifica se ambos os elementos existem
        toggleIcon.addEventListener('click', function () {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
}

function submitForm() {
    const messageInput = document.getElementById('shortBio');
    if (messageInput) {
        const message = messageInput.value;
        if (message.trim() === "") {
            alert("Por favor, escreva uma mensagem.");
            return;
        }
        console.log("Mensagem enviada (simulação):", message);
        alert("Mensagem enviada com sucesso! (Simulação)");
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.reset();
        }
    }
}


// SEGUNDO BLOCO DOMContentLoaded (Carrossel) - COM ATUALIZAÇÕES PARA LOOP INFINITO
document.addEventListener('DOMContentLoaded', function() {
    const track = document.getElementById('carrousselTrack');
    const prevButton = document.getElementById('prevBtn');
    const nextButton = document.getElementById('nextBtn');
    
    if (!track || !prevButton || !nextButton) {
        if (document.querySelector('.carroussel-projetos')) {
             console.warn("Carrossel: Elementos HTML essenciais (track, prevBtn ou nextBtn) não encontrados.");
        }
        return;
    }
    
    const cards = track.querySelectorAll('.projeto-card'); // Seleciona cards dentro do track específico

    if (cards.length === 0) {
        if (document.querySelector('.carroussel-projetos')) {
            console.warn("Carrossel: Nenhum card de projeto (.projeto-card) encontrado.");
            prevButton.style.display = 'none';
            nextButton.style.display = 'none';
        }
        return;
    }

    let currentIndex = 0;
    let cardWidth = calculateCardWidth();

    function calculateCardWidth() {
        if (cards.length > 0) {
            const cardStyle = getComputedStyle(cards[0]);
            return cards[0].offsetWidth + parseInt(cardStyle.marginLeft) + parseInt(cardStyle.marginRight);
        }
        return 0;
    }
    
    window.addEventListener('resize', () => {
        cardWidth = calculateCardWidth();
        // Se a largura do card for 0, pode ser que os cards não estejam visíveis/renderizados ainda
        if (cardWidth > 0) {
            updateCarrousselPosition(false); // Atualiza a posição sem animação no resize
        }
    });

    // Modificada para não desabilitar botões em loop infinito
    function updateCarrousselPosition(animate = true) {
        if (cardWidth === 0 && cards.length > 0) { // Tenta recalcular se for 0
            cardWidth = calculateCardWidth();
            if (cardWidth === 0) { // Ainda 0, não faz nada
                console.warn("Largura do card do carrossel é 0, não é possível atualizar a posição.");
                return;
            }
        }

        if (animate) {
            track.style.transition = 'transform 0.5s ease-in-out';
        } else {
            track.style.transition = 'none';
        }
        track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

        // Em um carrossel infinito, os botões não são desabilitados.
        // Se você tinha classes CSS para 'disabled', pode removê-las aqui.
        // Ex:
        // prevButton.classList.remove('disabled');
        // nextButton.classList.remove('disabled');
    }

    prevButton.addEventListener('click', () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = cards.length - 1; // Vai para o último card
        }
        updateCarrousselPosition();
    });

    nextButton.addEventListener('click', () => {
        currentIndex++;
        if (currentIndex >= cards.length) {
            currentIndex = 0; // Volta para o primeiro card
        }
        updateCarrousselPosition();
    });

    // Inicializa o carrossel
    if (cards.length > 0 && cardWidth > 0) {
         updateCarrousselPosition(false); // Posição inicial sem animação
    } else if (cards.length > 0 && cardWidth === 0) {
        // Tenta calcular a largura novamente após um pequeno delay se for 0 inicialmente
        // Isso pode ajudar se os elementos não estiverem totalmente renderizados quando o script rodar
        setTimeout(() => {
            cardWidth = calculateCardWidth();
            if (cardWidth > 0) updateCarrousselPosition(false);
        }, 100);
    }
});
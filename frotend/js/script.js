// PRIMEIRO BLOCO DOMContentLoaded (Navbar, Footer, Toggles de Senha)
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
        loadHTMLComponent('partials/navbar.html', 'navbar-placeholder', setActiveNavLink); // CAMINHO CORRIGIDO
    }

    // Carrega o footer
    const footerPlaceholder = document.getElementById("footer-placeholder");
    if (footerPlaceholder) {
        loadHTMLComponent('partials/footer.html', 'footer-placeholder'); // CAMINHO CORRIGIDO
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
    const messageInput = document.getElementById('shortBio'); // ATENÇÃO: ID pode precisar ser 'mensagem' para o Fale Conosco
    if (messageInput) {
        const message = messageInput.value;
        if (message.trim() === "") {
            alert("Por favor, escreva uma mensagem.");
            return;
        }
        console.log("Mensagem enviada (simulação):", message);
        alert("Mensagem enviada com sucesso! (Simulação)");
        const contactForm = document.getElementById('contactForm'); // Supondo que o form de contato tenha este ID
        if (contactForm) {
            contactForm.reset();
        }
    } else {
         // Se o 'shortBio' não existe, talvez seja o formulário de Fale Conosco
        const contactFormEmail = document.getElementById('email'); // ID do seu campo de email no Fale Conosco
        const contactFormTelefone = document.getElementById('telefone'); // ID do seu campo de telefone no Fale Conosco
        const contactFormMensagem = document.getElementById('mensagem'); // ID do seu campo de mensagem no Fale Conosco
        const form = document.getElementById('contactForm'); // ID do formulário Fale Conosco

        if (form && contactFormEmail && contactFormMensagem) { // Telefone é opcional aqui
            const emailVal = contactFormEmail.value;
            const telefoneVal = contactFormTelefone ? contactFormTelefone.value : '';
            const mensagemVal = contactFormMensagem.value;

            if (emailVal.trim() === "" || mensagemVal.trim() === "") {
                alert("Por favor, preencha seu e-mail e a mensagem.");
                return;
            }

            // A lógica de envio real para o backend Python iria aqui
            // Por enquanto, é uma simulação:
            console.log("Formulário de Contato (simulação):", { email: emailVal, telefone: telefoneVal, mensagem: mensagemVal });
            alert("Mensagem do Fale Conosco enviada com sucesso! (Simulação)");
            form.reset();
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

// ADICIONANDO O BLOCO PARA O FORMULÁRIO DE CONTATO (FALE CONOSCO)
// Este bloco precisa ser adicionado ou integrado ao seu script.js
// Ele deve estar DENTRO de um `DOMContentLoaded` ou ser chamado após o DOM carregar.
// Se você já tem um DOMContentLoaded, pode adicionar o conteúdo desta função lá dentro
// ou garantir que este bloco também esteja envolvido por um DOMContentLoaded.

document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm'); // ID do seu formulário em fale-conosco.html

    if (contactForm) {
        // Verifica se o botão de submit é o do formulário de contato específico
        // para não interferir com outros botões de submit na página.
        const formSubmitButton = contactForm.querySelector('button[type="submit"].ff-button');

        contactForm.addEventListener('submit', function (event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const originalButtonText = formSubmitButton ? formSubmitButton.textContent : 'Enviar';
            if (formSubmitButton) {
                formSubmitButton.textContent = 'Enviando...';
                formSubmitButton.disabled = true;
            }

            // Pega os dados do formulário
            const email = document.getElementById('email').value;
            const telefone = document.getElementById('telefone').value;
            const mensagem = document.getElementById('mensagem').value;

            const formData = {
                email: email,
                telefone: telefone,
                mensagem: mensagem
            };

            // Envia os dados para o backend Python
            fetch('http://127.0.0.1:5000/send_message', { // Certifique-se que a URL do seu backend está correta
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })
            .then(response => {
                // Se o backend não retornar JSON em caso de erro de servidor (500),
                // precisamos tratar isso para não quebrar o .json()
                if (!response.ok && response.headers.get("content-type")?.indexOf("application/json") === -1) {
                    return response.text().then(text => {
                        throw new Error(`Erro do servidor: ${response.status} ${response.statusText} - ${text}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                if (formSubmitButton) {
                    formSubmitButton.textContent = originalButtonText;
                    formSubmitButton.disabled = false;
                }

                if (data.status === 'success') {
                    alert(data.message || 'Mensagem enviada com sucesso!');
                    contactForm.reset(); // Limpa o formulário
                } else {
                    alert('Erro: ' + (data.message || 'Não foi possível enviar a mensagem.'));
                }
            })
            .catch((error) => {
                if (formSubmitButton) {
                    formSubmitButton.textContent = originalButtonText;
                    formSubmitButton.disabled = false;
                }
                console.error('Erro na requisição:', error);
                alert('Erro ao se conectar com o servidor ou processar a resposta. Detalhes: ' + error.message);
            });
        });
    }
});
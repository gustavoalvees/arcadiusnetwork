/**
 * Script for loginOffline.ejs
 */
// Validation Regexes.
const validOfflineUsername         = /^[a-zA-Z0-9_]{3,16}$/

// Login Elements
const loginOfflineCancelButton     = document.getElementById('loginOfflineCancelButton')
const loginOfflineUsername         = document.getElementById('loginOfflineUsername')
const loginOfflineButton           = document.getElementById('loginOfflineButton')
const loginOfflineForm             = document.getElementById('loginOfflineForm')

// Control variables.
let lu2 = false, lp2  = false

/**
 * Validate the offline username.
 *
 * @param {string} value The username value.
 */
function validateUsername(value){
    if(value){
        if(!validOfflineUsername.test(value)){
            loginOfflineDisabled(true)
            lu2 = false
        } else {
            lu2 = true
            loginOfflineDisabled(false)
        }
    } else {
        lu2 = false
        loginOfflineDisabled(true)
    }
}


// Emphasize errors with shake when focus is lost.
loginOfflineUsername.addEventListener('focusout', (e) => {
    validateUsername(e.target.value)
})

// Validate input for each field.
loginOfflineUsername.addEventListener('input', (e) => {
    validateUsername(e.target.value)
})

/**
 * Enable or disable the login button.
 *
 * @param {boolean} v True to enable, false to disable.
 */
function loginOfflineDisabled(v){
    if(loginOfflineButton.disabled !== v){
        loginOfflineButton.disabled = v
    }
}

/**
 * Enable or disable loading elements.
 *
 * @param {boolean} v True to enable, false to disable.
 */
function offlineLoginLoading(v){
    if(v){
        loginOfflineButton.setAttribute('loading', v)
        loginOfflineButton.innerHTML = loginOfflineButton.innerHTML.replace(Lang.queryJS('login.login'), Lang.queryJS('login.loggingIn'))
    } else {
        loginOfflineButton.removeAttribute('loading')
        loginOfflineButton.innerHTML = loginOfflineButton.innerHTML.replace(Lang.queryJS('login.loggingIn'), Lang.queryJS('login.login'))
    }
}

let loginOfflineViewOnSuccess = VIEWS.landing
let loginOfflineViewOnCancel = VIEWS.loginOptions

loginOfflineCancelButton.onclick = (e) => {
    switchView(getCurrentView(), loginOfflineViewOnCancel, 500, 500, () => {
        loginOfflineUsername.value = ''
        loginPassword.value = ''
    })
}

// Disable default form behavior.
loginOfflineForm.onsubmit = () => { return false }

loginOfflineButton.addEventListener('click', () => {
    // Desabilitar o botão para evitar múltiplos cliques
    loginOfflineButton.disabled = true;

    // Desabilitar o formulário
    formDisabled(true);

    // Chamar a função para adicionar a conta offline
    AuthManagerOffline.addOfflineAccount(loginOfflineUsername.value).then((value) => {
        updateSelectedAccount(value);

        // Atualizar o texto do botão após o sucesso
        loginOfflineButton.innerHTML = loginOfflineButton.innerHTML.replace(Lang.queryJS('login.loggingIn'), Lang.queryJS('login.success'));
        
        // Mostrar animação de sucesso
        $('.circle-loader').toggleClass('load-complete');
        $('.checkmark').toggle();

        setTimeout(() => {
            switchView(VIEWS.loginOffline, loginOfflineViewOnSuccess, 500, 500, () => {
                // Trabalhar com a view de sucesso
                if (loginOfflineViewOnSuccess === VIEWS.settings) {
                    prepareSettings();
                }
                loginOfflineViewOnSuccess = VIEWS.landing; // Resetar para garantir que esteja correto
                loginOfflineUsername.value = '';
                loginPassword.value = '';

                // Ocultar animações de sucesso
                $('.circle-loader').toggleClass('load-complete');
                $('.checkmark').toggle();

                offlineLoginLoading(false);

                // Restaurar o texto original do botão
                loginOfflineButton.innerHTML = loginOfflineButton.innerHTML.replace(Lang.queryJS('login.success'), Lang.queryJS('login.login'));
            });
        }, 1000);
    }).catch((error) => {
        // Caso aconteça algum erro, habilite novamente o botão e mostre um erro
        loginOfflineButton.disabled = false;
        console.error("Erro ao criar conta offline:", error);
        // Opcional: Exiba uma mensagem de erro para o usuário.
    });
});

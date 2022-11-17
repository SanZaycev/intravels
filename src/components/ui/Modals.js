import {FETCHING} from "./Fetching.js";
import {ALERT} from "./Alert.js";
import {isEmptyString} from "@/services/getters";


export const MODALS = {
    template: null,
    rows: {
        modal: null,
        close: null,
        success_btn: null,
        register: {
            username: null,
            fullname: null,
            email: null,
            password: null,
            password2: null,
            agree: null,
            submit: null,
            errors: {
                username: null,
                fullname: null,
                email: null,
                password: null,
                password2: null,
                agree: null,
            }
        },
    },
    state: {
        csrf: null,
        busy: false,
        activated: false,
        register: {
            username: "",
            fullname: "",
            email: "",
            password: "",
            password2: "",
            agree: false,
            submitted: false,
            errors: {
                username: null,
                fullname: null,
                email: null,
                password: null,
                agree: null,
            },
            isEmail(){
                const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(String(this.email).toLowerCase());
            },
            isPassword(){
                const letter = /[a-zA-Zа-яА-Я]/;
                const number = /[0-9]/;
                if (this.password && this.password.length < 8 || !letter.test(this.password) || !number.test(this.password)){ return false; }
                return true;
            },
            isPassword2(){
                return this.password === this.password2
            },
            validUsername(){
                if (this.submitted){
                    this.errors.username = this.username.length < 3 || this.username.length > 12 ? this.getErrorText('username') : null;
                }
            },
            validFullname(){
                if (this.submitted){
                    this.errors.fullname = this.fullname.length < 2 || this.fullname.length > 20 ? this.getErrorText('fullname') : null;
                }
            },
            validEmail() {
                if (this.submitted) {
                    this.errors.email = this.isEmail() ? null : this.getErrorText('email');
                }
            },
            validPassword() {
                if (this.submitted) {
                    this.errors.password = this.isPassword() ? null : this.getErrorText('password');
                }
            },
            validPassword2() {
                if (this.submitted) {
                    this.errors.password2 = this.isPassword2() ? null : this.getErrorText('password2');
                }
            },
            validAgree(){
                if (this.submitted){
                    this.errors.agree = this.agree ? null : this.getErrorText('agree');
                }
            },
            getErrorText: function(err){
                let text = "";
                switch (err){
                    case 'username':
                        text = "Укажите логин в формате от 3 до 12 символов";
                        break;
                    case 'fullname':
                        text = "Укажите имя в формате от 2 до 20 символов";
                        break;
                    case 'email':
                        text = this.email + " не валидный email";
                        break;
                    case 'password':
                        text = "Пароль должен содержать буквы и цифры, минимальная длина 8 символов";
                        break;
                    case 'password2':
                        text = "Пароли не совпадают";
                        break;
                    case 'agree':
                        text = "Это поле обязательно для заполнения";
                        break;
                    default:
                        text = "Это поле обязательно для заполнения";
                }
                return text;
            },
        },
        urls: {
            dirs: {
                media: "/media/",
                static: "/static/",
                assets: "/static/assets/",
            },
            auth: {
                login: "/api/v1/iauth/token-login/",
                logout: "/api/v1/iauth/token-logout/",
                register: "/api/v1/iauth/register/",
                user_activate: "/api/v1/iauth/activate/",
                resend_user_activation: "/api/v1/iauth/resend_activation/",
                reset_password: "/api/v1/iauth/reset_password/",
                reset_password_confirm: "/api/v1/iauth/reset_password_confirm/",
                reset_username: "/api/v1/iauth/reset_username/",
                reset_username_confirm: "/api/v1/iauth/reset_username_confirm/",
                set_password: "/api/v1/iauth/set_password/",
                set_username: "/api/v1/iauth/set_username/"
            },
        },
    },
    actions: {
        login: "LOGIN_MODAL_ACTION",
        register: "REGISTER_MODAL_ACTION",
        register_success: "REGISTER_SUCCESS_MODAL_ACTION",
        reset_success: "PASSWORD_RESET_SUCCESS_MODAL_ACTION",
    },
    initialize(props){
        if (typeof props === "object"){
            if (isEmptyString(props.csrf)){ this.state.csrf = props.csrf }
            if (typeof props.urls === "object"){
                for (const [k, v] of Object.entries(props.urls)){
                    this.state.urls[k] = { ...v};
                }
                this.state.activated = true;
            }
        }
    },
    createCloseBtn(){
        this.rows.close = document.createElement('button');
        this.rows.close.className = 'modal-close';
    },
    createSuccessBtn(text){
        this.rows.success_btn = document.createElement('button');
        this.rows.success_btn.className = 'modal-success-btn';
        this.rows.success_btn.innerText = text;
    },
    createModal(){
        this.rows.modal = document.createElement('div');
        this.rows.modal.className = 'modal';
        this.rows.modal.innerHTML = this.template;
        document.body.prepend(this.rows.modal);
    },
    dispatch: function(action, data={}){
        switch (action){
            case this.actions.login:
                this.template = `
                    <div class="modal-window fetching" data-fetch="modal">
                        <div class="modal-header"><h2 class="modal-title">Вход на Iworky</h2></div>
                        <div class="modal-content">
                            <div class="auth-form" id="af">
                                <div class="auth-head"><h2 class="auth-title">Добро пожаловать!</h2><p class="head-tip">Войдите на сайт, чтобы пользоваться всеми возможностями Iworky</p></div>
                                <div class="auth-row login-field">
                                    <div data-error="LOGIN" class="error">Неверный логин или пароль</div>
                                    <div class="icon-wrap"><span class="icon icon-user"></span></div>
                                    <input type="text" name="email" class="auth-input" placeholder="Email или @Адрес Вашей страницы" autocomplete="off" maxlength="120" id="email">
                                </div>
                                <div class="auth-row login-field">
                                    <div class="icon-wrap"><span class="icon icon-unlock"></span></div>
                                    <input type="password" name="password" class="auth-input" placeholder="Пароль" autocomplete="off" maxlength="255" id="password">
                                </div>
                                <div class="auth-row login-field">
                                    <button type="button" class="auth-btn">Вход</button>
                                </div>
                                <div class="auth-foot">
                                    <div class="not-register">Ещё не зарегистрированы?<a href="/register/" class="register-btn">Создайте аккаунт</a></div>
                                    <a href="/reset-password/" class="fogot-btn">Забыли пароль?</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-mask"></div>
                `;
                this.createModal()
                this.createCloseBtn();
                this.rows.modal.children[0].children[0].append(this.rows.close);
                this.fetching(this.rows.modal.children[0]);
                this.setupLoginForm();
                setTimeout(()=>this.hideModalListener(this.rows.modal, this.rows.close), 1000);
            break;
            case this.actions.register:
                this.template = `
                    <div class="modal-window fetching" data-fetch="modal">
                        <div class="modal-header"><h2 class="modal-title">Регистрация на Iworky</h2></div>
                        <div class="modal-content">
                            <div class="auth-form" id="af">
                                <div class="auth-head"><h2 class="auth-title">Добро пожаловать!</h2><p class="head-tip">Зарегистрируйтесь, чтобы пользоваться всеми возможностями Iworky</p></div>
                                <div class="auth-row login-field">
                                    <div class="icon-wrap"><span class="icon icon-user"></span></div>
                                    <input type="text" name="username" class="auth-input" placeholder="Логин" autocomplete="off" maxlength="50" id="username">
                                    <small class="error-text"></small>
                                </div>
                                <div class="auth-row login-field">
                                    <div class="icon-wrap"><span class="icon icon-user"></span></div>
                                    <input type="text" name="fullname" class="auth-input" placeholder="Имя" autocomplete="off" maxlength="50" id="fullname">
                                    <small class="error-text"></small>
                                </div>
                                <div class="auth-row login-field">
                                    <div class="icon-wrap"><span class="icon icon-mail"></span></div>
                                    <input type="text" name="email" class="auth-input" placeholder="Электронная почта" autocomplete="off" maxlength="120" id="email">
                                    <small class="error-text"></small>
                                </div>
                                <div class="auth-row login-field">
                                    <div class="icon-wrap"><span class="icon icon-unlock"></span></div>
                                    <input type="password" name="password" class="auth-input" placeholder="Пароль" autocomplete="off" maxlength="100" id="password">
                                    <small class="error-text"></small>
                                </div>
                                <div class="auth-row login-field">
                                    <div class="icon-wrap"><span class="icon icon-unlock"></span></div>
                                    <input type="password" name="password2" class="auth-input" placeholder="Повторите пароль" autocomplete="off" maxlength="100" id="password2">
                                    <small class="error-text"></small>
                                </div>
                                <div class="auth-row login-field">
                                    <div class="label pb__5">Правила регистрации</div>
                                    <div class="checkbox">
                                        <label class="pointer"><input type="checkbox" name="agree" id="agree"><span class="pl__5 unselect">С правилами согласен</span></label>
                                    </div>
                                    <small class="error-text"></small>
                                </div>
                                <div class="auth-row login-field">
                                    <button type="button" class="auth-btn">Зарегистрироваться</button>
                                </div>
                                <div class="auth-foot">
                                    <div class="not-register">Уже зарегистрированы?<a href="/login/" class="register-btn">Вход</a></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="modal-mask"></div>
                `;
                this.createModal()
                this.createCloseBtn();
                this.rows.modal.children[0].children[0].append(this.rows.close);
                this.fetching(this.rows.modal.children[0]);
                this.setupRegisterForm();
                setTimeout(()=>this.hideModalListener(this.rows.modal, this.rows.close), 1000);
            break;
            case this.actions.register_success:
                this.template = `
                    <div class="modal-window fetching" data-fetch="modal">
                        <div class="modal-header"><h2 class="modal-title">Регистрация</h2></div>
                        <div class="modal-content">
                            <div class="modal-text-row">Проверьте свой почтовый ящик. Мы отправили Вам письмо на <span class="bold">${data.email}</span>. Перейдите по указанной в нем ссылке, чтобы активировать Ваш аккаунт.</div>
                        </div>
                        <div class="modal-footer"></div>
                    </div>
                    <div class="modal-mask"></div>
                `;
                this.createModal()
                this.createCloseBtn();
                this.createSuccessBtn('Продолжить');
                this.rows.modal.children[0].children[0].append(this.rows.close);
                this.rows.modal.children[0].children[2].append(this.rows.success_btn);
                this.fetching(this.rows.modal.children[0]);
                setTimeout(()=>this.hideModalListener(this.rows.modal, this.rows.close, this.rows.success_btn), 1000);
            break;
            case this.actions.reset_success:
                this.template = `
                    <div class="modal-window fetching" data-fetch="modal">
                        <div class="modal-header"><h2 class="modal-title">Сброс пароля</h2></div>
                        <div class="modal-content">
                            <div class="modal-text-row">Проверьте свой почтовый ящик. Мы отправили Вам письмо на <span class="bold">${data.email}</span>. Перейдите по указанной в нем ссылке, чтобы изменить Ваш пароль.</div>
                        </div>
                        <div class="modal-footer"></div>
                    </div>
                    <div class="modal-mask"></div>
                `;
                this.createModal()
                this.createCloseBtn();
                this.createSuccessBtn('Продолжить');
                this.rows.modal.children[0].children[0].append(this.rows.close);
                this.rows.modal.children[0].children[2].append(this.rows.success_btn);
                this.fetching(this.rows.modal.children[0]);
                setTimeout(()=>this.hideModalListener(this.rows.modal, this.rows.close, this.rows.success_btn), 1000);
            break;
            default: break;
        }
    },
    fetching: function(modal){
        if (typeof FETCHING === "object"){
            FETCHING.classes.align = 'center';
            FETCHING.element = 'div';
            FETCHING.start(modal);
            setTimeout(function(){
                FETCHING.done(modal);
                FETCHING.classes.align = 'initial';
                FETCHING.element = 'div';
            },500);
        }
    },
    hideModalListener(modal, close_btn, success_btn=null){
        if (modal && close_btn){
            const modalRemove = function(event){
                const target = event.target;
                if (!modal.children[0].contains(target) || close_btn.contains(target) || success_btn && success_btn.contains(target)){
                    modal.remove();
                    modal = null;
                    document.removeEventListener('click', modalRemove, false);
                }
            }
            document.addEventListener('click', modalRemove, false);
        }
    },
    setupLoginForm: function(){
        const form = this.rows.modal.children[0].children[1].children[0];
        const email = form.children[1].lastElementChild;
        const password = form.children[2].lastElementChild;
        const submit = form.children[3].children[0];
        setTimeout(() => password.value = "", 100);
        submit.addEventListener('click', function(){ MODALS.authenticate(email, password); });
        form.addEventListener('keydown', function(event){
            if (event.keyCode === 13 || event.key === "Enter"){ MODALS.authenticate(email, password); }
        });
    },
    setupRegisterForm: function(){
        const register = this.state.register;
        const rows = this.rows.register;
        const form = this.rows.modal.children[0].children[1].children[0];
        rows.username = form.children[1].children[1];
        rows.fullname = form.children[2].children[1];
        rows.email = form.children[3].children[1];
        rows.password = form.children[4].children[1];
        rows.password2 = form.children[5].children[1];
        rows.agree = form.children[6].children[1].children[0].children[0];
        rows.submit = form.children[7].children[0];
        rows.errors.username = form.children[1].lastElementChild;
        rows.errors.fullname = form.children[2].lastElementChild;
        rows.errors.email = form.children[3].lastElementChild;
        rows.errors.password = form.children[4].lastElementChild;
        rows.errors.password2 = form.children[5].lastElementChild;
        rows.errors.agree = form.children[6].lastElementChild;
        setTimeout(() => password.value = "", 50);
        setTimeout(() => password2.value = "", 50);
        rows.username.value = register.username;
        rows.fullname.value = register.fullname;
        rows.email.value = register.email;
        rows.username.addEventListener('input', function(e){
            register.username = e.target.value;
            if (register.username.length < 3 || register.username.length > 12){
                register.errors.username = register.getErrorText('username');
            } else { register.errors.username = null; }
            if (register.submitted){
                rows.errors.username.innerText = register.errors.username ? register.errors.username : "";
            }
        });
        rows.fullname.addEventListener('input', function(e){
            register.fullname = e.target.value;
            if (register.fullname.length < 2 || register.fullname.length > 20){
                register.errors.fullname = register.getErrorText('fullname');
            } else { register.errors.fullname = null; }
            if (register.submitted){
                rows.errors.fullname.innerText = register.errors.fullname ? register.errors.fullname : "";
            }
        });
        rows.email.addEventListener('input', function(e){
            register.email = e.target.value;
            if (!register.isEmail()){
                register.errors.email = register.getErrorText('email');
            } else { register.errors.email = null; }
            if (register.submitted){
                rows.errors.email.innerText = register.errors.email ? register.errors.email : "";
            }
        });
        rows.password.addEventListener('input', function(e){
            register.password = e.target.value;
            if (!register.isPassword()){
                register.errors.password = register.getErrorText('password');
            } else { register.errors.password = null; }
            if (!register.isPassword2()){
                register.errors.password2 = register.getErrorText('password2');
            } else { register.errors.password2 = null; }
            if (register.submitted){
                rows.errors.password.innerText = register.errors.password ? register.errors.password : "";
                rows.errors.password2.innerText = register.errors.password2 ? register.errors.password2 : "";
            }
        });
        rows.password2.addEventListener('input', function(e){
            register.password2 = e.target.value;
            if (!register.isPassword2()){
                register.errors.password2 = register.getErrorText('password2');
            } else { register.errors.password2 = null; }
            if (register.submitted){
                rows.errors.password2.innerText = register.errors.password2 ? register.errors.password2 : "";
            }
        });
        rows.agree.addEventListener('change', function(){
            register.agree = this.checked ? true : false;
            if (!register.agree){
                register.errors.agree = register.getErrorText('agree');
            } else { register.errors.agree = null; }
            if (register.submitted){
                rows.errors.agree.innerText = register.errors.agree ? register.errors.agree : "";
            }
        });
        rows.submit.addEventListener('click', function(){
            MODALS.register();
        });
    },
    getRegisterBackendErrors(data){
        this.state.register.errors.username = data.username ? data.username[0] : null;
        this.state.register.errors.fullname = data.fullname ? data.fullname[0] : null;
        this.state.register.errors.email = data.email ? data.email[0] : null;
        this.state.register.errors.password = data.password ? data.password[0] : null;
    },
    printRegisterErrors(){
        const rows = this.rows.register.errors;
        const errors = this.state.register.errors;
        rows.username.innerText = errors.username ? errors.username : "";
        rows.fullname.innerText = errors.fullname ? errors.fullname : "";
        rows.email.innerText = errors.email ? errors.email : "";
        rows.password.innerText = errors.password ? errors.password : "";
        rows.password2.innerText = errors.password2 ? errors.password2 : "";
        rows.agree.innerText = errors.agree ? errors.agree : "";
        console.log(errors);
    },
    cleanRegister(){
        const register = this.state.register;
        const rows = this.rows.register;
        register.username = null;
        register.fullname = null;
        register.email = null;
        register.password = null;
        register.agree = false;
        register.errors.username = null;
        register.errors.fullname = null;
        register.errors.email = null;
        register.errors.password = null;
        register.errors.agree = null;
        rows.username = null;
        rows.fullname = null;
        rows.email = null;
        rows.password = null;
        rows.agree = null;
        rows.submit = null;
    },
    registerIsValid(){
        let isValid = true;
        const register = this.state.register;
        if (!this.state.csrf){ isValid = false; }
        if (register.username.length < 3 || register.username.length > 12){
            isValid = false;
            register.errors.username = register.getErrorText('username');
        }
        else { register.errors.username = null; }
        if (register.fullname.length < 2 || register.fullname.length > 20){
            isValid = false;
            register.errors.fullname = register.getErrorText('fullname');
        }
        else { register.errors.fullname = null; }
        if (!register.isEmail()){
            isValid = false;
            register.errors.email = register.getErrorText('email');
        }
        else { register.errors.email = null; }
        if (!register.isPassword()){
            isValid = false;
            register.errors.password = register.getErrorText('password');
        }
        else { register.errors.password = null; }
        if (!register.isPassword2()){
            isValid = false;
            register.errors.password2 = register.getErrorText('password2');
        }
        else { register.errors.password2 = null; }
        if (!register.agree){
            isValid = false;
            register.errors.agree = register.getErrorText('agree');
        }
        else { register.errors.agree = null; }
        return isValid;
    },
    async register(){
        this.state.register.submitted = true;
        if (this.registerIsValid()){
            this.state.busy = true;
            const response = await fetch(this.state.urls.auth.register, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.state.csrf,
                },
                body: JSON.stringify({
                    username: this.state.register.username,
                    fullname: this.state.register.fullname,
                    email: this.state.register.email,
                    password: this.state.register.password,
                })
            }).catch((error) => {
                console.error('Fetching error:', error);
            });
            console.log(response);
            switch (response.status){
                case 201:
                    this.dispatch(this.actions.register_success, {email: this.state.register.email});
                    this.cleanRegister();
                break;
                case 400:
                    this.getRegisterBackendErrors(await response.json());
                    this.printRegisterErrors();
                break;
                case 403:
                    location.href = location.pathname;
                break;
                case 500:
                   ALERT.init({condition: "error", message: "Произошла ошибка на сервере."})
                break;
                default: break;
            }
            setTimeout(()=>this.state.busy = false, 1000);
        } else { this.printRegisterErrors(); }
    },
    async authenticate(email, password){
        if (!this.state.busy && this.state.csrf){
            this.state.busy = true;
            const response = await fetch(this.state.urls.auth.login, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this.state.csrf,
                },
                body: JSON.stringify( {
                    email: email.value,
                    password: password.value
                })
            }).catch((error) => {
                console.error('Fetching error:', error);
            });
            console.log(response);
            if (response.ok){
                const data = await response.json();
                const auth_token = data.auth_token;
                location.href = location.pathname;
            }
            else {
                email.parentNode.dataset.error = "LOGIN";
            }
            setTimeout(()=>this.state.busy = false, 1000);
        }
    },
}

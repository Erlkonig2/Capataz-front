<template>
    <section class="vh-100">
        <div class="container-fluid h-custom">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-md-9 col-lg-6 col-xl-5">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
                        class="img-fluid" alt="Sample image">
                </div>
                <div class="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                    <form>
                        <div class="d-flex flex-row align-items-center justify-content-center justify-content-lg-start">
                            <p class="lead fw-normal mb-0 me-3">Iniciar sesión</p>
                        </div>

                        <div class="divider d-flex align-items-center my-4">
                        </div>

                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <input type="email" id="email" class="form-control form-control-lg"
                                placeholder="Email" v-model="email"/>
                        </div>

                        <!-- Password input -->
                        <div class="form-outline mb-3">
                            <input type="password" id="password" class="form-control form-control-lg"
                                placeholder="Contraseña" v-model="password"/>
                        </div>

                        <div class="d-flex justify-content-between align-items-center">
                            <!-- Checkbox -->
                            <div class="form-check mb-0">
                                <input class="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                <label class="form-check-label" for="form2Example3">
                                    Recuérdame
                                </label>
                            </div>
                            <a href="#!" class="text-body">¿Olvidaste tu contraseña?</a>
                        </div>

                        <div class="text-center text-lg-start mt-4 pt-2">
                            <button type="button" class="btn btn-primary btn-lg"
                                style="padding-left: 2.5rem; padding-right: 2.5rem;" @click="login">Iniciar sesión</button>
                            <p class="small fw-bold mt-2 pt-1 mb-0">¿No tienes una cuenta? <router-link to="/register"
                                    class="link-danger">Regístrate</router-link></p>
                        </div>

                    </form>
                </div>
            </div>
        </div>
        <div
            class="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
            <!-- Copyright -->
            <div class="text-white mb-3 mb-md-0">
                Copyright © 2023. Todos loss derechos reservados.
            </div>
            <!-- Copyright -->

            <!-- Right -->
            <div>
                <a href="#!" class="text-white me-4">
                    <i class="fab fa-facebook-f"></i>
                </a>
                <a href="#!" class="text-white me-4">
                    <i class="fab fa-twitter"></i>
                </a>
                <a href="#!" class="text-white me-4">
                    <i class="fab fa-google"></i>
                </a>
                <a href="#!" class="text-white">
                    <i class="fab fa-linkedin-in"></i>
                </a>
            </div>
            <!-- Right -->
        </div>
    </section>
</template>

<script>

import '../assets/style.css';

export default {
    name: 'LoginView',

    data() {

        return {

            email: '',
            password: '',

        }

    },

    methods: {

        login() {

            const parameters = {

                email: this.email,
                password: this.password,

            }

            this.axios
                .post('http://capataz.api.com:8080/api/users/login', parameters)
                .then((response) => {

                    const { data, status } = response;

                    if (status !== 200) {

                        alert('Usuario o contraseña incorrectos.');

                    }

                    console.log(data);

                    document.cookie = 'user=' + JSON.stringify(data.User);
                    document.cookie = `role=${data.Role}`;
                    document.cookie = `token=${data.Token}`;

                    setTimeout(() => {

                        window.location.href = 'http://localhost:8081/home';

                    }, 3000);

                }).catch(() => {

                    alert('Usuario o contraseña incorrectos');

                });

        }

    }
}
</script>

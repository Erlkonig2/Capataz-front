<template>
    <section class="vh-100" style="background-color: #eee;">
        <div class="container h-100">
            <div class="row d-flex justify-content-center align-items-center h-100">
                <div class="col-lg-12 col-xl-11">
                    <div class="card text-black" style="border-radius: 25px;">
                        <div class="card-body p-md-5">
                            <div class="row justify-content-center">
                                <div class="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">

                                    <p class="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">Registrarse</p>

                                    <form class="mx-1 mx-md-4">

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-user fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example1c">Propietario:</label>
                                                <input type="text" id="owner" class="form-control" v-model="owner" />
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-envelope fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example3c">Departamento:</label>
                                                <input type="text" id="state" class="form-control" v-model="state" />
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-lock fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4c">Municipio:</label>
                                                <input type="text" id="region" class="form-control" v-model="region" />
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4cd">Dirección:</label>
                                                <input type="text" id="address" class="form-control" v-model="address" />
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4cd">Correo electrónico:</label>
                                                <input type="email" id="email" class="form-control" v-model="email" />
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4cd">Clave:</label>
                                                <input type="password" id="password" class="form-control"
                                                    v-model="password" />
                                            </div>
                                        </div>

                                        <div class="d-flex flex-row align-items-center mb-4">
                                            <i class="fas fa-key fa-lg me-3 fa-fw"></i>
                                            <div class="form-outline flex-fill mb-0">
                                                <label class="form-label" for="form3Example4cd">Confirmar clave:</label>
                                                <input type="password" id="password-confirmation" class="form-control"
                                                    v-model="passwordConfirmation" />
                                            </div>
                                        </div>

                                        <div class="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                                            <button type="button" class="btn btn-primary btn-lg" @click="registerUser">Crear
                                                cuenta</button>
                                        </div>

                                    </form>

                                </div>
                                <div class="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">

                                    <img src="https://media.istockphoto.com/id/1391908452/es/foto/jardinero-maduro-con-caja-de-cebollas.jpg?s=612x612&w=0&k=20&c=agqfCn8wVXw9Ua-RMui7L1BMqSYrNoT2WN2dks3D1n4="
                                        class="img-fluid" alt="Imagen granjero">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>

export default {
    name: 'RegisterView',

    data() {

        return {

            owner: '',
            state: '',
            region: '',
            address: '',
            email: '',
            password: '',
            passwordConfirmation: '',

        }

    },

    methods: {

        registerUser() {

            if (this.password == this.passwordConfirmation) {

                if (this.password.length < 8) {

                    alert('La clave debe tener mínimo 8 carácteres');
                    return;

                }

                const parameters = {

                    direccion: this.address,
                    email: this.email,
                    password: this.password,
                    confirmpassword: this.passwordConfirmation,
                    municipio: this.state,
                    departamento: this.region,
                    propietario: this.owner,

                }

                this.axios
                    .post('http://capataz.api.com:8080/api/users/create', parameters)
                    .then((response) => {

                        const { data, status } = response;

                        if (status != 200) {

                            alert('Algo salió mal durante la operación...');
                            return;

                        }

                        alert(data.Message);

                        document.cookie = 'user=' + JSON.stringify(data.User);
                        document.cookie = `role=${data.Role}`;
                        document.cookie = `token=${data.Token}`;

                        setTimeout(() => {

                            window.location.href = 'http://localhost:8081/home';

                        }, 3000);

                    }).catch((error) => {

                        console.log(error);

                    });

            } else {

                alert('Las claves no son iguales');

            }

        }

    }
}
</script>
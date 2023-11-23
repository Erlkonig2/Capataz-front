<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData">
    </NavBar>
    <main id="main-container" v-if="!hideMain">
        <div class="card edit-user-container">
            <div class="card-body">
                <div class="row">

                    <div class="col-12 col-md-6 mb-3">
                        <div class="form-group">
                            <label class="form-label" for="email">Correo:</label>
                            <input type="email"
                                   class="form-control"
                                   id="email"
                                   placeholder="Correo"
                                   v-model="email">
                        </div>
                    </div>
                    <div class="col-12 col-md-6 mb-3">
                        <div class="form-group">
                            <label class="form-label" for="address">Dirección:</label>
                            <input type="email"
                                   class="form-control"
                                   id="address"
                                   placeholder="Dirección"
                                   v-model="address">
                        </div>
                    </div>

                    <div class="col-12 mb-3">
                        <div class="form-group">
                            <label class="form-label" for="owner">Nombre del propietario:</label>
                            <input type="text"
                                   class="form-control"
                                   id="owner"
                                   v-model="owner">
                        </div>
                    </div>

                    <div class="col-12 col-md-6 mb-3">
                        <div class="form-group">
                            <label class="form-label" for="municipality">Municipio:</label>
                            <input type="text"
                                   class="form-control"
                                   id="municipality"
                                   placeholder="Municipio"
                                   v-model="municipality">
                        </div>
                    </div>

                    <div class="col-12 col-md-6 mb-3">
                        <div class="form-group">
                            <label class="form-label" for="department">Departamento:</label>
                            <input type="text"
                                   class="form-control"
                                   id="department"
                                   v-model="department">
                        </div>
                    </div>

                    <div class="col-12 mb-3">
                        <div class="form-group">
                            <label class="form-label" for="password">Nueva contraseña:</label>
                            <input type="password"
                                   class="form-control"
                                   id="password"
                                   placeholder="Contraseña"
                                   v-model="password">
                        </div>
                    </div>

                    <div class="col-12 mb-3">
                        <div class="form-group">
                            <label class="form-label" for="password-confirmation">Confirmar contraseña:</label>
                            <input type="password"
                                   class="form-control"
                                   id="password-confirmation"
                                   placeholder="Confirmar contraseña"
                                   v-model="passwordConfirmation">
                        </div>
                    </div>

                    <button class="btn btn-primary edit-user-save" @click="updateUser">Guardar cambios</button>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import NavBar from '../components/NavBar.vue';
import '../assets/style.css';

export default {

    components: { NavBar },

    name: 'EditUser',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            email: '',
            address: '',
            owner: '',
            municipality: '',
            department: '',
            password: '',
            passwordConfirmation: '',

            useId: 0,

        }

    },

    mounted() {

        const cookiesStrings = document.cookie.split('; ');

        cookiesStrings.forEach((cookie) => {

            const cookieValues = cookie.split('=');

            this.sessionData[cookieValues[0]] = cookieValues[1];

        })

        if (this.sessionData.token === undefined || this.sessionData.token === 'undefined') {

            window.location.href = 'http://localhost:8081/login';

        }

        const user = JSON.parse(this.sessionData.user);

        this.userId = user.id;

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        updateUser() {

            if (this.password === this.passwordConfirmation) {

                if (this.password.length < 8) {

                    alert('La clave debe tener mínimo 8 carácteres');
                    return;

                }

                const parameters = {

                    direccion: this.address,
                    email: this.email,
                    municipio: this.municipality,
                    departamento: this.department,
                    propietario: this.owner,
                    password: this.password,
                    confirmpassword: this.passwordConfirmation,

                }


                this.axios
                    .request({
                        headers: {
                            Authorization: `Bearer ${this.sessionData.token}`
                        },
                        method: 'PUT',
                        url: `http://capataz.api.com:8080/api/users/${this.userId}`,
                        data: parameters,
                    }).then((response) => {

                        const { data } = response;

                        document.cookie = 'user=' + JSON.stringify(data.User);
                        document.cookie = `role=${data.Role}`;
                        document.cookie = `token=${data.Token}`;

                        alert(data.Message);

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
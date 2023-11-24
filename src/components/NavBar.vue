<template>
    <nav>
        <div class="navbar">
            <div class="container nav-container">
                <input class="checkbox" type="checkbox" @click="hideMainContainer"/>
                <div class="hamburger-lines">
                    <span class="line line1"></span>
                    <span class="line line2"></span>
                    <span class="line line3"></span>
                </div>
                <div class="nav-title">
                    <p>Capataz</p>
                </div>
                <div class="logo">
                    <img id="nav-img" src="../assets/user-icon.png" alt="user icon" @click="showUserOptions">
                </div>
                <div class="user-options" v-if="userOptions">
                    <li><i class="fa-solid fa-user-pen"></i><router-link to="/user/edit">Editar</router-link></li>
                    <li @click="logout"><i class="fa-solid fa-right-from-bracket"></i><a href="#">Cerrar sesión</a></li>
                </div>
                <div class="menu-items">
                    <li><i class="fa-solid fa-house"></i><router-link to="/">Inicio</router-link></li>
                    <li><i class="fa-solid fa-map-location-dot"></i><router-link to="/lotes">Predios</router-link></li>
                    <li><i class="fa-solid fa-droplet"></i><router-link to="/cultivos">Cultivos</router-link></li>
                    <li><i class="fa-solid fa-child"></i><router-link to="/empleados">Empleados</router-link></li>
                    <li><i class="fa-solid fa-wrench"></i><router-link to="/herramientas">Herramientas</router-link></li>
                    <li><i class="fa-solid fa-user-pen"></i><router-link to="/tareas">Asignar tareas</router-link></li>
                    <li><i class="fa-solid fa-clipboard-list"></i><router-link to="/labores">Labores</router-link></li>
                    <li><i class="fa-solid fa-box"></i><router-link to="/recoleccion">Recolección de café</router-link></li>
                    <li><i class="fa-solid fa-screwdriver-wrench"></i><router-link to="/prestamos">Préstamo herramientas</router-link></li>
                    <li><i class="fa-solid fa-boxes-stacked"></i><a href="#">Inventario</a></li>
                    <li><i class="fa-solid fa-money-bills"></i><a href="#">Nomina</a></li>
                </div>
            </div>
        </div>
    </nav>
</template>
<script>
export default {
    name: 'NavBar',

    props: {

        userData: {

            type: Object,
            required: true,

        },

    },

    data() {

        return {

            menuActive: false,
            userOptions: false,

        }

    },

    methods: {

        hideMainContainer() {

            this.menuActive = !this.menuActive;

            this.$emit('hide-main-container', this.menuActive);

        },

        showUserOptions() {

            this.userOptions = !this.userOptions;

        },

        logout() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.userData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/users/logoutUser',
                })
                .then((response) => {

                    const { data } = response;

                    alert(data.Message);

                    document.cookie = 'user=' + JSON.stringify(data.User);
                    document.cookie = `role=${data.Role}`;
                    document.cookie = `token=${data.Token}`;

                    setTimeout(() => {

                        window.location.href = 'http://localhost:8081/login';

                    }, 3000);

                }).catch((error) => {

                    console.log(error);
                    alert('Algo ha salido mal...');

                });

        }

    }
}
</script>
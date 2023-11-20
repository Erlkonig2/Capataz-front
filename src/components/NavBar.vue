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
                    <img id="nav-img" src="../assets/user-icon.png" alt="user icon">
                </div>
                <div class="menu-items">
                    <li><a href="#">Inicio</a></li>
                    <li><a href="#">Predios</a></li>
                    <li><a href="#">Cultivos</a></li>
                    <li><a href="#">Empleados</a></li>
                    <li><a href="#">Herramientas</a></li>
                    <li><a href="#">Asignar tareas</a></li>
                    <li><a href="#">Labores</a></li>
                    <li><a href="#">Recolección de café</a></li>
                    <li><a href="#">Préstamo herramientas</a></li>
                    <li><a href="#">Inventario</a></li>
                    <li><a href="#">Nomina</a></li>
                </div>
            </div>
        </div>
    </nav>
</template>
<script>
export default {
    name: 'NavBar',

    data() {

        return {

            menuActive: false,

        }

    },

    methods: {

        hideMainContainer() {

            this.menuActive = !this.menuActive;

            this.$emit('hide-main-container', this.menuActive);

        },

    }
}
</script>
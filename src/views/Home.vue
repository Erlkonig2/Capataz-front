<template>
    <section>
        <NavBar @hide-main-container="hideMainContainer"></NavBar>

        <main id="main-container" v-if="!hideMain">
            <div>
                <p>Siembra con nosotros, cosecha tu futuro</p>
            </div>
        </main>
    </section>
</template>

<script>
import NavBar from '../components/NavBar.vue';
import '../assets/style.css';

export default {

    components: { NavBar },

    name: 'HomeView',

    data() {

        return {

            hideMain: false,

        }

    },

    mounted() {

        const cookiesStrings = document.cookie.split('; ');

        let cookiesList = {};

        cookiesStrings.forEach((cookie) => {

            const cookieValues = cookie.split('=');

            cookiesList[cookieValues[0]] = cookieValues[1];

        })

        console.log(cookiesList.role);

        if (cookiesList.token === undefined) {

            window.location.href = 'http://localhost:8081/login';

        }

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        }

    }

}

</script>
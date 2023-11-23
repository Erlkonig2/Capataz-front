<template>
    <section>
        <NavBar @hide-main-container="hideMainContainer"
                :user-data="sessionData">
        </NavBar>

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
            sessionData: {},

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

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        }

    }

}

</script>
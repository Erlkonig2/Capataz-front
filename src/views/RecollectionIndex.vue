<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrRecollection(false)">Crear</button>
                </div>
                <div class="col-12 mb-3 table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Empleado</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Total</th>
                                <th scope="col">Fecha</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(recollection, index) in recollectionsList" :key="index">
                                <td>{{ recollection.id }}</td>
                                <td>{{ recollection.nombre_empleado }}</td>
                                <td>{{ recollection.Cantidad }}</td>
                                <td>{{ recollection.Total }}</td>
                                <td>{{ recollection.Fecha }}</td>
                                <td>
                                    <button class="btn btn-success" @click="openModalMgrRecollection(true, recollection.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal recolección -->
    <div id="modalMgrRecollection" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrRecollectionType == 'C'">Crear</span>
                            <span v-if="mgrRecollectionType == 'E'">Editar</span>
                            Recolección
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrRecollectionData()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <RecollectionManagerComponent v-if="mgrRecollectionModalLoaded"
                                               :local-type="mgrRecollectionType"
                                               :recollection-id="mgrRecollectionId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getRecollections">
                            </RecollectionManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal recolección -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import RecollectionManagerComponent from '../components/RecollectionManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, RecollectionManagerComponent },

    name: 'RecollectionIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            recollectionsList: [],
            recollectionId: null,
            mgrRecollectionType: 'C',
            mgrRecollectionModalLoaded: false,
            mgrRecollectionId: 0,

            modal: {},

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

        this.getRecollections();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrRecollection'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getRecollections() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/recoleccion',
                }).then((response) => {

                    const { data } = response;

                    this.recollectionsList = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        openModalMgrRecollection(edit = false, recollectionId) {

            if (edit) {

                this.mgrRecollectionModalLoaded = false;
                this.mgrRecollectionType = 'E';
                this.mgrRecollectionId = recollectionId;

            } else {

                this.mgrRecollectionModalLoaded = false;
                this.mgrRecollectionType = 'C';

            }

            setTimeout(() => {

                this.mgrRecollectionModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrRecollectionData() {

            if (this.mgrRecollectionType == 'E') {

                this.mgrRecollectionModalLoaded = false;

            }

            this.mgrRecollectionType = 'C';
            this.mgrRecollectionId = 0;

            this.modal.hide();

        },

    }

}

</script>
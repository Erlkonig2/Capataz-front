<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrLot(false)">Crear</button>
                </div>
                <div class="col-12 mb-3 table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Cultivo</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Tamaño</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(lot, index) in lotsList" :key="index">
                                <td>{{ lot.id }}</td>
                                <td>{{ lot.cultivos.Nombre }}</td>
                                <td>{{ lot.Nombre }}</td>
                                <td>{{ lot.Tamano }}</td>
                                <td>
                                    <button class="btn btn-success" @click="openModalMgrLot(true, lot.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="btn btn-danger" @click="deleteLot(lot.id)"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal Lotes -->
    <div id="modalMgrLot" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrLotType == 'C'">Crear</span>
                            <span v-if="mgrLotType == 'E'">Editar</span>
                            Lote
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrLotData()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <LotManagerComponent v-if="mgrLotModalLoaded"
                                               :local-type="mgrLotType"
                                               :lot-id="mgrLotId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getLots">
                            </LotManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal Lotes -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import LotManagerComponent from '../components/LotManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, LotManagerComponent },

    name: 'LoteIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            lotsList: [],
            lotId: null,
            mgrLotType: 'C',
            mgrLotModalLoaded: false,
            mgrLotId: 0,

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

        this.getLots();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrLot'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getLots() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/lotes',
                }).then((response) => {

                    const { data } = response;

                    this.lotsList = data.map((lot) => lot);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        searchLotId() {

            if (this.lotId === '') {

                this.getLots();
                return;

            }

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/lotes/${this.lotId}`,
                }).then((response) => {

                    const { data } = response;

                    this.lotsList = data.map((lot) => lot);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        deleteLot(id) {

            this.$swal({

                title: "Borrar lote",
                text: "¿Seguro de que desea eliminar este lote?",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: '#106cc8',
                cancelButtonColor: '#dd0c0c',
                cancelButtonText: 'No',
                confirmButtonText: 'Sí',

            }).then((result) => {
                if (result.value) {

                    this.axios
                        .request({
                            headers: {
                                Authorization: `Bearer ${this.sessionData.token}`
                            },
                            method: 'DELETE',
                            url: `http://capataz.api.com:8080/api/lotes/${id}`,
                        }).then((response) => {

                            const { data } = response;

                            this.$swal({
                                title: 'Éxito',
                                text: data.Message,
                                type: 'success',
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                allowEnterKey: false,
                                confirmButtonColor: '#106cc8',
                            }).then((result) => {

                                if (result.value) {

                                    this.getLots();

                                }

                            });

                        }).catch(() => {

                            alert('Algo ha salido mal...');

                        });

                }
            });

        },

        openModalMgrLot(edit = false, lotId) {

            if (edit) {

                this.mgrLotModalLoaded = false;
                this.mgrLotType = 'E';
                this.mgrLotId = lotId;

            } else {

                this.mgrLotModalLoaded = false;
                this.mgrLotType = 'C';

            }

            setTimeout(() => {

                this.mgrLotModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrLotData() {

            if (this.mgrLotType == 'E') {

                this.mgrLotModalLoaded = false;

            }

            this.mgrLotType = 'C';
            this.mgrLotId = 0;

            this.modal.hide();

        },

    }

}

</script>
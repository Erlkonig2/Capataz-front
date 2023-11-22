<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrCrop(false)">Crear</button>
                </div>
                <div class="col-12 mb-3 table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(crop, index) in cropsList" :key="index">
                                <td>{{ crop.id }}</td>
                                <td>{{ crop.Nombre }}</td>
                                <td>
                                    <button class="btn btn-success" @click="openModalMgrCrop(true, crop.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="btn btn-danger" @click="deleteCrop(crop.id)"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal Cultivos -->
    <div id="modalMgrCrop" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrCropType == 'C'">Crear</span>
                            <span v-if="mgrCropType == 'E'">Editar</span>
                            Cultivo
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrCropData()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <CropsManagerComponent v-if="mgrCropModalLoaded"
                                               :local-type="mgrCropType"
                                               :crop-id="mgrCropId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getCrops">
                            </CropsManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal Cultivos -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import CropsManagerComponent from '../components/CropsManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, CropsManagerComponent },

    name: 'CropsIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            cropsList: [],
            cropId: null,
            mgrCropType: 'C',
            mgrCropModalLoaded: false,
            mgrCropId: 0,

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

        this.getCrops();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrCrop'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getCrops() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/cultivos',
                }).then((response) => {

                    const { data } = response;

                    this.cropsList = data.map((crop) => crop);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        deleteCrop(id) {

            this.$swal({

                title: "Borrar cultivo",
                text: "¿Seguro de que desea eliminar este cultivo?",
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
                            url: `http://capataz.api.com:8080/api/cultivos/${id}`,
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

                                    this.getCrops();

                                }

                            });

                        }).catch(() => {

                            alert('Algo ha salido mal...');

                        });

                }
            });

        },

        openModalMgrCrop(edit = false, cropId) {

            if (edit) {

                this.mgrCropModalLoaded = false;
                this.mgrCropType = 'E';
                this.mgrCropId = cropId;

            } else {

                this.mgrCropModalLoaded = false;
                this.mgrCropType = 'C';

            }

            setTimeout(() => {

                this.mgrCropModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrCropData() {

            if (this.mgrCropType == 'E') {

                this.mgrCropModalLoaded = false;

            }

            this.mgrCropType = 'C';
            this.mgrCropId = 0;

            this.modal.hide();

        },

    }

}

</script>
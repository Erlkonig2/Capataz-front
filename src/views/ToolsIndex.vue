<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrTool(false)">Crear</button>
                </div>
                <div class="col-12 mb-3 table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Fabricante</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Fecha de compra</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(tool, index) in toolsList" :key="index">
                                <td>{{ tool.id }}</td>
                                <td>{{ tool.Nombre }}</td>
                                <td>{{ tool.Fabricante }}</td>
                                <td>{{ tool.Cantidad }}</td>
                                <td>{{ tool.FechaDeCompra }}</td>
                                <td>
                                    <button class="btn btn-success" @click="openModalMgrTool(true, tool.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="btn btn-danger" @click="deleteTool(tool.id)"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal Herramientas -->
    <div id="modalMgrTool" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrToolType == 'C'">Registrar</span>
                            <span v-if="mgrToolType == 'E'">Editar</span>
                            Herramienta
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrTool()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <ToolManagerComponent v-if="mgrToolModalLoaded"
                                               :local-type="mgrToolType"
                                               :tool-id="mgrToolId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getTools">
                            </ToolManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal Herramientas -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import ToolManagerComponent from '../components/ToolManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, ToolManagerComponent },

    name: 'EmployeesIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            toolsList: [],
            toolId: null,
            mgrToolType: 'C',
            mgrToolModalLoaded: false,
            mgrToolId: 0,

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

        this.getTools();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrTool'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getTools() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/herramientas',
                }).then((response) => {

                    const { data } = response;

                    this.toolsList = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        deleteTool(id) {

            this.$swal({

                title: "Borrar Herramienta",
                text: "¿Seguro de que desea eliminar esta herramienta?",
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
                            url: `http://capataz.api.com:8080/api/herramientas/${id}`,
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

                                    this.getTools();

                                }

                            });

                        }).catch(() => {

                            alert('Algo ha salido mal...');

                        });

                }
            });

        },

        openModalMgrTool(edit = false, employeeId) {

            if (edit) {

                this.mgrToolModalLoaded = false;
                this.mgrToolType = 'E';
                this.mgrToolId = employeeId;

            } else {

                this.mgrToolModalLoaded = false;
                this.mgrToolType = 'C';

            }

            setTimeout(() => {

                this.mgrToolModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrTool() {

            if (this.mgrToolType == 'E') {

                this.mgrToolModalLoaded = false;

            }

            this.mgrToolType = 'C';
            this.mgrToolId = 0;

            this.modal.hide();

        },

    }

}

</script>
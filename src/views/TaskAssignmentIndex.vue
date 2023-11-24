<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrAssignment(false)">Crear</button>
                </div>
                <div class="col-12 mb-3 table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Tarea</th>
                                <th scope="col">Lote</th>
                                <th scope="col">Estado</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(assignment, index) in assignmentsList" :key="index">
                                <td>{{ assignment.id }}</td>
                                <td>{{ assignment.nombre_empleado }}</td>
                                <td>{{ assignment.labor.Nombre }}</td>
                                <td>{{ assignment.Estado }}</td>
                                <td>{{ assignment.FechaDeAsignacion }}</td>
                                <td>
                                    <button class="btn btn-secondary" @click="changeAssignmentStatus(assignment.id)"><i class="fa-solid fa-check"></i></button>
                                    <button class="btn btn-success" @click="openModalMgrAssignment(true, assignment.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal Asignación -->
    <div id="modalMgrAssignment" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrAssignmentType == 'C'">Registrar</span>
                            <span v-if="mgrAssignmentType == 'E'">Editar</span>
                            Tarea
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrAssignment()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <TaskAssignmentManagerComponent v-if="mgrAssignmentModalLoaded"
                                               :local-type="mgrAssignmentType"
                                               :assignment-id="mgrAssignmentId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getAssignments">
                            </TaskAssignmentManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal Asignación -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import TaskAssignmentManagerComponent from '../components/TaskAssignmentManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, TaskAssignmentManagerComponent },

    name: 'TaskAssignmentIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            assignmentsList: [],
            assignmentId: null,
            mgrAssignmentType: 'C',
            mgrAssignmentModalLoaded: false,
            mgrAssignmentId: 0,

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

        this.getAssignments();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrAssignment'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getAssignments() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/tareas',
                }).then((response) => {

                    const { data } = response;

                    this.assignmentsList = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        changeAssignmentStatus(id) {

            this.$swal({

                title: "Tarea terminada",
                text: "¿Se ha completado la tarea?",
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
                            method: 'PATCH',
                            url: `http://capataz.api.com:8080/api/tareas/${id}`,
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

                                    this.getAssignments();

                                }

                            });

                        }).catch(() => {

                            alert('Algo ha salido mal...');

                        });

                }
            });

        },

        openModalMgrAssignment(edit = false, assignmentId) {

            if (edit) {

                this.mgrAssignmentModalLoaded = false;
                this.mgrAssignmentType = 'E';
                this.mgrAssignmentId = assignmentId;

            } else {

                this.mgrAssignmentModalLoaded = false;
                this.mgrAssignmentType = 'C';

            }

            setTimeout(() => {

                this.mgrAssignmentModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrAssignment() {

            if (this.mgrAssignmentType == 'E') {

                this.mgrAssignmentModalLoaded = false;

            }

            this.mgrAssignmentType = 'C';
            this.mgrAssignmentId = 0;

            this.modal.hide();

        },

    }

}

</script>
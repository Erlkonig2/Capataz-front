<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrTask(false)">Crear</button>
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
                            <tr v-for="(task, index) in tasksList" :key="index">
                                <td>{{ task.id }}</td>
                                <td>{{ task.Nombre }}</td>
                                <td>
                                    <button class="btn btn-success" @click="openModalMgrTask(true, task.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="btn btn-danger" @click="deleteTask(task.id)"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal Labores -->
    <div id="modalMgrTask" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrTaskType == 'C'">Registrar</span>
                            <span v-if="mgrTaskType == 'E'">Editar</span>
                            Labor
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrTask()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <TaskManagerComponent v-if="mgrTaskModalLoaded"
                                               :local-type="mgrTaskType"
                                               :task-id="mgrTaskId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getTasks">
                            </TaskManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal Labores -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import TaskManagerComponent from '../components/TaskManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, TaskManagerComponent },

    name: 'EmployeesIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            tasksList: [],
            taskId: null,
            mgrTaskType: 'C',
            mgrTaskModalLoaded: false,
            mgrTaskId: 0,

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

        this.getTasks();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrTask'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getTasks() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/labores',
                }).then((response) => {

                    const { data } = response;

                    this.tasksList = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        deleteTask(id) {

            this.$swal({

                title: "Borrar Labor",
                text: "¿Seguro de que desea eliminar esta Labor?",
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
                            url: `http://capataz.api.com:8080/api/labores/${id}`,
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

                                    this.getTasks();

                                }

                            });

                        }).catch(() => {

                            alert('Algo ha salido mal...');

                        });

                }
            });

        },

        openModalMgrTask(edit = false, taskId) {

            if (edit) {

                this.mgrTaskModalLoaded = false;
                this.mgrTaskType = 'E';
                this.mgrTaskId = taskId;

            } else {

                this.mgrTaskModalLoaded = false;
                this.mgrTaskType = 'C';

            }

            setTimeout(() => {

                this.mgrTaskModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrTask() {

            if (this.mgrTaskType == 'E') {

                this.mgrTaskModalLoaded = false;

            }

            this.mgrTaskType = 'C';
            this.mgrTaskId = 0;

            this.modal.hide();

        },

    }

}

</script>
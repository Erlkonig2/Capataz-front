<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrEmployee(false)">Crear</button>
                </div>
                <div class="col-12 mb-3 table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Nombre</th>
                                <th scope="col">Documento</th>
                                <th scope="col">Edad</th>
                                <th scope="col">Correo</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(employee, index) in employeesList" :key="index">
                                <td>{{ employee.id }}</td>
                                <td>{{ employee.nombre }}</td>
                                <td>{{ employee.documento }}</td>
                                <td>{{ employee.edad }}</td>
                                <td>{{ employee.email }}</td>
                                <td>
                                    <button class="btn btn-success" @click="openModalMgrEmployee(true, employee.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                    <button class="btn btn-danger" @click="deleteEmployee(employee.id)"><i class="fa-solid fa-trash"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal Cultivos -->
    <div id="modalMgrEmployee" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrEmployeeType == 'C'">Registrar</span>
                            <span v-if="mgrEmployeeType == 'E'">Editar</span>
                            Empleado
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrEmployee()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <EmployeesManagerComponent v-if="mgrEmployeeModalLoaded"
                                               :local-type="mgrEmployeeType"
                                               :employee-id="mgrEmployeeId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getEmployees">
                            </EmployeesManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal Cultivos -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import EmployeesManagerComponent from '../components/EmployeesManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, EmployeesManagerComponent },

    name: 'EmployeesIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            employeesList: [],
            employeeId: null,
            mgrEmployeeType: 'C',
            mgrEmployeeModalLoaded: false,
            mgrEmployeeId: 0,

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

        this.getEmployees();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrEmployee'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getEmployees() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/empleados',
                }).then((response) => {

                    const { data } = response;

                    this.employeesList = data.map((employee) => employee);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        deleteEmployee(id) {

            this.$swal({

                title: "Borrar Empleado",
                text: "¿Seguro de que desea eliminar este empleado?",
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
                            url: `http://capataz.api.com:8080/api/empleados/${id}`,
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

                                    this.getEmployees();

                                }

                            });

                        }).catch(() => {

                            alert('Algo ha salido mal...');

                        });

                }
            });

        },

        openModalMgrEmployee(edit = false, employeeId) {

            if (edit) {

                this.mgrEmployeeModalLoaded = false;
                this.mgrEmployeeType = 'E';
                this.mgrEmployeeId = employeeId;

            } else {

                this.mgrEmployeeModalLoaded = false;
                this.mgrEmployeeType = 'C';

            }

            setTimeout(() => {

                this.mgrEmployeeModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrEmployee() {

            if (this.mgrEmployeeType == 'E') {

                this.mgrEmployeeModalLoaded = false;

            }

            this.mgrEmployeeType = 'C';
            this.mgrEmployeeId = 0;

            this.modal.hide();

        },

    }

}

</script>
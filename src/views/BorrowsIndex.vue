<template>
    <NavBar @hide-main-container="hideMainContainer" :user-data="sessionData"></NavBar>

    <main id="index-main" v-if="!hideMain">
        <div class="wrap">
            <div class="row">
                <div class="col-12 mb-3 d-flex justify-content-center">
                    <button class="btn btn-primary" @click="openModalMgrBorrow(false)">Crear</button>
                </div>
                <div class="col-12 mb-3 table-responsive">
                    <table class="table table-striped align-middle">
                        <thead>
                            <tr>
                                <th scope="col">Id</th>
                                <th scope="col">Empleado</th>
                                <th scope="col">Cantidad</th>
                                <th scope="col">Fecha de entrega</th>
                                <th scope="col">Herramienta</th>
                                <th scope="col">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(borrow, index) in borrowsList" :key="index">
                                <td>{{ borrow.id }}</td>
                                <td>{{ borrow.nombre_empleado }}</td>
                                <td>{{ borrow.Cantidad }}</td>
                                <td>{{ borrow.FechaDeEntrega }}</td>
                                <td>{{ borrow.herramienta.Nombre }}</td>
                                <td>
                                    <button class="btn btn-secondary" @click="returnBorrow(borrow.id)"><i class="fa-solid fa-check"></i></button>
                                    <button class="btn btn-success" @click="openModalMgrBorrow(true, borrow.id)"><i class="fa-solid fa-pen-to-square"></i></button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </main>
    <!-- Inicio Modal Préstamos -->
    <div id="modalMgrBorrow" class="modal" tabindex="-1" role="dialog" data-backdrop="static" data-keyboard="false">
            <div class="modal-dialog modal-xl" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title tit-top-mod">
                            <span v-if="mgrBorrowType == 'C'">Registrar</span>
                            <span v-if="mgrBorrowType == 'E'">Editar</span>
                            Préstamo
                        </h3>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                            @click.prevent="resetMgrBorrow()">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="col-12">
                            <BorrowManagerComponent v-if="mgrBorrowModalLoaded"
                                               :local-type="mgrBorrowType"
                                               :borrow-id="mgrBorrowId"
                                               :token="sessionData.token"
                                               @onUpdateCreate="getBorrows">
                            </BorrowManagerComponent>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- Fin Modal Préstamos -->
</template>
<script>
import NavBar from '../components/NavBar.vue';
import BorrowManagerComponent from '../components/BorrowManagerComponent.vue';
import '../assets/style.css';
import bootstrap from "bootstrap/dist/js/bootstrap.js";

export default {
    components: { NavBar, BorrowManagerComponent },

    name: 'BorrowsIndexView',

    data() {

        return {

            hideMain: false,
            sessionData: {},

            borrowsList: [],
            borrowId: null,
            mgrBorrowType: 'C',
            mgrBorrowModalLoaded: false,
            mgrBorrowId: 0,

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

        this.getBorrows();

        this.modal = new bootstrap.Modal(document.querySelector('#modalMgrBorrow'), {});

    },

    methods: {

        hideMainContainer(hideMain) {

            this.hideMain = hideMain;

        },

        getBorrows() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.sessionData.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/prestamos',
                }).then((response) => {

                    const { data } = response;

                    this.borrowsList = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        returnBorrow(id) {

            this.$swal({

                title: "Devolución herramienta",
                text: "¿Se ha devuelto la herramienta?",
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
                            url: `http://capataz.api.com:8080/api/prestamos/${id}`,
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

                                    this.getBorrows();

                                }

                            });

                        }).catch(() => {

                            alert('Algo ha salido mal...');

                        });

                }
            });

        },

        openModalMgrBorrow(edit = false, borrowId) {

            if (edit) {

                this.mgrBorrowModalLoaded = false;
                this.mgrBorrowType = 'E';
                this.mgrBorrowId = borrowId;

            } else {

                this.mgrBorrowModalLoaded = false;
                this.mgrBorrowType = 'C';

            }

            setTimeout(() => {

                this.mgrBorrowModalLoaded = true;
                this.modal.show();

            }, 500);

        },

        resetMgrBorrow() {

            if (this.mgrBorrowType == 'E') {

                this.mgrBorrowModalLoaded = false;

            }

            this.mgrBorrowType = 'C';
            this.mgrBorrowId = 0;

            this.modal.hide();

        },

    }

}

</script>
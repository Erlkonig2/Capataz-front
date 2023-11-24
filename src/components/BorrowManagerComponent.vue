<template>
    <div class="wrap">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label class="form-label" for="employee">Empleado:</label>
                    <multiselect id="employee"
                                 track-by="id"
                                 v-model="selectedEmployee"
                                 :options="aEmployees"
                                 label="nombre"
                                 :custom-label="customEmployeeName"
                                 :searchable="true">

                        <template v-slot:option="{ option }">
                            {{ option.nombre + ' / ' + option.documento }}
                        </template>

                        <template v-slot:singleLabel="{ option }">
                            {{ option.nombre }}
                        </template>

                        <template v-slot:noResult>
                            <span>Empleado no encontrado.</span>
                        </template>
                    </multiselect>
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <div class="form-group">
                    <label class="form-label" for="quantity">Cantidad:</label>
                    <input type="number"
                            class="form-control"
                            id="quantity"
                            v-model="quantity">
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <div class="form-group">
                    <label class="form-label" for="status">Estado:</label>
                    <multiselect id="status"
                                 v-model="selectedStatus"
                                 :options="aStatus"
                                 :searchable="true">
                    </multiselect>
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label class="form-label" for="tool">Herramienta:</label>
                    <multiselect id="tool"
                                 track-by="id"
                                 v-model="selectedTool"
                                 :options="toolsList"
                                 label="Nombre"
                                 :searchable="true">

                        <template v-slot:option="{ option }">
                            {{ option.Nombre }}
                        </template>

                        <template v-slot:singleLabel="{ option }">
                            {{ option.Nombre }}
                        </template>

                        <template v-slot:noResult>
                            <span>Empleado no encontrado.</span>
                        </template>
                    </multiselect>
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <div class="form-group">
                    <label class="form-label" for="borrow-date">Fecha de préstamo:</label>
                    <VueDatePicker id="borrow-date" v-model="borrowDate" format='yyyy-MM-dd'></VueDatePicker>
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <div class="form-group">
                    <label class="form-label" for="return-date">Fecha de entrega:</label>
                    <VueDatePicker id="return-date" v-model="returnDate" format='yyyy-MM-dd'></VueDatePicker>
                </div>
            </div>
        </div>
        <button class="btn btn-primary" @click="saveEditBorrow">{{ buttonText }}</button>
    </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';
import Multiselect from 'vue-multiselect';

import { toRaw } from 'vue';

export default {

    components: { VueDatePicker, Multiselect },

    props: {
        localType: {
            type: String,
            required: true,
        },
        borrowId: {
            type: Number,
            required: false,
        },
        token: {
            type: String,
            required: true,
        }
    },

    data() {

        return {

            aStatus: ['Activo'],

            name: '',
            quantity: 0,
            status: '',
            borrowDate: '',
            returnDate: '',

            buttonText: '',

            aEmployees: [],
            selectedEmployee: null,
            selectedStatus: null,

            toolsList: [],
            selectedTool: null,


        }

    },

    mounted() {

        this.getEmployees();
        this.getTools();

        if (this.localType == 'E') {

            this.buttonText = 'Editar';
            this.searchBorrowId();

        } else {

            this.buttonText = 'Crear';

        }

    },

    methods: {

        customEmployeeName(employee) {

            return employee.nombre + ' / ' + employee.documento;

        },

        getEmployees() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/empleados',
                }).then((response) => {

                    const { data } = response;

                    this.aEmployees = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        getTools() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
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

        searchBorrowId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/prestamos/${this.borrowId}`,
                }).then((response) => {

                    const { data } = response;

                    this.name = data[0].Nombre;
                    this.quantity = data[0].Cantidad;
                    this.selectedStatus = data[0].Estado;
                    this.borrowDate = data[0].FechaDePrestamo;
                    this.returnDate = data[0].FechaDeEntrega;

                    setTimeout(() => {

                        this.setObjectsValues(data[0]);

                    }, 500);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        setObjectsValues(borrowData) {

            const employeeData = this.aEmployees.filter((employee) => {

                return employee.id == borrowData.Empleado_id;

            })

            this.selectedEmployee = toRaw(employeeData);

            const toolData = this.toolsList.filter((tool) => {

                return tool.id == borrowData.Herramienta_id;

            });

            this.selectedTool = toRaw(toolData);

            this.selectedStatus = this.aStatus.find((status) => {

                return status == borrowData.Estado;

            });

        },

        saveEditBorrow() {

            let borrowDateIso = new Date(this.borrowDate);
            borrowDateIso = borrowDateIso.toISOString().split('T')[0];

            let returnDateIso = new Date(this.returnDate);
            returnDateIso = returnDateIso.toISOString().split('T')[0];

            let employeeData = '';
            let toolData = '';

            if (this.localType == 'E') {

                const employeeDataProxy = toRaw(this.selectedEmployee);
                employeeData = toRaw(employeeDataProxy[0]);

                const toolDataProxy = toRaw(this.selectedTool);
                toolData = toRaw(toolDataProxy[0]);

            }

            const parameters = {

                FechaDePrestamo: borrowDateIso,
                FechaDeEntrega: returnDateIso,
                Cantidad: this.quantity,
                Empleado_id: this.localType == 'C' ? this.selectedEmployee.id : employeeData.id,
                Herramienta_id: this.localType == 'C' ? this.selectedTool.id : toolData.id,

            };

            const baseUrl = 'http://capataz.api.com:8080/api/prestamos';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.borrowId}` : `${baseUrl}/store`,
                    data: parameters,
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
                    });

                    this.$emit('onUpdateCreate');

                }).catch((error) => {

                    console.log(error);

                });

        },

    }

}

</script>
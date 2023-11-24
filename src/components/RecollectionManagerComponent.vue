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
                    <label class="form-label" for="pricer">Precio:</label>
                    <input type="number"
                            class="form-control"
                            id="price"
                            v-model="price">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label class="form-label" for="date">Fecha:</label>
                    <VueDatePicker v-model="date" format='yyyy-MM-dd' id="date"></VueDatePicker>
                </div>
            </div>
        </div>
        <button class="btn btn-primary" v-if="localType == 'C'" @click="saveEditRecollection">{{ buttonText }}</button>
    </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import Multiselect from 'vue-multiselect';

import { toRaw } from 'vue';

export default {

    components: { VueDatePicker, Multiselect },

    props: {
        localType: {
            type: String,
            required: true,
        },
        recollectionId: {
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

            selectedEmployee: null,
            aEmployees: [],

            quantity: 0,
            price: 0,
            date: '',

            buttonText: '',

        }

    },

    mounted() {

        this.getEmployees();

        if (this.localType == 'E') {

            this.buttonText = 'Editar';
            this.searchRecollectionId();

        } else {

            this.buttonText = 'Crear';

        }

    },

    methods: {

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

        customEmployeeName(employee) {

            return employee.nombre + ' / ' + employee.documento;

        },

        searchRecollectionId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/recoleccion/${this.recollectionId}`,
                }).then((response) => {

                    const { data } = response;

                    this.quantity = data[0].Cantidad;
                    this.price = data[0].Precio;
                    this.date = data[0].Fecha;

                    setTimeout(() => {

                        const employeeData = this.aEmployees.filter((employee) => {

                            return employee.id == data[0].Empleado_id;

                        });

                        this.selectedEmployee = toRaw(employeeData);

                    }, 500);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        saveEditRecollection() {

            let dateIso = new Date(this.date);
            dateIso = dateIso.toISOString().split('T')[0];

            let employeeData = '';

            if (this.localType == 'E') {

                const employeeDataProxy = toRaw(this.selectedEmployee);
                employeeData = toRaw(employeeDataProxy[0]);

            }

            const parameters = {

                Fecha: dateIso,
                Cantidad: this.quantity,
                Precio: this.price,
                Empleado_id: this.localType == 'C' ? this.selectedEmployee.id : employeeData.id,

            };

            const baseUrl = 'http://capataz.api.com:8080/api/recoleccion';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.recollectionId}` : `${baseUrl}/store`,
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
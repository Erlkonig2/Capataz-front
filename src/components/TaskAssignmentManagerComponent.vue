<template>
    <div class="wrap">
        <div class="row">
            <div class="col-12 mb-3">
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
                    <label class="form-label" for="lot">Lote:</label>
                    <multiselect id="lot"
                                track-by="id"
                                v-model="selectedLot"
                                :options="aLots"
                                label="Nombre"
                                :searchable="true">

                        <template v-slot:option="{ option }">
                            {{ option.Nombre }}
                        </template>

                        <template v-slot:singleLabel="{ option }">
                            {{ option.Nombre }}
                        </template>

                        <template v-slot:noResult>
                            <span>Lote no encontrado.</span>
                        </template>
                    </multiselect>
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <div class="form-group">
                    <label class="form-label" for="task">Labor:</label>
                    <multiselect id="task"
                                track-by="id"
                                v-model="selectedTask"
                                :options="aTasks"
                                label="nombre"
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
            <div class="col-12 mb-3">
                <div class="form-group">
                    <label class="form-label" for="date">Fecha:</label>
                    <VueDatePicker id="date" v-model="date" format='yyyy-MM-dd'></VueDatePicker>
                </div>
            </div>
            <div class="col-12 mb-3">
                <div class="form-group">
                    <label class="form-label" for="status">Estado:</label>
                    <multiselect id="status"
                                v-model="status"
                                :options="aStatuses"
                                :searchable="true">

                        <template v-slot:noResult>
                            <span>Estado no encontrado.</span>
                        </template>
                    </multiselect>
                </div>
            </div>
        </div>
        <button class="btn btn-primary" @click="saveEditAssignment">{{ buttonText }}</button>
    </div>
</template>
<script>
import Multiselect from 'vue-multiselect';
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';

import { toRaw } from 'vue';

export default {

    components: { Multiselect, VueDatePicker },

    props: {
        localType: {
            type: String,
            required: true,
        },
        assignmentId: {
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

            selectedLot: null,
            aLots: [],

            selectedTask: null,
            aTasks: [],

            date: '',

            status: '',
            aStatuses: ['En ejecucion', 'Pendiente', 'Terminado'],

            buttonText: '',

        }

    },

    mounted() {

        this.getEmployees();
        this.getLots();
        this.getTasks();

        if (this.localType == 'E') {

            this.buttonText = 'Editar';
            this.searchAssignmentId();

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

        getLots() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/lotes',
                }).then((response) => {

                    const { data } = response;

                    this.aLots = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        getTasks() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: 'http://capataz.api.com:8080/api/labores',
                }).then((response) => {

                    const { data } = response;

                    this.aTasks = data;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        customEmployeeName(employee) {

            return employee.nombre + ' / ' + employee.documento;

        },

        searchAssignmentId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/tareas/${this.assignmentId}`,
                }).then((response) => {

                    const { data } = response;

                    this.status = data[0].Estado;
                    this.date = data[0].FechaDeAsignacion;

                    setTimeout(() => {

                        this.setObjectsValues(data[0]);

                    }, 500);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        setObjectsValues(assignmentData) {

            const employeeData = this.aEmployees.filter((employee) => {

                return employee.id == assignmentData.Empleado_id;

            })

            this.selectedEmployee = toRaw(employeeData);

            const lotData = this.aLots.filter((lot) => {

                return lot.id == assignmentData.Lote_id;

            });

            this.selectedLot = toRaw(lotData);

            const taskData = this.aTasks.filter((task) => {

                return task.id == assignmentData.Labor_id;

            });

            this.selectedTask = toRaw(taskData);

        },

        saveEditAssignment() {

            let assignmentDateIso = new Date(this.date);
            assignmentDateIso = assignmentDateIso.toISOString().split('T')[0];

            let employeeData = '';
            let lotData = '';
            let taskData = '';

            if (this.localType == 'E') {

                const employeeDataProxy = toRaw(this.selectedEmployee);
                employeeData = toRaw(employeeDataProxy[0]);

                const lotDataProxy = toRaw(this.selectedLot);
                lotData = toRaw(lotDataProxy[0]);

                const taskDataProxy = toRaw(this.selectedTask);
                taskData = toRaw(taskDataProxy[0]);

            }

            const parameters = {

                FechaDeAsignacion: assignmentDateIso,
                Lote_id: this.localType == 'C' ? this.selectedLot.id : lotData.id,
                Labor_id: this.localType == 'C' ? this.selectedTask.id : taskData.id,
                Empleado_id: this.localType == 'C' ? this.selectedEmployee.id : employeeData.id,

            };

            const baseUrl = 'http://capataz.api.com:8080/api/tareas';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.assignmentId}` : `${baseUrl}/store`,
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
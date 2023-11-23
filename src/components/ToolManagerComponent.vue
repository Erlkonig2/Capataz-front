<template>
    <div class="wrap">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label class="form-label" for="name">Nombre:</label>
                    <input type="text"
                            class="form-control"
                            id="name"
                            v-model="name">
                </div>
            </div>
            <div class="col-12 mb-3">
                <div class="form-group">
                    <label class="form-label" for="quantity">Cantidad:</label>
                    <input type="number"
                            class="form-control"
                            id="quantity"
                            v-model="quantity">
                </div>
            </div>
            <div class="col-12 mb-3">
                <div class="form-group">
                    <label class="form-label" for="manufacturer">Fabricante:</label>
                    <input type="text"
                            class="form-control"
                            id="manufacturer"
                            v-model="manufacturer">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label class="form-label" for="email">Fecha de compra:</label>
                    <VueDatePicker v-model="date" format='yyyy-MM-dd'></VueDatePicker>
                </div>
            </div>
        </div>
        <button class="btn btn-primary" @click="saveEditTool">{{ buttonText }}</button>
    </div>
</template>
<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

export default {

    components: { VueDatePicker },

    props: {
        localType: {
            type: String,
            required: true,
        },
        toolId: {
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

            name: '',
            quantity: 0,
            manufacturer: '',
            date: '',

            buttonText: '',

        }

    },

    mounted() {

        if (this.localType == 'E') {

            this.buttonText = 'Editar';
            this.searchToolId();

        } else {

            this.buttonText = 'Crear';

        }

    },

    methods: {

        searchToolId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/herramientas/${this.toolId}`,
                }).then((response) => {

                    const { data } = response;

                    this.name = data[0].Nombre;
                    this.quantity = data[0].Cantidad;
                    this.manufacturer = data[0].Fabricante;
                    this.date = data[0].FechaDeCompra;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        saveEditTool() {

            let purchaseDate = new Date(this.date);
            purchaseDate = purchaseDate.toISOString().split('T')[0];

            const parameters = {

                Nombre: this.name,
                FechaDeCompra: purchaseDate,
                Cantidad: this.quantity,
                Fabricante: this.manufacturer,

            };

            const baseUrl = 'http://capataz.api.com:8080/api/herramientas';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.toolId}` : `${baseUrl}/store`,
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
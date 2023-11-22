<template>
    <div class="wrap">
        <div class="col-12 mb-3">
            <div class="form-group">
                <label class="form-label" for="name">Nombre:</label>
                <input type="text"
                        class="form-control"
                        id="name"
                        placeholder="Nombre"
                        v-model="name">
            </div>
        </div>
        <button class="btn btn-primary" @click="saveEditCrop">{{ buttonText }}</button>
    </div>
</template>
<script>

export default {

    props: {
        localType: {
            type: String,
            required: true,
        },
        cropId: {
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

            buttonText: '',

        }

    },

    mounted() {

        if (this.localType == 'E') {

            this.buttonText = 'Editar';
            this.searchCropId();

        } else {

            this.buttonText = 'Crear';

        }

    },

    methods: {

        searchCropId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/cultivos/${this.cropId}`,
                }).then((response) => {

                    const { data } = response;

                    this.name = data[0].Nombre;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        saveEditCrop() {

            const parameters = {

                Nombre: this.name,

            };

            const baseUrl = 'http://capataz.api.com:8080/api/cultivos';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.cropId}` : `${baseUrl}/store`,
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
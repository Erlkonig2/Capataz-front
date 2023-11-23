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
        </div>
        <button class="btn btn-primary" @click="saveEditTask">{{ buttonText }}</button>
    </div>
</template>
<script>

export default {

    props: {
        localType: {
            type: String,
            required: true,
        },
        taskId: {
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
            this.searchTaskId();

        } else {

            this.buttonText = 'Crear';

        }

    },

    methods: {

        searchTaskId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/labores/${this.taskId}`,
                }).then((response) => {

                    const { data } = response;

                    this.name = data[0].Nombre;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        saveEditTask() {

            const parameters = {

                Nombre: this.name,

            };

            const baseUrl = 'http://capataz.api.com:8080/api/labores';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.taskId}` : `${baseUrl}/store`,
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
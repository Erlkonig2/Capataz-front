<template>
    <div class="wrap">
        <div class="row">
            <div class="col-12">
                <div class="form-group">
                    <label class="form-label" for="name">Nombre:</label>
                    <input type="text"
                            class="form-control"
                            id="name"
                            placeholder="Nombre"
                            v-model="name">
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <div class="form-group">
                    <label class="form-label" for="age">Edad:</label>
                    <input type="number"
                            class="form-control"
                            id="age"
                            v-model="age">
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3">
                <div class="form-group">
                    <label class="form-label" for="document">Documento:</label>
                    <input type="number"
                            class="form-control"
                            id="document"
                            v-model="document">
                </div>
            </div>
            <div class="col-12">
                <div class="form-group">
                    <label class="form-label" for="email">Correo:</label>
                    <input type="email"
                            class="form-control"
                            id="email"
                            placeholder="email"
                            v-model="email">
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3" v-if="localType == 'C'">
                <div class="form-group">
                    <label class="form-label" for="password">Contraseña:</label>
                    <input type="password"
                            class="form-control"
                            id="password"
                            v-model="password">
                </div>
            </div>
            <div class="col-12 col-md-6 mb-3" v-if="localType == 'C'">
                <div class="form-group">
                    <label class="form-label" for="confirmPassword">Confirmar contraseña:</label>
                    <input type="password"
                            class="form-control"
                            id="confirmPassword"
                            v-model="confirmPassword">
                </div>
            </div>
        </div>
        <button class="btn btn-primary" @click="saveEditEmployee">{{ buttonText }}</button>
    </div>
</template>
<script>

export default {

    props: {
        localType: {
            type: String,
            required: true,
        },
        employeeId: {
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
            age: 0,
            document: 0,
            email: '',
            password: '',
            confirmPassword: '',

            buttonText: '',

        }

    },

    mounted() {

        if (this.localType == 'E') {

            this.buttonText = 'Editar';
            this.searchEmployeeId();

        } else {

            this.buttonText = 'Crear';

        }

    },

    methods: {

        searchEmployeeId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/empleados/${this.employeeId}`,
                }).then((response) => {

                    const { data } = response;

                    this.name = data[0].nombre;
                    this.age = data[0].edad;
                    this.document = data[0].documento;
                    this.email = data[0].email;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        saveEditEmployee() {

            if (this.localType == 'C') {

                if (this.password != this.confirmPassword) {

                    this.$swal({
                        title: 'Alerta',
                        text: 'Las claves no coinciden.',
                        type: 'warning',
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        allowEnterKey: false,
                        confirmButtonColor: '#106cc8',
                    });

                    return;

                }

            }

            const parameters = {

                Nombre: this.name,
                Documento: this.document,
                Edad: this.age,
                Email: this.email,
                Password: this.password

            };

            const baseUrl = 'http://capataz.api.com:8080/api/empleados';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.employeeId}` : `${baseUrl}/store`,
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
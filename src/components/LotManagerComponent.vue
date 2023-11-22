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
            <div class="col-12 mb-3">
                <div class="form-group">
                    <label class="form-label" for="size">Tamaño:</label>
                    <input type="text"
                            class="form-control"
                            id="size"
                            placeholder="Tamaño"
                            v-model="size">
                </div>
            </div>
            <div class="col-12 mb-3">
                <div class="form-group">
                    <label class="form-label">Cultivo:</label>
                    <multiselect v-model="selectedCrop"
                                 :options="aCrops"
                                 track-by="name"
                                 :searchable="true"
                                 :preselect-first="true"
                                 @select="setCropId">

                        <template v-slot:option="{ option }">
                            {{ option.name }}
                        </template>

                        <template v-slot:singleLabel="{ option }">
                            {{ option.name }}
                        </template>

                        <template v-slot:noResult>
                            <span>Cultivo no encontrado.</span>
                        </template>
                    </multiselect>
                </div>
            </div>
            <button class="btn btn-primary" @click="saveEditLot">{{ buttonText }}</button>
        </div>
</template>
<script>
import Multiselect from '@vueform/multiselect'

export default {

    components: { Multiselect },

    props: {
        localType: {
            type: String,
            required: true,
        },
        lotId: {
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
            size: 0,
            crop: 0,

            cropsList: [],
            aCrops: [],
            selectedCrop: '',
            selectedCropId: 0,

            buttonText: '',

        }

    },

    mounted() {

        if (this.localType == 'E') {

            this.buttonText = 'Editar';
            this.searchLotId();

        } else {

            this.buttonText = 'Crear';

        }

        this.getCrops();

    },

    methods: {

        searchLotId() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/lotes/${this.lotId}`,
                }).then((response) => {

                    const { data } = response;

                    this.name = data[0].Nombre;
                    this.size = data[0].Tamano;
                    this.crop = data[0].Cultivo_id;

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        getCrops() {

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: 'GET',
                    url: `http://capataz.api.com:8080/api/cultivos`,
                }).then((response) => {

                    const { data } = response;

                    this.cropsList = data;
                    this.aCrops = data.map((crop) => crop.Nombre);

                }).catch(() => {

                    alert('Algo ha salido mal...');

                });

        },

        setCropId() {

            const cropData = this.cropsList.find((crop) => crop.Nombre = this.selectedCrop);

            this.selectedCropId = cropData.id;

        },

        saveEditLot() {

            const parameters = {

                Nombre: this.name,
                Tamano: this.size,
                Cultivo_id: this.selectedCropId,

            };

            const baseUrl = 'http://capataz.api.com:8080/api/lotes';

            this.axios
                .request({
                    headers: {
                        Authorization: `Bearer ${this.token}`
                    },
                    method: this.localType == 'E' ? 'PUT' : 'POST',
                    url: this.localType == 'E' ? `${baseUrl}/${this.lotId}` : `${baseUrl}/store`,
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
<style src="@vueform/multiselect/themes/default.css"></style>
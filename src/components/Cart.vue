<template>
  <section>
    <Toolbar class="mb-4 m-2">
      <template #start>
        <div class="flex justify-content-center mr-2">
        </div>
        <Button label="Agregar artículo" icon="pi pi-plus" severity="success" class="mr-2"
                @click="openNew"/>
      </template>
    </Toolbar>

    <Dialog v-model:visible="articleDialog" :style="{ width: '700px' }" header="Article Details" :modal="true"
            class="p-fluid">
      <div class="field">
        <label class="mb-3">Código <span class="text-red-500 font-bold">*</span></label>
        <InputText id="code" v-model.trim="article.code" required="true" rows="3" cols="20" :min="1"
                   style="min-width:1rem" :class="{ 'p-invalid': submitted && !article.code }"/>
        <small class="p-error" v-if="submitted && !article.code">El código del artículo es requerido</small>
      </div>

      <div class="field">
        <label for="name">Nombre <span class="text-red-500 font-bold">*</span></label>
        <InputText id="name" v-model.trim="article.name" required="true" rows="3" cols="20"
                   :class="{ 'p-invalid': submitted && !article.name }"/>
        <small class="p-error" v-if="submitted && !article.name">El nombre es requerido.</small>
      </div>

      <div class="field">
        <label for="description">Descripción <span class="text-red-500 font-bold">*</span></label>
        <Textarea id="description" v-model.trim="article.description" required="true" rows="3" cols="20"
                  :class="{ 'p-invalid': submitted && !article.description }"/>
        <small class="p-error" v-if="submitted && !article.description">La descripción es requerida.</small>
      </div>

      <div class="field">
        <label class="mb-3">Costo <span class="text-red-500 font-bold">*</span></label>
        <InputNumber id="cost" v-model.trim="article.cost" required="true" rows="3" cols="20" :min="1"
                     style="min-width:1rem" :class="{ 'p-invalid': submitted && !article.cost }"/>
        <small class="p-error" v-if="submitted && !article.cost">El precio es requerido</small>
      </div>

      <div class="field">
        <label class="mb-3">Estado</label>
        <div class="flex flex-wrap gap-3">
          <div class="form-check form-switch">
            <InputSwitch v-model="article.isActive" :value="article.isActive" :id="article.id"
                         :checked="article.isActive === true" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" severity="secondary" size="small"
                @click="hideDialog"/>
        <Button label="Guardar" icon="pi pi-check" severity="success" size="small"
                @click="saveBanner"/>
      </template>
    </Dialog>
    <Toast/>
  </section>

  <section>
    <div class="article">
      <div v-for="item in items" :key="item.id">
        <Card style="width: 18em">
          <template #title> {{ item.name }}</template>
          <template #content>
            <p>{{ item.description }}</p>
            <p>Costo: {{ item.cost.toLocaleString('es-CO') }}</p>
            <p>Precio: ${{ item.price.toLocaleString('es-CO') }}</p>
            <p>Estado: {{ item.isActive }}</p>
          </template>
          <template #footer>
              <span class="p-buttonset">
              <Button icon="pi pi-check" label="Editar" @click="editArticle(item)"/>
              <Button icon="pi pi-times" label="Eliminar" severity="secondary" @click="removeArticle(item.id)"/>
                </span>
          </template>
        </Card>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useArticle } from '@/stores/store'
import { computed, onMounted, ref } from "vue";
import { useToast } from 'primevue/usetoast';
import Card from "primevue/card";
import Toolbar from 'primevue/toolbar';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/InputSwitch';
import InputNumber from 'primevue/inputnumber';

const toast = useToast();

const articleStore = useArticle()

const items = computed(() => {
  return articleStore.getItems
})

const articleDialog = ref(false);
const article = ref({})
const submitted = ref(false)
const openNew = () => {
  article.value = {};
  submitted.value = false;
  articleDialog.value = true;
};
const hideDialog = () => {
  articleDialog.value = false;
  submitted.value = false;
};

const response = computed(() => {
  return articleStore.getResponse
})

onMounted(() => {
  articleStore.fetchArticle()
  responses()
});

function responses() {
  return new Promise(resolve => {
    setTimeout(() => {
      if (response.value.error_msg) {
        toast.add({ severity: 'error', summary: 'Error', detail: response.value.error_msg, life: 3000 });
      } else {
        toast.add({ severity: 'success', summary: 'Excelente', detail: response.value.success_msg, life: 3000 });
      }
    }, 1000);
  });
}

const editArticle = (data) => {
  article.value = { ...data };
  articleDialog.value = true;
};
const saveBanner = () => {

  submitted.value = true;
  const whitespaceRegex = /^\s*$/;

  function validateFields() {
    const campos = [
      { campo: 'code', message: 'El código del artículo es requerido' },
      { campo: 'name', message: 'Verifique que el nombre esté lleno' },
      { campo: 'description', message: 'Verifique que la descripción este llena' },
      { campo: 'cost', message: 'Verifique que el costo este lleno' },
    ];

    for (const campo of campos) {
      if (typeof article.value[campo.campo] === 'undefined' || article.value[campo.campo] === '' || whitespaceRegex.test(article.value[campo.campo])) {
        validator(campo.message);
        return false;
      }
    }

    return true;
  }

  function validator(message) {
    toast.add({ severity: 'warn', summary: 'Error', detail: message, life: 3000 });
  }

  if (!validateFields()) {

  } else {

    if (article.value.id) {

      const articleEdit = items.value[findIndexById(article.value.id)] = article.value;

      articleStore.editArticle(articleEdit)
      articleStore.fetchArticle()

      function responses() {
        return new Promise(resolve => {
          setTimeout(() => {
            if (response.value.error_msg) {
              toast.add({ severity: 'error', summary: 'Error', detail: response.value.error_msg, life: 3000 });
            } else {
              toast.add({
                severity: 'success',
                summary: 'Excelente',
                detail: response.value.success_msg,
                life: 3000
              });
            }
          }, 500);
        });
      }

      // articleStore.fetchArticle()
      responses()
    } else {
      const cost = article.value.cost * .35
      article.value.price = cost + article.value.cost
      article.value.isActive = article.value.isActive || false

      articleStore.saveArticle(article.value)
      // articleStore.fetchArticle()

      function responses() {
        return new Promise(resolve => {
          setTimeout(() => {
            if (response.value.error_msg) {
              toast.add({ severity: 'error', summary: 'Error', detail: response.value.error_msg, life: 3000 });
            } else {
              toast.add({
                severity: 'success',
                summary: 'Excelente',
                detail: response.value.success_msg,
                life: 3000
              });
            }
          }, 500);
        });
      }

      // articleStore.fetchArticle()
      responses()
    }

    articleDialog.value = false;
    article.value = {};
  }
}

const findIndexById = (id) => {
  let index = -1;
  for (let i = 0; i < items.value.length; i++) {
    if (items.value[i].id === id) {
      index = i;
      break;
    }
  }
  return index;
}

const removeArticle = (itemId) => {
  articleStore.removeArticle(itemId)
  articleStore.fetchArticle()
  setTimeout(() => {
    if (response.value.error_msg) {
      toast.add({ severity: 'error', summary: 'Error', detail: "Hubo un error al eliminar el articulo", life: 3000 });
    } else {
      toast.add({ severity: 'success', summary: 'Excelente', detail: "Articulo eliminado correctamente.", life: 3000 });
    }
  }, 500);
  articleStore.fetchArticle()
}

</script>

<style scoped>
.article {
  display: grid;
  place-items: center;
  gap: 1rem;
  grid-auto-flow: dense;
  grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
}
</style>
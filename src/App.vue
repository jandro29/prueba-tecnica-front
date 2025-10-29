<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getProductos, deleteProducto, updateProducto, createProducto } from './productos';

// Definir la interfaz del producto
interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

// Variable reactiva para almacenar los productos
const productos = ref<Producto[]>([]);

// Variables para el modo edición
const productoEditando = ref<number | null>(null);
const nombreEditando = ref<string>('');
const descripcionEditando = ref<string>('');
const precioEditando = ref<number>(0);
const stockEditando = ref<number>(0);

// Variables para crear nuevo producto
const mostrarFormulario = ref<boolean>(false);
const nuevoProducto = ref({
  nombre: '',
  descripcion: '',
  precio: 0,
  stock: 0
});

// Variables para controlar si el campo ha sido tocado
const camposTocados = ref({
  nombre: false,
  descripcion: false,
  precio: false,
  stock: false
});

// Variables para errores de validación
const erroresCrear = ref({
  nombre: '',
  descripcion: '',
  precio: '',
  stock: ''
});

// Función para cargar los productos desde la API
const cargarProductos = async () => {
  try {
    console.log('Cargando productos...');
    const response = await getProductos();
    console.log('Datos recibidos:', response.data);
    productos.value = response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
};

// Función para marcar campo como tocado
function marcarComoTocado(campo: 'nombre' | 'descripcion' | 'precio' | 'stock') {
  camposTocados.value[campo] = true;
  validarCampo(campo);
}

// Función para validar un campo específico
function validarCampo(campo: 'nombre' | 'descripcion' | 'precio' | 'stock') {
  if (!camposTocados.value[campo]) return;

  switch (campo) {
    case 'nombre':
      if (!nuevoProducto.value.nombre.trim()) {
        erroresCrear.value.nombre = 'El nombre es obligatorio';
      } else {
        erroresCrear.value.nombre = '';
      }
      break;
    
    case 'descripcion':
      if (!nuevoProducto.value.descripcion.trim()) {
        erroresCrear.value.descripcion = 'La descripción es obligatoria';
      } else {
        erroresCrear.value.descripcion = '';
      }
      break;
    
    case 'precio':
      if (nuevoProducto.value.precio <= 0) {
        erroresCrear.value.precio = 'El precio debe ser mayor a 0';
      } else {
        erroresCrear.value.precio = '';
      }
      break;
    
    case 'stock':
      if (nuevoProducto.value.stock < 0) {
        erroresCrear.value.stock = 'El stock no puede ser negativo';
      } else if (nuevoProducto.value.stock > 99999999) {
        erroresCrear.value.stock = 'El stock no puede tener más de 8 dígitos';
      } else {
        erroresCrear.value.stock = '';
      }
      break;
  }
}

// Función para validar el formulario completo
function validarFormularioCrear(): boolean {
  let esValido = true;
  
  // Marcar todos los campos como tocados
  camposTocados.value = {
    nombre: true,
    descripcion: true,
    precio: true,
    stock: true
  };

  // Validar todos los campos
  validarCampo('nombre');
  validarCampo('descripcion');
  validarCampo('precio');
  validarCampo('stock');

  // Verificar si hay errores
  if (erroresCrear.value.nombre || erroresCrear.value.descripcion || 
      erroresCrear.value.precio || erroresCrear.value.stock) {
    esValido = false;
  }

  return esValido;
}

// Función para crear un producto
async function crearProducto() {
  if (!validarFormularioCrear()) {
    return;
  }

  try {
    await createProducto(nuevoProducto.value);
    console.log('Producto creado exitosamente');
    
    // Resetear formulario
    nuevoProducto.value = {
      nombre: '',
      descripcion: '',
      precio: 0,
      stock: 0
    };
    
    // Resetear campos tocados
    camposTocados.value = {
      nombre: false,
      descripcion: false,
      precio: false,
      stock: false
    };
    
    // Resetear errores
    erroresCrear.value = {
      nombre: '',
      descripcion: '',
      precio: '',
      stock: ''
    };
    
    mostrarFormulario.value = false;
    await cargarProductos();
  } catch (error) {
    console.error('Error al crear producto:', error);
    alert('Error al crear el producto');
  }
}

// Función para activar el modo edición
function activarEdicion(producto: Producto) {
  productoEditando.value = producto.id;
  nombreEditando.value = producto.nombre;
  descripcionEditando.value = producto.descripcion;
  precioEditando.value = producto.precio;
  stockEditando.value = producto.stock;
}

// Función para cancelar la edición
function cancelarEdicion() {
  productoEditando.value = null;
  nombreEditando.value = '';
  descripcionEditando.value = '';
  precioEditando.value = 0;
  stockEditando.value = 0;
}

// Función para guardar la edición
async function guardarEdicion(id: number) {
  try {
    const data = {
      nombre: nombreEditando.value,
      descripcion: descripcionEditando.value,
      precio: precioEditando.value,
      stock: stockEditando.value
    };
    await updateProducto(id, data);
    console.log('Producto actualizado exitosamente');
    cancelarEdicion();
    await cargarProductos();
  } catch (error) {
    console.error('Error al actualizar producto:', error);
  }
}

// Función para eliminar y recargar
async function eliminarProducto(id: number) {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    try {
      await deleteProducto(id);
      console.log('Producto eliminado exitosamente');
      await cargarProductos();
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  }
}

// Función para limitar el stock a 8 dígitos
function limitarStock() {
  if (nuevoProducto.value.stock > 99999999) {
    nuevoProducto.value.stock = 99999999;
  }
  validarCampo('stock');
}

// Ejecutar al montar el componente
onMounted(() => {
  cargarProductos();
});
</script>

<template>
  <div class="p-6 max-w-7xl mx-auto">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-3xl font-bold text-gray-800">Productos (Total: {{ productos.length }})</h1>
      <button 
        @click="mostrarFormulario = !mostrarFormulario"
        class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-all shadow-md hover:shadow-lg font-semibold"
      >
        {{ mostrarFormulario ? '✕ Cancelar' : '+ Nuevo Producto' }}
      </button>
    </div>

    <!-- Formulario para crear producto -->
    <div v-if="mostrarFormulario" class="bg-white p-8 rounded-xl mb-6 shadow-lg border border-gray-200">
      <h2 class="text-2xl font-bold mb-6 text-gray-800">Crear Nuevo Producto</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-700">
            Nombre <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="nuevoProducto.nombre"
            @blur="marcarComoTocado('nombre')"
            @input="validarCampo('nombre')"
            type="text"
            class="w-full border-2 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :class="{ 
              'border-red-500 bg-red-50': camposTocados.nombre && erroresCrear.nombre,
              'border-gray-300': !camposTocados.nombre || !erroresCrear.nombre,
              'focus:border-blue-500': !erroresCrear.nombre
            }"
          />
          <p v-if="camposTocados.nombre && erroresCrear.nombre" class="text-red-500 text-sm mt-2 flex items-center">
            <span class="mr-1">⚠</span> {{ erroresCrear.nombre }}
          </p>
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-700">
            Descripción <span class="text-red-500">*</span>
          </label>
          <input 
            v-model="nuevoProducto.descripcion"
            @blur="marcarComoTocado('descripcion')"
            @input="validarCampo('descripcion')"
            type="text"
            class="w-full border-2 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :class="{ 
              'border-red-500 bg-red-50': camposTocados.descripcion && erroresCrear.descripcion,
              'border-gray-300': !camposTocados.descripcion || !erroresCrear.descripcion,
              'focus:border-blue-500': !erroresCrear.descripcion
            }"
          />
          <p v-if="camposTocados.descripcion && erroresCrear.descripcion" class="text-red-500 text-sm mt-2 flex items-center">
            <span class="mr-1">⚠</span> {{ erroresCrear.descripcion }}
          </p>
        </div>

        <!-- Precio -->
        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-700">
            Precio <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <span class="absolute left-4 top-3 text-gray-500 font-semibold">$</span>
            <input 
              v-model.number="nuevoProducto.precio"
              @blur="marcarComoTocado('precio')"
              @input="validarCampo('precio')"
              type="number"
              step="0.01"
              min="0"
              class="w-full border-2 rounded-lg pl-8 pr-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              :class="{ 
                'border-red-500 bg-red-50': camposTocados.precio && erroresCrear.precio,
                'border-gray-300': !camposTocados.precio || !erroresCrear.precio,
                'focus:border-blue-500': !erroresCrear.precio
              }"
              placeholder="1500.50"
            />
          </div>
          <p v-if="camposTocados.precio && erroresCrear.precio" class="text-red-500 text-sm mt-2 flex items-center">
            <span class="mr-1">⚠</span> {{ erroresCrear.precio }}
          </p>
        </div>

        <!-- Stock -->
        <div>
          <label class="block text-sm font-semibold mb-2 text-gray-700">
            Stock <span class="text-red-500">*</span> <span class="text-gray-400 text-xs">(máx. 8 dígitos)</span>
          </label>
          <input 
            v-model.number="nuevoProducto.stock"
            @blur="marcarComoTocado('stock')"
            @input="limitarStock"
            type="number"
            min="0"
            max="99999999"
            class="w-full border-2 rounded-lg px-4 py-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            :class="{ 
              'border-red-500 bg-red-50': camposTocados.stock && erroresCrear.stock,
              'border-gray-300': !camposTocados.stock || !erroresCrear.stock,
              'focus:border-blue-500': !erroresCrear.stock
            }"
            placeholder="100"
          />
          <p v-if="camposTocados.stock && erroresCrear.stock" class="text-red-500 text-sm mt-2 flex items-center">
            <span class="mr-1">⚠</span> {{ erroresCrear.stock }}
          </p>
        </div>
      </div>

      <div class="flex gap-4 mt-8">
        <button 
          @click="crearProducto"
          class="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-all shadow-md hover:shadow-lg font-semibold"
        >
          Guardar Producto
        </button>
        <button 
          @click="mostrarFormulario = false"
          class="bg-gray-500 text-white px-8 py-3 rounded-lg hover:bg-gray-600 transition-all shadow-md hover:shadow-lg font-semibold"
        >
          Cancelar
        </button>
      </div>
    </div>

    <!-- Tabla de productos -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <table class="w-full">
        <thead>
          <tr class="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <th class="px-6 py-4 text-left font-semibold">ID</th>
            <th class="px-6 py-4 text-left font-semibold">NOMBRE</th>
            <th class="px-6 py-4 text-left font-semibold">DESCRIPCION</th>
            <th class="px-6 py-4 text-left font-semibold">PRECIO</th>
            <th class="px-6 py-4 text-left font-semibold">STOCK</th>
            <th class="px-6 py-4 text-left font-semibold">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="productos.length === 0">
            <td colspan="6" class="px-6 py-8 text-center text-gray-500">
              No hay productos disponibles
            </td>
          </tr>
          <tr v-for="producto in productos" :key="producto.id" class="border-b border-gray-200 hover:bg-gray-50 transition-colors">
            <!-- Modo normal -->
            <template v-if="productoEditando !== producto.id">
              <td class="px-6 py-4 text-gray-700">{{ producto.id }}</td>
              <td class="px-6 py-4 text-gray-700 font-medium">{{ producto.nombre }}</td>
              <td class="px-6 py-4 text-gray-600">{{ producto.descripcion }}</td>
              <td class="px-6 py-4 text-gray-700 font-semibold">${{ producto.precio }}</td>
              <td class="px-6 py-4">
                <span class="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  {{ producto.stock }}
                </span>
              </td>
              
              <td class="px-6 py-4">
                <button 
                  @click="activarEdicion(producto)"
                  class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-all mr-2"
                >
                  Editar
                </button>
                <button 
                  @click="eliminarProducto(producto.id)" 
                  class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
                >
                  Eliminar
                </button>
              </td>
            </template>

            <!-- Modo edición -->
            <template v-else>
              <td class="px-6 py-4 text-gray-700">{{ producto.id }}</td>
              <td class="px-6 py-4">
                <input 
                  v-model="nombreEditando" 
                  type="text"
                  class="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <input 
                  v-model="descripcionEditando" 
                  type="text"
                  class="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <input 
                  v-model.number="precioEditando" 
                  type="number"
                  step="0.01"
                  class="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <input 
                  v-model.number="stockEditando" 
                  type="number"
                  max="99999999"
                  class="w-full border-2 border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
              <td class="px-6 py-4">
                <button 
                  @click="guardarEdicion(producto.id)"
                  class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-all mr-2"
                >
                  Guardar
                </button>
                <button 
                  @click="cancelarEdicion()"
                  class="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-all"
                >
                  Cancelar
                </button>
              </td>
            </template>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>

/* Animación suave para inputs con error */
input.border-red-500 {
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
</style>
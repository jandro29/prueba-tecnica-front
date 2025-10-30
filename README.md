###################################################
 Descripción

Este proyecto es una interfaz desarrollada con Vue 3 y TypeScript que permite gestionar productos mediante operaciones CRUD (Crear, Leer, Actualizar y Eliminar).
Está conectada a una API (por ejemplo, una API desarrollada en Laravel) y presenta una interfaz moderna y responsiva con validaciones en tiempo real.

###################################################
###################################################
###################################################

Funcionalidades principales

Listado dinámico de productos con actualización automática.

Creación de nuevos productos con validaciones visuales y en tiempo real.

Edición y actualización de productos directamente en la tabla.

Eliminación de productos con confirmación.

Control de errores y retroalimentación visual.

###################################################
###################################################
###################################################


Tecnologías utilizadas

Vue 3 (Composition API)

TypeScript

TailwindCSS

Axios (para peticiones HTTP)

Vite (entorno de desarrollo rápido)

###################################################
###################################################
###################################################

Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

Node.js >= 18

npm o yarn

Una API funcional (por ejemplo, la API Laravel del CRUD de productos)

###################################################
###################################################
###################################################

Instalación y configuración

Clonar el repositorio:

git clone https://github.com/usuario/vue-crud-productos.git
cd vue-crud-productos


Instalar dependencias:

npm install


Configurar la URL base de la API:
Abre el archivo productos.ts y ajusta la ruta del backend, por ejemplo:

const API_URL = 'http://127.0.0.1:8000/api/productos';


Ejecutar el servidor de desarrollo:

npm run dev


El proyecto estará disponible en:
http://localhost:5173


###################################################
###################################################
###################################################


Estructura principal
src/
├── components/
│   └── Productos.vue     # Componente principal con CRUD completo
├── api/
│   └── productos.ts      # Funciones Axios para conectar con la API
├── assets/
│   └── estilos.css       # Estilos adicionales
└── main.ts               # Configuración principal de Vue

###################################################
###################################################
###################################################


Funciones principales del componente
Función	Descripción
cargarProductos()	Obtiene los productos desde la API.
crearProducto()	Valida y envía un nuevo producto al servidor.
activarEdicion()	Activa el modo de edición de un producto.
guardarEdicion()	Envía los cambios de un producto actualizado.
eliminarProducto()	Elimina un producto previa confirmación.
validarCampo()	Valida individualmente los campos del formulario.
limitarStock()	Restringe el valor máximo del stock (8 dígitos).

###################################################
###################################################
###################################################

Características visuales

Interfaz limpia y responsiva con TailwindCSS.

Animaciones suaves para errores de validación.

Indicadores visuales en campos obligatorios y errores.

Alertas y confirmaciones en acciones críticas.

###################################################
###################################################
###################################################

Ejemplo de producto
{
  "nombre": "Teclado mecánico RGB",
  "descripcion": "Teclado con switches azules y retroiluminación RGB",
  "precio": 199.99,
  "stock": 50
}

###################################################
###################################################
###################################################

Conexión con API externa

El componente importa las siguientes funciones desde productos.ts:

import { getProductos, deleteProducto, updateProducto, createProducto } from './productos';


Estas funciones usan Axios para comunicarse con el backend y manejar las peticiones HTTP a la API de Laravel.
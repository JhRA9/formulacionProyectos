# Sheet Keeper - Sistema de Gestion Financiera

Sheet Keeper es una aplicacion web disenada para gestionar y organizar todos los datos financieros de un proyecto empresarial. Permite trabajar con informacion de personal, inversiones, depreciacion y mucho mas, todo en un solo lugar.

La aplicacion centraliza toda la informacion financiera de una empresa o proyecto. Se puede registrar y actualizar datos sobre personal, materia prima, equipos, inversiones y ver proyecciones financieras. Todo esta organizado en diferentes secciones o pestanas que se pueden navegar facilmente.

## Donde esta cada cosa

### Carpeta src - Aqui esta todo el codigo

- **pages/Index.tsx**: Es la pagina principal donde se ven todas las nueve pestanas con los datos. Aqui es donde ocurre toda la logica y donde se manejan los datos que se escriben.

- **components/**: Aqui estan los componentes reutilizables. DataTable muestra los datos en tablas, y EditDialog es el formulario emergente para agregar o editar registros.

- **data/initial-data.ts**: Este archivo contiene los datos de ejemplo que se ven al abrir la aplicacion. Si se desea cambiar los numeros iniciales, se puede hacer aqui.

- **hooks/use-local-storage.tsx**: Este es el sistema de persistencia de datos. Guarda todo lo que se escribe directamente en el navegador para que no se pierda cuando se cierre la pagina.

- **types/excel-data.ts**: Aqui se definen los tipos de datos que maneja la aplicacion, como PersonalRow, MateriaPrimaRow, etc. Son como moldes que aseguran que los datos tengan la forma correcta.

- **lib/utils.ts**: Funciones auxiliares pequenas que se utilizan en varios lugares.

### Carpeta public - Archivos estaticos

Aqui estan los archivos que no cambian, como las imagenes y el archivo robots.txt para los motores de busqueda.

### Archivos importantes en la raiz

- **package.json**: Define las librerias que se necesitan para funcionar (React, Tailwind, etc.) y los comandos que se pueden ejecutar.

- **vite.config.ts**: Es la configuracion de construccion. Le dice a Vite como debe compilar la aplicacion.

- **netlify.toml**: Archivo que le dice a Netlify como desplegar la aplicacion en internet.

- **index.html**: La pagina HTML base que carga todo.

## Como usar esto localmente

Si se desea trabajar con la aplicacion en la computadora local:

```
npm install
```

Esto descarga todas las dependencias necesarias.

```
npm run dev
```

Esto ejecuta la aplicacion en modo desarrollo. Estara disponible en http://localhost:8080 y se recargara automaticamente cuando se hagan cambios en el codigo.

## Como construir para produccion

Cuando se esta listo para que vaya a la web:

```
npm run build
```

Esto crea una carpeta llamada `dist` donde se guardan todos los archivos optimizados y listos para publicar en internet.

## Como desplegar en Netlify

Netlify es donde la aplicacion estara disponible en internet para que cualquier persona pueda acceder a ella desde un navegador.

El proceso de despliegue es automatico:

1. Se crea un repositorio en GitHub con todos los archivos del proyecto
2. Se conecta ese repositorio a la cuenta de Netlify
3. Cada vez que se hace un cambio y se guarda en GitHub, Netlify automaticamente:
   - Descarga el codigo mas reciente
   - Ejecuta el comando `npm run build`
   - Publica los archivos de la carpeta `dist` en internet
4. La aplicacion queda disponible en una URL que Netlify proporciona

Lo importante es que solo se necesita guardar los cambios en el repositorio de GitHub. Netlify se encarga del resto automaticamente.

## Como funcionan los datos

Los datos se guardan utilizando localStorage, que es un almacenamiento que ofrecen todos los navegadores web modernos. Esto significa:

- Los datos se guardan directamente en el navegador del usuario
- No se necesita un servidor externo ni base de datos
- Cuando se cierra la pagina y se vuelve a abrir, los datos siguen ahi
- La aplicacion funciona de forma instantanea sin dependencias externas

Importante: Los datos se guardan por navegador y computadora. Si se abre la aplicacion desde otro navegador o desde otra computadora, no se veran los datos que se ingresaron en la primera. Este almacenamiento es local al dispositivo y navegador especifico.

## Que tecnologias se utilizan

La aplicacion se construye utilizando las siguientes tecnologias:

- React 18: Framework que proporciona la interfaz interactiva
- TypeScript: Lenguaje que asegura que no haya errores con los tipos de datos
- Tailwind CSS: Framework CSS que proporciona los estilos visuales
- shadcn/ui: Libreria de componentes visuales profesionales y accesibles
- Vite: Herramienta que compila la aplicacion de forma rapida y eficiente

## Las nueve secciones que contiene

1. **Personal**: Gestiona la nomina y datos de empleados
2. **Materia Prima**: Controla insumos y materiales necesarios
3. **Equipos**: Inventario de maquinaria y herramientas
4. **Inversiones**: Distribuye el capital entre diferentes fuentes de financiamiento
5. **Amortizacion**: Calcula automaticamente los pagos de prestamos
6. **Depreciacion**: Muestra como se deprecian los activos fijos
7. **Estado de Resultados**: Proyecciones de ingresos y gastos
8. **Flujo de Efectivo**: Analisis de movimiento de dinero proyectado
9. **Razones Financieras**: Indicadores clave de desempeno financiero

Cada seccion permite agregar, editar y eliminar registros facilmente a traves de la interfaz.

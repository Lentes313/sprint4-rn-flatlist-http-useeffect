# Preguntas de reflexión

_Escribe tus respuestas debajo de cada pregunta._

**Alumno:** 

---

## Paso 1 · Explorando la API

| Pregunta | Mi respuesta |
|---|---|
| ¿Cuántos personajes trae cada página? | 20 personajes (el arreglo `results` trae 20 elementos). |
| ¿Qué campo me dice si existe una página siguiente? | `info.next`: trae la URL de la siguiente página. |
| ¿Qué valor tiene ese campo en la última página? | `null` (la página 42 ya no tiene siguiente). |
| ¿Qué código HTTP devuelve una búsqueda sin resultados? | **404**, con el cuerpo `{ "error": "There is nothing here" }`. |
| ¿Qué campos del personaje usa `CharacterCard`? | `name`, `status`, `species` e `image` (y `id` para la llave de la lista). |

## Paso 2 · Petición HTTP

**¿Qué diferencia hay entre que `fetch` "falle" y que el servidor responda con un error? ¿Qué debo revisar en la respuesta?**

> La promesa de `fetch` solo se rechaza cuando no se pudo hacer la petición: sin internet, DNS que no resuelve, el servidor no contesta, etc. Si el servidor sí contesta, aunque sea con un 404 o un 500, `fetch` se resuelve normal y la respuesta llega como "exitosa" para JavaScript. Por eso hay que revisar `response.ok` (es `true` solo con códigos 200–299) y `response.status` (el código numérico). En mi servicio, el 404 lo trato como "sin resultados" y cualquier otro código que no sea `ok` lanza un `Error` con el código.

## Paso 3 · Estado

**¿Por qué guardo los personajes en estado y no en una variable normal?**

> Porque cambiar una variable normal no le avisa a React que tiene que volver a dibujar la pantalla, y además se reinicia en cada render. Con `useState`, al llamar `setCharacters` React guarda el valor entre renders y vuelve a renderizar con los datos nuevos, así la lista aparece en cuanto llega la respuesta.

## Paso 4 · useEffect

1. **¿Qué pasa si omito por completo el arreglo de dependencias?**

> El efecto se ejecuta después de **cada** render. Como el efecto hace la petición y luego actualiza el estado, eso provoca otro render, que vuelve a ejecutar el efecto... y se queda en un bucle de peticiones a la API.

2. **¿Qué significa dejar el arreglo vacío?**

> Que el efecto no depende de ningún valor, así que solo se ejecuta una vez, cuando la pantalla se monta (y su limpieza cuando se desmonta). Después, en los pasos 6 y 10, le agregué `reloadKey` y `query` para que también se vuelva a ejecutar al reintentar o al cambiar la búsqueda.

3. **¿Por qué la función que recibe `useEffect` no debe ser `async` directamente?**

> Porque una función `async` siempre devuelve una promesa, y React espera que el efecto devuelva nada o una función de limpieza. Si le pasamos una promesa, React no puede usarla como limpieza. Por eso declaré una función `async` dentro del efecto (`loadFirstPage`) y la llamé ahí mismo.

## Paso 5 · FlatList

1. **¿Para qué sirve la prop que extrae la llave de cada elemento?**

> `keyExtractor` le da a cada elemento una llave única y estable (yo uso `String(item.id)`, porque React espera un texto). Con esa llave React sabe qué elemento es cuál cuando la lista cambia: reutiliza los que ya existen, agrega solo los nuevos y no muestra la advertencia de *keys*.

2. **¿Por qué usar `FlatList` en lugar de un `ScrollView` con `.map()`?**

> `ScrollView` dibuja todos sus hijos al mismo tiempo, así que con cientos de personajes se gastaría mucha memoria y la app se pondría lenta. `FlatList` virtualiza: solo renderiza lo que se ve en pantalla (más un margen) y va reciclando conforme te desplazas. Además ya trae props para separadores, lista vacía, pie de lista, paginación (`onEndReached`) y pull to refresh.

## Paso 6 · Carga y error

**¿Por qué es mejor mostrar un mensaje con un botón "Reintentar" que dejar la pantalla vacía?**

> Porque con la pantalla vacía el usuario no sabe si la app se trabó, si no hay datos o si falló algo, y la única salida sería cerrar y abrir la app. El mensaje le explica qué pasó (por ejemplo, que no hay conexión) y el botón le permite volver a intentarlo cuando regrese la red. En mi caso el botón aumenta `reloadKey`, que está en las dependencias del efecto, y eso vuelve a ejecutar la carga.

## Paso 8 · Paginación

**¿Qué problema aparece si la función de "cargar más" se dispara varias veces seguidas? ¿Cómo lo evité?**

> `onEndReached` se puede llamar varias veces mientras sigues cerca del final. Si cada llamada hace su petición, se pide la misma página dos o más veces y los personajes se agregan repetidos, lo que además provoca la advertencia de *keys* duplicadas. Lo evité saliendo de la función antes de pedir datos si ya hay una carga en curso (`loading`, `loadingMore` o `refreshing`), si ya no hay página siguiente (`hasNextPage` en `false`) o si hay un error pendiente.

## Paso 9 · Pull to refresh

**¿Por qué usé un estado distinto (`refreshing`) y no el mismo de la carga inicial?**

> 

## Paso 10 · Búsqueda

1. **¿Qué es el debounce y qué problema resuelve?**

> 

2. **¿Para qué sirve la función de limpieza (cleanup) que se devuelve en un `useEffect`? Da un ejemplo de esta práctica.**

> 

3. **Si el usuario escribe rápido y las respuestas llegan en desorden, ¿qué podría salir mal?**

> 

## Cierre

**Menciona dos mejoras que le harías a la app si tuvieras una hora más:**

> 

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

> 

2. **¿Qué significa dejar el arreglo vacío?**

> 

3. **¿Por qué la función que recibe `useEffect` no debe ser `async` directamente?**

> 

## Paso 5 · FlatList

1. **¿Para qué sirve la prop que extrae la llave de cada elemento?**

> 

2. **¿Por qué usar `FlatList` en lugar de un `ScrollView` con `.map()`?**

> 

## Paso 6 · Carga y error

**¿Por qué es mejor mostrar un mensaje con un botón "Reintentar" que dejar la pantalla vacía?**

> 

## Paso 8 · Paginación

**¿Qué problema aparece si la función de "cargar más" se dispara varias veces seguidas? ¿Cómo lo evité?**

> 

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

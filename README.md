# noWatch - Aplicación de IPTV (En Desarrollo) - **Descripción General**

La aplicación de **IPTV** llamada **noWatch** está en desarrollo y tiene como objetivo ofrecer una experiencia de entretenimiento completa, permitiendo a los usuarios acceder a una amplia variedad de canales de televisión en vivo, películas y programas de televisión directamente desde sus dispositivos. Nuestra aplicación se basa en la integración con fuentes de contenido abiertas y actualizadas para proporcionar una experiencia fluida y organizada.

## 1. **Integración con el Repositorio [iptv-org/iptv](https://github.com/iptv-org/iptv)**
   
La aplicación consume los datos del repositorio de IPTV de código abierto [iptv-org/iptv](https://github.com/iptv-org/iptv), que contiene listas de reproducción organizadas de IPTV, ofreciendo acceso a canales de TV en vivo, películas, y más. Este repositorio cuenta con miles de canales globales organizados por regiones, géneros y otros criterios, lo que permite a los usuarios explorar contenido de manera eficiente.

- **Acceso a canales de todo el mundo:** Los usuarios pueden disfrutar de una amplia gama de canales de televisión desde diferentes países y en múltiples idiomas.
- **Actualización continua del contenido:** La app aprovecha las actualizaciones frecuentes del repositorio, garantizando que los usuarios tengan acceso a la programación más actualizada y con la mayor calidad disponible.

## 2. **Funcionalidades Clave**
   
Nuestra aplicación está siendo diseñada con el objetivo de proporcionar una experiencia intuitiva y organizada para los usuarios. A continuación se detallan las principales características:

- **Exploración de contenido por categorías:** La aplicación organiza los canales de IPTV y el listado de películas en distintas categorías para facilitar su búsqueda. Estas categorías incluyen:
  - **Países:** Organización por región y país de origen del canal o contenido.
  - **Géneros:** Desde deportes, noticias, entretenimiento, hasta géneros específicos como cine, infantil, música y mucho más.
  - **Idioma:** Agrupación de contenido por el idioma del canal o película.
  - **Tipos de contenido:** Diferenciación entre **Televisión en vivo** y **Películas a demanda**.
  
- **Listado de Películas:** Gracias a la integración con el repositorio de IPTV, la aplicación ofrecerá un extenso listado de películas organizadas por género y región. Los usuarios podrán navegar y reproducir películas directamente desde la aplicación sin complicaciones.

- **Búsqueda personalizada:** Los usuarios podrán realizar búsquedas basadas en el nombre del canal, película o por palabra clave, facilitando el acceso directo al contenido deseado.

- **Favoritos y listas personalizadas:** Cada usuario podrá guardar sus canales y películas favoritos para acceder a ellos de manera rápida y sencilla desde su cuenta.

## 3. **Características Técnicas**

La aplicación está siendo construida con tecnologías modernas que garantizan un rendimiento eficiente, una integración fluida de API y la capacidad de manejar grandes volúmenes de datos en tiempo real.

- **Consumo de API del repositorio de IPTV:** Utilizamos llamadas API eficientes para consumir los datos actualizados del repositorio de [iptv-org/iptv](https://github.com/iptv-org/iptv), permitiendo que la aplicación siempre muestre el contenido más reciente.
- **Soporte para listas de reproducción M3U:** El formato M3U es soportado para reproducir canales de TV y películas, permitiendo a los usuarios acceder a su contenido con facilidad desde cualquier dispositivo compatible.
- **Compatibilidad** La aplicación está desarrollada para ser compatible en web y en movil, permitiendo que los usuarios disfruten de su contenido desde sus dispositivos móviles o computador con internet.
- **Streaming optimizado:** La aplicación asegura una transmisión de video fluida mediante una gestión optimizada del ancho de banda y la capacidad de ajustar la calidad de transmisión según la conexión del usuario.

## 4. **Cómo Funciona la Aplicación**

1. **Conexión con el repositorio de IPTV:** La aplicación se conecta automáticamente al repositorio de IPTV y extrae el listado de canales de TV y películas. Este contenido se actualiza periódicamente, proporcionando a los usuarios acceso al contenido más reciente.
   
2. **Organización del contenido:** Una vez que los datos se extraen del repositorio, se organizan en diferentes categorías predefinidas, tales como país, género, y tipo de contenido. Esto permite a los usuarios navegar de forma intuitiva por los canales y las películas.
   
3. **Reproducción de contenido:** Los usuarios seleccionan un canal o película desde la interfaz de la aplicación y se inicia la reproducción utilizando un reproductor de video integrado. La transmisión es directa desde la fuente, asegurando una reproducción sin interrupciones.

## 5. **Trabajo en Equipo**

Este proyecto es un esfuerzo colaborativo, en el que trabajamos en equipo para desarrollar la aplicación:

- **Frontend (Interfaz de Usuario):** Desarrollado con **React** para proporcionar una experiencia moderna y fluida en plataformas web y móviles.
- **Backend (Autenticación y Servicios):** Desarrollado en **Spring Boot**, responsable de la gestión segura de usuarios y la comunicación eficiente entre el frontend y los servicios de contenido.

**Colaboradores:**
- Erick Galindo [Erick/proyect_react](https://github.com/ErickGC546/Proyec-React) (Frontend en Web).
- Alex Huancahuari [Alex/proyect_SpringBoot](https://github.com/livecodingx/PI_2_2024_4C24_noWatch) (Backend del todo el proyecto).  

## 6. **Perspectivas Futuras**

En futuras versiones, planeamos incluir las siguientes mejoras:
   
- **Soporte para grabación de TV en vivo:** Permitiendo a los usuarios grabar y almacenar programas o películas.
- **Notificaciones personalizadas:** Alertas para eventos en vivo o estrenos de películas basadas en las preferencias del usuario.
- **Interfaz mejorada con recomendaciones personalizadas:** Basado en el historial de visualización del usuario.

## 7. **Conclusión**

Nuestra aplicación IPTV **noWatch** no solo aprovechará la vasta base de datos de contenido disponible en el repositorio [iptv-org/iptv](https://github.com/iptv-org/iptv), sino que también ofrecerá una interfaz optimizada y amigable para el usuario. Con características avanzadas como la búsqueda por categorías, la integración de listas de reproducción M3U, y la capacidad de reproducir contenido en alta calidad desde cualquier dispositivo, esta aplicación representa una solución completa para los entusiastas del streaming de IPTV.

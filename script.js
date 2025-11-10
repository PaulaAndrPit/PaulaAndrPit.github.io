// Funcionalidad para el formulario de contacto
document.addEventListener('DOMContentLoaded', function() {
    
    // Verificar si estamos en la página de contacto
    const formulario = document.querySelector('form');
    const tablaBody = document.querySelector('table tbody');
    
    if (formulario && tablaBody) {
        // Obtener todos los campos del formulario
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const direccion = document.getElementById('direccion');
        const telefono = document.getElementById('telefono');
        const edad = document.getElementById('edad');
        const email = document.getElementById('email');
        const provincia = document.getElementById('provincia');
        const codigoPostal = document.getElementById('codigo-postal');
        
        // Función para obtener el método de contacto seleccionado
        function obtenerMetodoContacto() {
            const metodoSeleccionado = document.querySelector('input[name="metodo-contacto"]:checked');
            return metodoSeleccionado ? metodoSeleccionado.value : '-';
        }
        
        // Función para obtener las suscripciones seleccionadas
        function obtenerSuscripciones() {
            const checkboxes = document.querySelectorAll('input[name="suscripcion"]:checked');
            if (checkboxes.length === 0) return '-';
            
            const valores = Array.from(checkboxes).map(cb => cb.value);
            return valores.join(', ');
        }
        
        // Función para actualizar la tabla
        function actualizarTabla() {
            // Obtener todas las filas de la tabla
            const filas = tablaBody.querySelectorAll('tr');
            
            // Actualizar cada celda con el valor correspondiente
            filas[0].cells[1].textContent = nombre.value || '-';
            filas[1].cells[1].textContent = apellido.value || '-';
            filas[2].cells[1].textContent = direccion.value || '-';
            filas[3].cells[1].textContent = telefono.value || '-';
            filas[4].cells[1].textContent = edad.value || '-';
            filas[5].cells[1].textContent = email.value || '-';
            filas[6].cells[1].textContent = provincia.value || '-';
            filas[7].cells[1].textContent = codigoPostal.value || '-';
            filas[8].cells[1].textContent = obtenerMetodoContacto();
            filas[9].cells[1].textContent = obtenerSuscripciones();
        }
        
        // Agregar eventos de input a cada campo de texto
        nombre.addEventListener('input', actualizarTabla);
        apellido.addEventListener('input', actualizarTabla);
        direccion.addEventListener('input', actualizarTabla);
        telefono.addEventListener('input', actualizarTabla);
        edad.addEventListener('input', actualizarTabla);
        email.addEventListener('input', actualizarTabla);
        provincia.addEventListener('input', actualizarTabla);
        codigoPostal.addEventListener('input', actualizarTabla);
        
        // Agregar eventos change a los radio buttons
        const radios = document.querySelectorAll('input[name="metodo-contacto"]');
        radios.forEach(radio => {
            radio.addEventListener('change', actualizarTabla);
        });
        
        // Agregar eventos change a los checkboxes
        const checkboxes = document.querySelectorAll('input[name="suscripcion"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', actualizarTabla);
        });
        
        // Inicializar la tabla con los valores por defecto
        actualizarTabla();
    }
    
    // Funcionalidad para el botón "Leer más" en la página Acerca de para la lectura completa de CV
    const btnLeerMas = document.getElementById('btnLeerMas');
    
    if (btnLeerMas) {
        const cvCompleto = document.getElementById('cvCompleto');
        
        btnLeerMas.addEventListener('click', function() {
            if (cvCompleto.style.display === 'none' || cvCompleto.style.display === '') {
                cvCompleto.style.display = 'block';
                btnLeerMas.textContent = 'Leer menos';
            } else {
                cvCompleto.style.display = 'none';
                btnLeerMas.textContent = 'Leer más';
            }
        });
    }
});
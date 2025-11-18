document.addEventListener('DOMContentLoaded', function () {

    // ========== FUNCIONALIDAD DEL FORMULARIO ==========
    const formulario = document.querySelector('form');
    const tablaBody = document.querySelector('table tbody');

    if (formulario && tablaBody) {
        const nombre = document.getElementById('nombre');
        const apellido = document.getElementById('apellido');
        const direccion = document.getElementById('direccion');
        const telefono = document.getElementById('telefono');
        const edad = document.getElementById('edad');
        const email = document.getElementById('email');
        const provincia = document.getElementById('provincia');
        const codigoPostal = document.getElementById('codigo-postal');

        function obtenerMetodoContacto() {
            const metodoSeleccionado = document.querySelector('input[name="metodo-contacto"]:checked');
            return metodoSeleccionado ? metodoSeleccionado.value : '-';
        }

        function obtenerSuscripciones() {
            const checkboxes = document.querySelectorAll('input[name="suscripcion"]:checked');
            if (checkboxes.length === 0) return '-';
            const valores = Array.from(checkboxes).map(cb => cb.value);
            return valores.join(', ');
        }

        function esCampoValido(campo) {
            campo.setCustomValidity('');

            if (!campo.value && !campo.hasAttribute('required')) {
                return true;
            }

            if (campo === email && campo.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(campo.value)) {
                    campo.setCustomValidity('Por favor, ingrese un correo electrónico válido');
                    return false;
                }
            }

            if (campo === codigoPostal && campo.value) {
                const cpRegex = /^[A-Z]?\d{4}([A-Z]{3})?$/i;
                if (!cpRegex.test(campo.value)) {
                    campo.setCustomValidity('Código postal inválido (Ej: A1234ABC)');
                    return false;
                }
            }

            if (campo === edad && campo.value) {
                const edadValor = parseInt(campo.value);
                if (isNaN(edadValor) || edadValor < 16 || edadValor > 120) {
                    campo.setCustomValidity('Edad debe estar entre 16 y 120 años');
                    return false;
                }
            }

            if (campo === telefono && campo.value) {
                const telRegex = /^[\d\s\-\(\)\+]+$/;
                if (!telRegex.test(campo.value)) {
                    campo.setCustomValidity('Número de teléfono inválido');
                    return false;
                }
            }

            return campo.checkValidity();
        }

        function actualizarTabla() {
            const camposConValor = [nombre, apellido, direccion, telefono, edad, email, provincia, codigoPostal].filter(campo => campo && campo.value);

            let todosValidos = true;
            for (let campo of camposConValor) {
                if (!esCampoValido(campo)) {
                    todosValidos = false;
                    break;
                }
            }

            if (todosValidos) {
                const filas = tablaBody.querySelectorAll('tr');
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
        }

        function validarCampo(input) {
            const esValido = esCampoValido(input);

            if (!esValido) {
                input.scrollIntoView({ behavior: 'smooth', block: 'center' });
                try {
                    input.reportValidity();
                } catch (e) {
                    console.warn('Error al mostrar validación:', e);
                }
                input.classList.add('campo-invalido');
                setTimeout(() => {
                    input.focus();
                }, 100);
            } else {
                input.classList.remove('campo-invalido');
            }

            return esValido;
        }

        function manejarInput(e) {
            const campo = e.target;
            campo.classList.remove('campo-invalido');
            campo.setCustomValidity('');

            if (esCampoValido(campo)) {
                actualizarTabla();
            }
        }

        function manejarBlur(e) {
            const campo = e.target;

            if (campo.value || campo.hasAttribute('required')) {
                const esValido = validarCampo(campo);
                if (esValido) {
                    actualizarTabla();
                }
            }
        }

        function manejarKeydown(e) {
            const campo = e.target;

            if (e.key === 'Tab' || e.key === 'Enter') {
                if (campo.value && !esCampoValido(campo)) {
                    e.preventDefault();
                    validarCampo(campo);
                    return false;
                }
            }
        }

        [nombre, apellido, direccion, telefono, edad, email, provincia, codigoPostal].forEach(campo => {
            if (campo) {
                campo.addEventListener('input', manejarInput);
                campo.addEventListener('blur', manejarBlur);
                campo.addEventListener('keydown', manejarKeydown);
            }
        });

        const radios = document.querySelectorAll('input[name="metodo-contacto"]');
        radios.forEach(radio => {
            radio.addEventListener('change', actualizarTabla);
        });

        const checkboxes = document.querySelectorAll('input[name="suscripcion"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', actualizarTabla);
        });

        formulario.addEventListener('submit', function (e) {
            let formularioValido = true;
            let primerCampoInvalido = null;

            document.querySelectorAll('input, select, textarea').forEach(input => {
                if (!esCampoValido(input)) {
                    formularioValido = false;
                    input.classList.add('campo-invalido');
                    if (!primerCampoInvalido) {
                        primerCampoInvalido = input;
                    }
                }
            });

            if (!formularioValido) {
                e.preventDefault();
                if (primerCampoInvalido) {
                    validarCampo(primerCampoInvalido);
                }
                alert('Por favor, corrija los errores en el formulario antes de enviar.');
            }
        });

        actualizarTabla();
    }

    // ========== FUNCIONALIDAD BOTÓN "LEER MÁS" ==========
    const btnLeerMas = document.getElementById('btnLeerMas');

    if (btnLeerMas) {
        const cvCompleto = document.getElementById('cvCompleto');

        btnLeerMas.addEventListener('click', function () {
            if (cvCompleto.style.display === 'none' || cvCompleto.style.display === '') {
                cvCompleto.style.display = 'block';
                btnLeerMas.textContent = 'Leer menos';
            } else {
                cvCompleto.style.display = 'none';
                btnLeerMas.textContent = 'Leer más';
            }
        });
    }

    // ========== NAVEGACIÓN ENTRE JUEGOS ==========
    window.mostrarJuego = function(idJuego) {
        // Ocultar menú
        const menu = document.getElementById('menu-juegos');
        if (menu) menu.style.display = 'none';

        // Ocultar todos los juegos
        const juegos = document.querySelectorAll('.juego-container');
        juegos.forEach(j => j.style.display = 'none');

        // Mostrar el juego seleccionado
        const juegoSeleccionado = document.getElementById(idJuego);
        if (juegoSeleccionado) {
            juegoSeleccionado.style.display = 'block';
            
            // Inicializar el juego correspondiente
            if (idJuego === 'adivina-numero') {
                iniciarJuegoNumero();
            } else if (idJuego === 'memoria') {
                iniciarJuegoMemoria();
            } else if (idJuego === 'banderas') {
                iniciarJuegoBanderas();
            }
        }
    };

    window.volverMenu = function() {
        // Mostrar menú
        const menu = document.getElementById('menu-juegos');
        if (menu) menu.style.display = 'block';

        // Ocultar todos los juegos
        const juegos = document.querySelectorAll('.juego-container');
        juegos.forEach(j => j.style.display = 'none');
    };

    // ========== JUEGO 1: PIEDRA, PAPEL O TIJERA ==========
    let puntosJugador = 0;
    let puntosComputadora = 0;

    const iconos = {
        piedra: '🪨',
        papel: '📄',
        tijera: '✂️'
    };

    window.jugar = function(eleccionJugador) {
        const opciones = ['piedra', 'papel', 'tijera'];
        const eleccionComputadora = opciones[Math.floor(Math.random() * 3)];

        const ganador = determinarGanador(eleccionJugador, eleccionComputadora);

        actualizarPuntos(ganador);
        mostrarResultado(eleccionJugador, eleccionComputadora, ganador);
    };

    function determinarGanador(jugador, computadora) {
        if (jugador === computadora) return 'empate';

        if (
            (jugador === 'piedra' && computadora === 'tijera') ||
            (jugador === 'papel' && computadora === 'piedra') ||
            (jugador === 'tijera' && computadora === 'papel')
        ) {
            return 'jugador';
        } else {
            return 'computadora';
        }
    }

    function actualizarPuntos(ganador) {
        if (ganador === 'jugador') {
            puntosJugador++;
            const elementoPuntos = document.getElementById('puntosJugador');
            if (elementoPuntos) {
                elementoPuntos.textContent = puntosJugador;
            }
        } else if (ganador === 'computadora') {
            puntosComputadora++;
            const elementoPuntos = document.getElementById('puntosComputadora');
            if (elementoPuntos) {
                elementoPuntos.textContent = puntosComputadora;
            }
        }
    }

    function mostrarResultado(jugador, computadora, ganador) {
        let mensaje = '';
        let clase = '';

        if (ganador === 'empate') {
            mensaje = '¡Empate!';
            clase = 'empate';
        } else if (ganador === 'jugador') {
            mensaje = '¡Ganaste!';
            clase = 'ganaste';
        } else {
            mensaje = '¡Perdiste!';
            clase = 'perdiste';
        }

        const elementoResultado = document.getElementById('resultado');
        if (elementoResultado) {
            elementoResultado.innerHTML = `
                <div class="elecciones">
                    <div class="eleccion">
                        <p>Tú</p>
                        <div class="eleccion-icon">${iconos[jugador]}</div>
                    </div>
                    <div class="eleccion">
                        <p>VS</p>
                    </div>
                    <div class="eleccion">
                        <p>Computadora</p>
                        <div class="eleccion-icon">${iconos[computadora]}</div>
                    </div>
                </div>
                <div class="mensaje ${clase}">${mensaje}</div>
            `;
        }
    }

    window.reiniciarPPT = function() {
        puntosJugador = 0;
        puntosComputadora = 0;
        
        const elementoPuntosJugador = document.getElementById('puntosJugador');
        const elementoPuntosComputadora = document.getElementById('puntosComputadora');
        const elementoResultado = document.getElementById('resultado');
        
        if (elementoPuntosJugador) elementoPuntosJugador.textContent = 0;
        if (elementoPuntosComputadora) elementoPuntosComputadora.textContent = 0;
        if (elementoResultado) {
            elementoResultado.innerHTML = '<p style="color: #666; font-size: 1.2em;">Elige tu jugada</p>';
        }
    };

    // ========== JUEGO 2: ADIVINA EL NÚMERO ==========
    let numeroSecreto = 0;
    let intentosNumero = 0;
    let mejorPuntaje = localStorage.getItem('mejorPuntajeNumero') || '-';

    function iniciarJuegoNumero() {
        numeroSecreto = Math.floor(Math.random() * 100) + 1;
        intentosNumero = 0;
        
        const elemMejor = document.getElementById('mejorPuntaje');
        if (elemMejor) elemMejor.textContent = mejorPuntaje;
        
        const elemIntentos = document.getElementById('intentos');
        if (elemIntentos) elemIntentos.textContent = 0;
        
        const elemPista = document.getElementById('pistaNumero');
        if (elemPista) elemPista.textContent = '';
        
        const input = document.getElementById('inputNumero');
        if (input) input.value = '';
    }

    window.adivinarNumero = function() {
        const input = document.getElementById('inputNumero');
        const pista = document.getElementById('pistaNumero');
        const elemIntentos = document.getElementById('intentos');
        
        if (!input || !pista) return;
        
        const intento = parseInt(input.value);
        
        if (isNaN(intento) || intento < 1 || intento > 100) {
            pista.textContent = '⚠️ Ingresa un número entre 1 y 100';
            pista.className = 'pista';
            return;
        }
        
        intentosNumero++;
        if (elemIntentos) elemIntentos.textContent = intentosNumero;
        
        const diferencia = Math.abs(numeroSecreto - intento);
        
        if (intento === numeroSecreto) {
            pista.textContent = `🎉 ¡CORRECTO! El número era ${numeroSecreto}. Lo encontraste en ${intentosNumero} intentos.`;
            pista.className = 'pista correcto';
            
            if (mejorPuntaje === '-' || intentosNumero < parseInt(mejorPuntaje)) {
                mejorPuntaje = intentosNumero;
                localStorage.setItem('mejorPuntajeNumero', mejorPuntaje);
                const elemMejor = document.getElementById('mejorPuntaje');
                if (elemMejor) elemMejor.textContent = mejorPuntaje;
            }
            
            input.disabled = true;
        } else if (diferencia <= 5) {
            pista.textContent = `🔥 ¡CALIENTE! Estás muy cerca. El número es ${intento < numeroSecreto ? 'mayor' : 'menor'}.`;
            pista.className = 'pista caliente';
        } else if (diferencia <= 15) {
            pista.textContent = `😊 Tibio... El número es ${intento < numeroSecreto ? 'mayor' : 'menor'}.`;
            pista.className = 'pista tibio';
        } else {
            pista.textContent = `❄️ Frío. El número es ${intento < numeroSecreto ? 'mayor' : 'menor'}.`;
            pista.className = 'pista frio';
        }
        
        input.value = '';
        input.focus();
    };

    window.reiniciarNumero = function() {
        const input = document.getElementById('inputNumero');
        if (input) input.disabled = false;
        iniciarJuegoNumero();
    };

    // Permitir adivinar con Enter
    const inputNumero = document.getElementById('inputNumero');
    if (inputNumero) {
        inputNumero.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                window.adivinarNumero();
            }
        });
    }

    // ========== JUEGO 3: MEMORIA ==========
    let cartasMemoria = [];
    let cartasVolteadas = [];
    let movimientos = 0;
    let parejasEncontradas = 0;
    let bloqueado = false;

    const emojisMemoria = ['🎮', '🎯', '🎨', '🎭', '🎪', '🎬', '🎸', '🎹'];

    function iniciarJuegoMemoria() {
        movimientos = 0;
        parejasEncontradas = 0;
        cartasVolteadas = [];
        bloqueado = false;
        
        const elemMov = document.getElementById('movimientos');
        if (elemMov) elemMov.textContent = 0;
        
        const elemParejas = document.getElementById('parejas');
        if (elemParejas) elemParejas.textContent = '0/8';
        
        // Crear array de cartas duplicadas y mezclarlas
        cartasMemoria = [...emojisMemoria, ...emojisMemoria]
            .sort(() => Math.random() - 0.5)
            .map((emoji, index) => ({
                id: index,
                emoji: emoji,
                encontrada: false
            }));
        
        renderizarTableroMemoria();
    }

    function renderizarTableroMemoria() {
        const tablero = document.getElementById('tableroMemoria');
        if (!tablero) return;
        
        tablero.innerHTML = '';
        
        cartasMemoria.forEach(carta => {
            const divCarta = document.createElement('div');
            divCarta.className = 'carta';
            divCarta.dataset.id = carta.id;
            
            const contenido = document.createElement('div');
            contenido.className = 'contenido';
            contenido.textContent = carta.emoji;
            
            divCarta.appendChild(contenido);
            divCarta.addEventListener('click', () => voltearCarta(carta.id));
            
            if (carta.encontrada) {
                divCarta.classList.add('encontrada');
            }
            
            tablero.appendChild(divCarta);
        });
    }

    function voltearCarta(id) {
        if (bloqueado) return;
        
        const carta = cartasMemoria.find(c => c.id === id);
        if (!carta || carta.encontrada) return;
        
        const divCarta = document.querySelector(`[data-id="${id}"]`);
        if (!divCarta || divCarta.classList.contains('volteada')) return;
        
        divCarta.classList.add('volteada');
        cartasVolteadas.push({ id, emoji: carta.emoji, elemento: divCarta });
        
        if (cartasVolteadas.length === 2) {
            movimientos++;
            const elemMov = document.getElementById('movimientos');
            if (elemMov) elemMov.textContent = movimientos;
            
            verificarPareja();
        }
    }

    function verificarPareja() {
        bloqueado = true;
        
        const [carta1, carta2] = cartasVolteadas;
        
        if (carta1.emoji === carta2.emoji) {
            // ¡Pareja encontrada!
            setTimeout(() => {
                carta1.elemento.classList.remove('volteada');
                carta1.elemento.classList.add('encontrada');
                carta2.elemento.classList.remove('volteada');
                carta2.elemento.classList.add('encontrada');
                
                cartasMemoria.find(c => c.id === carta1.id).encontrada = true;
                cartasMemoria.find(c => c.id === carta2.id).encontrada = true;
                
                parejasEncontradas++;
                const elemParejas = document.getElementById('parejas');
                if (elemParejas) elemParejas.textContent = `${parejasEncontradas}/8`;
                
                cartasVolteadas = [];
                bloqueado = false;
                
                if (parejasEncontradas === 8) {
                    setTimeout(() => {
                        alert(`🎉 ¡Felicitaciones! Completaste el juego en ${movimientos} movimientos.`);
                    }, 500);
                }
            }, 500);
        } else {
            // No son pareja
            setTimeout(() => {
                carta1.elemento.classList.remove('volteada');
                carta2.elemento.classList.remove('volteada');
                cartasVolteadas = [];
                bloqueado = false;
            }, 1000);
        }
    }

    window.reiniciarMemoria = function() {
        iniciarJuegoMemoria();
    };

    // ========== JUEGO 4: BANDERAS ==========
    let correctasBanderas = 0;
    let incorrectasBanderas = 0;
    let numeroPreguntaBanderas = 1;
    let respuestaSeleccionada = false;

    const banderas = [
        { emoji: '🇦🇷', pais: 'Argentina' },
        { emoji: '🇧🇷', pais: 'Brasil' },
        { emoji: '🇨🇱', pais: 'Chile' },
        { emoji: '🇺🇾', pais: 'Uruguay' },
        { emoji: '🇵🇾', pais: 'Paraguay' },
        { emoji: '🇧🇴', pais: 'Bolivia' },
        { emoji: '🇵🇪', pais: 'Perú' },
        { emoji: '🇨🇴', pais: 'Colombia' },
        { emoji: '🇻🇪', pais: 'Venezuela' },
        { emoji: '🇪🇨', pais: 'Ecuador' },
        { emoji: '🇲🇽', pais: 'México' },
        { emoji: '🇪🇸', pais: 'España' },
        { emoji: '🇫🇷', pais: 'Francia' },
        { emoji: '🇮🇹', pais: 'Italia' },
        { emoji: '🇩🇪', pais: 'Alemania' },
        { emoji: '🇬🇧', pais: 'Reino Unido' },
        { emoji: '🇺🇸', pais: 'Estados Unidos' },
        { emoji: '🇨🇦', pais: 'Canadá' },
        { emoji: '🇯🇵', pais: 'Japón' },
        { emoji: '🇨🇳', pais: 'China' },
        { emoji: '🇰🇷', pais: 'Corea del Sur' },
        { emoji: '🇮🇳', pais: 'India' },
        { emoji: '🇦🇺', pais: 'Australia' },
        { emoji: '🇷🇺', pais: 'Rusia' },
        { emoji: '🇿🇦', pais: 'Sudáfrica' },
        { emoji: '🇪🇬', pais: 'Egipto' },
        { emoji: '🇳🇬', pais: 'Nigeria' },
        { emoji: '🇰🇪', pais: 'Kenia' },
        { emoji: '🇸🇪', pais: 'Suecia' },
        { emoji: '🇳🇴', pais: 'Noruega' }
    ];

    let banderaActual = null;
    let opcionesActuales = [];

    function iniciarJuegoBanderas() {
        correctasBanderas = 0;
        incorrectasBanderas = 0;
        numeroPreguntaBanderas = 1;
        
        actualizarStatsBanderas();
        generarPreguntaBandera();
    }

    function actualizarStatsBanderas() {
        const elemCorrectas = document.getElementById('correctas');
        const elemIncorrectas = document.getElementById('incorrectas');
        const elemNumero = document.getElementById('numeroPregunta');
        
        if (elemCorrectas) elemCorrectas.textContent = correctasBanderas;
        if (elemIncorrectas) elemIncorrectas.textContent = incorrectasBanderas;
        if (elemNumero) elemNumero.textContent = numeroPreguntaBanderas;
    }

    function generarPreguntaBandera() {
        respuestaSeleccionada = false;
        
        // Seleccionar bandera aleatoria
        banderaActual = banderas[Math.floor(Math.random() * banderas.length)];
        
        // Generar 2 opciones incorrectas
        const opcionesIncorrectas = banderas
            .filter(b => b.pais !== banderaActual.pais)
            .sort(() => Math.random() - 0.5)
            .slice(0, 2);
        
        // Mezclar opciones
        opcionesActuales = [banderaActual, ...opcionesIncorrectas]
            .sort(() => Math.random() - 0.5);
        
        // Renderizar
        const contenedorBandera = document.getElementById('contenedorBandera');
        if (contenedorBandera) {
            contenedorBandera.innerHTML = `
                <p style="color: rgb(77, 4, 77); font-size: 1.3rem; font-weight: bold; margin-bottom: 15px;">
                    ¿De qué país es esta bandera?
                </p>
                <div class="bandera-display">${banderaActual.emoji}</div>
            `;
        }
        
        const opcionesBanderas = document.getElementById('opcionesBanderas');
        if (opcionesBanderas) {
            opcionesBanderas.innerHTML = '';
            
            opcionesActuales.forEach(opcion => {
                const btn = document.createElement('button');
                btn.className = 'opcion-bandera';
                btn.textContent = opcion.pais;
                btn.onclick = () => verificarRespuestaBandera(opcion.pais);
                opcionesBanderas.appendChild(btn);
            });
        }
        
        const resultadoBandera = document.getElementById('resultadoBandera');
        if (resultadoBandera) resultadoBandera.textContent = '';
    }

    function verificarRespuestaBandera(paisSeleccionado) {
        if (respuestaSeleccionada) return;
        respuestaSeleccionada = true;
        
        const botones = document.querySelectorAll('.opcion-bandera');
        const resultadoBandera = document.getElementById('resultadoBandera');
        
        botones.forEach(btn => {
            btn.style.pointerEvents = 'none';
            
            if (btn.textContent === banderaActual.pais) {
                btn.classList.add('correcta');
            }
            
            if (btn.textContent === paisSeleccionado && paisSeleccionado !== banderaActual.pais) {
                btn.classList.add('incorrecta');
            }
        });
        
        if (paisSeleccionado === banderaActual.pais) {
            correctasBanderas++;
            if (resultadoBandera) {
                resultadoBandera.textContent = '¡Correcto! 🎉';
                resultadoBandera.style.color = '#2e7d32';
            }
        } else {
            incorrectasBanderas++;
            if (resultadoBandera) {
                resultadoBandera.textContent = `Incorrecto. La respuesta era ${banderaActual.pais}.`;
                resultadoBandera.style.color = '#c62828';
            }
        }
        
        numeroPreguntaBanderas++;
        actualizarStatsBanderas();
        
        setTimeout(() => {
            generarPreguntaBandera();
        }, 2500);
    }

    window.reiniciarBanderas = function() {
        iniciarJuegoBanderas();
    };

});
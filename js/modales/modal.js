function inicializarModal() {
    if (!document.getElementById('successModal')) {
        const modalHTML = `
        <div class="modal fade" id="successModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content text-center p-4">
                    <div class="mb-3">
                        <i class="bi bi-check-circle-fill" style="font-size: 4rem; color:#28a745;"></i>
                    </div>
                    <h4 id="successTitle" class="mb-2">¡Operación exitosa!</h4>
                    <p id="successMessage" class="mb-4">Todo ha sido completado correctamente.</p>
                    <button class="btn btn-success w-100" data-bs-dismiss="modal">Aceptar</button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
}

// Función para mostrar modal de éxito
export function exitoModal(title, message) {
    inicializarModal();
    
    if (title) {
        document.getElementById('successTitle').textContent = title;
    }
    if (message) {
        document.getElementById('successMessage').textContent = message;
    }
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
}

// Función para modal de error
export function errorModal(title, message) {
    if (!document.getElementById('errorModal')) {
        const modalHTML = `
        <div class="modal fade" id="errorModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content text-center p-4">
                    <div class="mb-3">
                        <i class="bi bi-x-circle-fill" style="font-size: 4rem; color:#dc3545;"></i>
                    </div>
                    <h4 id="errorTitle" class="mb-2">Error</h4>
                    <p id="errorMessage" class="mb-4">Ha ocurrido un error.</p>
                    <button class="btn btn-danger w-100" data-bs-dismiss="modal">Cerrar</button>
                </div>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }
    
    if (title) {
        document.getElementById('errorTitle').textContent = title;
    }
    if (message) {
        document.getElementById('errorMessage').textContent = message;
    }
    
    const modal = new bootstrap.Modal(document.getElementById('errorModal'));
    modal.show();
}
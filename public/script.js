function openModal() {
    const openButtons = document.querySelectorAll(".rename-button");
    const closeButtons = document.querySelectorAll(".cancel-button");

    openButtons.forEach((button) => {
        button.addEventListener("click", () => {

            const fileId = button.dataset.fileId;
            const modal = document.querySelector(`#dialog-rename[data-file-id="${fileId}"]`);
            modal.showModal();
        });
    });

    closeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const fileId = button.dataset.fileId;
            const modal = document.querySelector(`#dialog-rename[data-file-id="${fileId}"]`);
            modal.close();
        });
    });
};

openModal();
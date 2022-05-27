export function disablePointer(disable) {
    const rootContainer = document.querySelectorAll('.dashboard')[0];

    if (rootContainer) {
        if (disable == true) {
            rootContainer.classList.add('disable-pointer');
        }
        if (disable == false) {
            rootContainer.classList.remove('disable-pointer');
        }
    }
}
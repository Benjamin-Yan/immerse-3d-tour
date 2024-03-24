const sliderEl = document.getElementById("range2") as HTMLInputElement;
const sliderValue = document.getElementById("vol") as HTMLElement;

sliderEl.addEventListener("input", (event: Event) => {
    const tempSliderValue = (event.target as HTMLInputElement).value;
    sliderValue.textContent = tempSliderValue;

    const progress = (parseInt(tempSliderValue) / parseInt(sliderEl.max)) * 100;

    sliderEl.style.background = `linear-gradient(to right, #f50 ${progress}%, #ccc ${progress}%)`;
});

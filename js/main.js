document.addEventListener("DOMContentLoaded", function () {

    let hueInput = document.querySelector('.picker-ranges-hue__input');
    let saturationInput = document.querySelector('.picker-ranges-saturation__input');
    let lightnessInput = document.querySelector('.picker-ranges-lightness__input');
    let addButton = document.querySelector('.picker-buttons__add-button');

    hueInput.value = Math.random() * 360;
    hueInput.addEventListener('input', updatePaletteSample);
    saturationInput.addEventListener('input', updatePaletteSample);
    lightnessInput.addEventListener('input', updatePaletteSample);
    addButton.addEventListener('click', newPaletteSample);

    newPaletteSample();

    function getHSLValues() {

        let hueValue = hueInput.value;
        let saturationValue = saturationInput.value;
        let lightnessValue = lightnessInput.value;
        let HSLString = 'hsl(' + hueValue + ', ' + saturationValue + '%' + ', ' + lightnessValue + '%)';

        return [hueValue, saturationValue, lightnessValue, HSLString];
    }

    function updatePaletteSample() {
        document.querySelector('.palette-sample').style.backgroundColor = getHSLValues()[3];
        document.querySelector('.palette-sample__value').innerText = HSLToHex(getHSLValues()[0], getHSLValues()[1], getHSLValues()[2]);
    }

    function newPaletteSample() {
        let colorPalette = document.querySelector('.color-palette');

        if (colorPalette.childElementCount < 6) {
            let div = document.createElement('div');
            div.className = 'palette-sample';
            div.style.backgroundColor = getHSLValues()[3];
            colorPalette.prepend(div);

            let span = document.createElement('span');
            span.className = 'palette-sample__value';
            span.innerText = HSLToHex(getHSLValues()[0], getHSLValues()[1], getHSLValues()[2]);
            div.appendChild(span);

            let button = document.createElement('button');
            button.className = 'palette-sample__button';
            button.innerHTML = '<img class="palette-sample__button-img" src="img/minus.svg" alt="remove color sample button">';
            div.appendChild(button);
            button.addEventListener('click', function () {
                if (colorPalette.childElementCount > 1) {
                    div.parentElement.removeChild(div);
                } else {
                    alert("You can't remove the only color sample.")
                }
            });
        } else {
            alert("You can only add 6 color samples at the time.")
        }
    }

    /* HSLToHex function based on the article:
    https://css-tricks.com/converting-color-spaces-in-javascript/ */

    function HSLToHex(hue, saturation, lightness) {

        saturation = saturation / 100;
        lightness = lightness / 100;

        let c = (1 - Math.abs(2 * lightness - 1)) * saturation;
        let x = c * (1 - Math.abs((hue / 60) % 2 - 1));
        let m = lightness - c/2;
        let red = 0;
        let green = 0;
        let blue = 0;

        if (0 <= hue && hue < 60) {
            red = c; green = x; blue = 0;
        } else if (60 <= hue && hue < 120) {
            red = x; green = c; blue = 0;
        } else if (120 <= hue && hue < 180) {
            red = 0; green = c; blue = x;
        } else if (180 <= hue && hue < 240) {
            red = 0; green = x; blue = c;
        } else if (240 <= hue && hue < 300) {
            red = x; green = 0; blue = c;
        } else if (300 <= hue && hue < 360) {
            red = c; green = 0; blue = x;
        }

        red = Math.round((red + m) * 255).toString(16);
        green = Math.round((green + m) * 255).toString(16);
        blue = Math.round((blue + m) * 255).toString(16);


        if (red.length == 1) {
            red = "0" + red;
        }
        if (green.length == 1) {
            green = "0" + green;
        }
        if (blue.length == 1) {
            blue = "0" + blue;
        }

        return "#" + red + green + blue;
    }
});

class App {
  constructor() {
    this.samples = JSON.parse(localStorage.getItem('samples')) || [];

    this.hexValue = '';
    this.id = 0;

    this.$colorPalette = document.querySelector('.color-palette');
    this.$hueInput = document.querySelector('.picker-ranges-hue__input');
    this.$saturationInput = document.querySelector('.picker-ranges-saturation__input');
    this.$lightnessInput = document.querySelector('.picker-ranges-lightness__input');

    this.displaySamples();
    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener('click', event => {
      this.addSample(event);
      this.selectSample(event);
      this.deleteSample(event);
    });

    document.body.addEventListener('input', event => {
      this.updateHexValue();
    });
  }

  getInputValues() {
    const hue = this.$hueInput.value;
    const saturation = this.$saturationInput.value;
    const lightness = this.$lightnessInput.value;

    return {hue, saturation, lightness};
  }

  updateHexValue() {
    const HSLValues = this.getInputValues();
    this.hexValue = this.HSLToHex(HSLValues);
  }

  addSample(event) {
    const $addButton = event.target.closest(".picker-buttons__add-button");
    if (!$addButton) return;

    const newSample = {
      hexValue: this.hexValue,
      id: this.samples.length > 0 ? this.samples[this.samples.length - 1].id + 1 : 1
    };
    this.samples = [...this.samples, newSample];
    this.renderSamples();
    console.log(this.hexValue);
  }

  selectSample(event) {
    const $selectedSample = event.target.closest(".palette-sample");
    if (!$selectedSample) return;
    this.hexValue = this.RGBToHex($selectedSample.style.backgroundColor);
    this.id = $selectedSample.dataset.id;
    console.log(this.hexValue);
  }

  editSample() {
    const hexValue = this.hexValue;
    this.samples = this.samples.map(sample =>
      sample.id === Number(this.id) ? { ...sample, hexValue } : sample
    );
    this.renderSamples();
  }
  deleteSample(event) {
    const deleteButton = event.target.closest('.palette-sample__button');
    if (!deleteButton) return;

    const sampleId = deleteButton.dataset.id;
    this.samples = this.samples.filter(sample => sample.id !== Number(sampleId));
    this.renderSamples();
  }

  renderSamples() {
    this.saveSamples();
    this.displaySamples();
  }

  saveSamples() {
    localStorage.setItem('samples', JSON.stringify(this.samples));
  }

  displaySamples() {
    this.$colorPalette.innerHTML = this.samples
      .map(
        sample => `
          <div class="palette-sample"
               data-id="${sample.id}"
               style="background-color: ${sample.hexValue};">
            <span class="palette-sample__value">${sample.hexValue}</span>
            <button class="palette-sample__button" data-id="${sample.id}">
              <img class="palette-sample__button-img" src="img/minus.svg" alt="remove color sample">
            </button>
          </div>`
      )
      .join("");
  }

  HSLToHex({ hue, saturation, lightness }) {

    // Method based on the article:
    // https://css-tricks.com/converting-color-spaces-in-javascript/

    saturation = saturation / 100;
    lightness = lightness / 100;

    let c = (1 - Math.abs(2 * lightness - 1)) * saturation;
    let x = c * (1 - Math.abs((hue / 60) % 2 - 1));
    let m = lightness - c / 2;
    let red = 0;
    let green = 0;
    let blue = 0;

    if (0 <= hue && hue < 60) {
      red = c;
      green = x;
      blue = 0;
    } else if (60 <= hue && hue < 120) {
      red = x;
      green = c;
      blue = 0;
    } else if (120 <= hue && hue < 180) {
      red = 0;
      green = c;
      blue = x;
    } else if (180 <= hue && hue < 240) {
      red = 0;
      green = x;
      blue = c;
    } else if (240 <= hue && hue < 300) {
      red = x;
      green = 0;
      blue = c;
    } else if (300 <= hue && hue < 360) {
      red = c;
      green = 0;
      blue = x;
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

  RGBToHex(rgbString) {

    // Method based on the article:
    // https://css-tricks.com/converting-color-spaces-in-javascript/

    let sep = rgbString.indexOf(",") > -1 ? "," : " ";
    rgbString = rgbString.substr(4).split(")")[0].split(sep);

    let r = (+rgbString[0]).toString(16),
      g = (+rgbString[1]).toString(16),
      b = (+rgbString [2]).toString(16);

    if (r.length == 1)
      r = "0" + r;
    if (g.length == 1)
      g = "0" + g;
    if (b.length == 1)
      b = "0" + b;

    return "#" + r + g + b;
  }
}


new App();

// document.addEventListener("DOMContentLoaded", function () {
//
//   let hueInput = document.querySelector('.picker-ranges-hue__input');
//   let saturationInput = document.querySelector('.picker-ranges-saturation__input');
//   let lightnessInput = document.querySelector('.picker-ranges-lightness__input');
//   let addButton = document.querySelector('.picker-buttons__add-button');
//
//   hueInput.value = Math.random() * 360;
//   hueInput.addEventListener('input', updatePaletteSample);
//   saturationInput.addEventListener('input', updatePaletteSample);
//   lightnessInput.addEventListener('input', updatePaletteSample);
//   addButton.addEventListener('click', newPaletteSample);
//
//   newPaletteSample();
//
//   function getHSLValues() {
//
//     let hueValue = hueInput.value;
//     let saturationValue = saturationInput.value;
//     let lightnessValue = lightnessInput.value;
//     let HSLString = 'hsl(' + hueValue + ', ' + saturationValue + '%' + ', ' + lightnessValue + '%)';
//
//     return [hueValue, saturationValue, lightnessValue, HSLString];
//   }
//
//   function updatePaletteSample() {
//     document.querySelector('.palette-sample').style.backgroundColor = getHSLValues()[3];
//     document.querySelector('.palette-sample__value').innerText = HSLToHex(getHSLValues()[0], getHSLValues()[1], getHSLValues()[2]);
//   }
//
//   function newPaletteSample() {
//     let colorPalette = document.querySelector('.color-palette');
//
//     if (colorPalette.childElementCount < 6) {
//       let div = document.createElement('div');
//       div.className = 'palette-sample';
//       div.style.backgroundColor = getHSLValues()[3];
//       colorPalette.prepend(div);
//
//       let span = document.createElement('span');
//       span.className = 'palette-sample__value';
//       span.innerText = HSLToHex(getHSLValues()[0], getHSLValues()[1], getHSLValues()[2]);
//       div.appendChild(span);
//
//       let button = document.createElement('button');
//       button.className = 'palette-sample__button';
//       button.innerHTML = '<img class="palette-sample__button-img" src="img/minus.svg" alt="remove color sample button">';
//       div.appendChild(button);
//       button.addEventListener('click', function () {
//         if (colorPalette.childElementCount > 1) {
//           div.parentElement.removeChild(div);
//         } else {
//           alert("You can't remove the only color sample.")
//         }
//       });
//     } else {
//       alert("You can only add 6 color samples at the time.")
//     }
//   }
//
  /* HSLToHex function based on the article:
  https://css-tricks.com/converting-color-spaces-in-javascript/ */

  // function HSLToHex(hue, saturation, lightness) {
  //
  //   saturation = saturation / 100;
  //   lightness = lightness / 100;
  //
  //   let c = (1 - Math.abs(2 * lightness - 1)) * saturation;
  //   let x = c * (1 - Math.abs((hue / 60) % 2 - 1));
  //   let m = lightness - c / 2;
  //   let red = 0;
  //   let green = 0;
  //   let blue = 0;
  //
  //   if (0 <= hue && hue < 60) {
  //     red = c;
  //     green = x;
  //     blue = 0;
  //   } else if (60 <= hue && hue < 120) {
  //     red = x;
  //     green = c;
  //     blue = 0;
  //   } else if (120 <= hue && hue < 180) {
  //     red = 0;
  //     green = c;
  //     blue = x;
  //   } else if (180 <= hue && hue < 240) {
  //     red = 0;
  //     green = x;
  //     blue = c;
  //   } else if (240 <= hue && hue < 300) {
  //     red = x;
  //     green = 0;
  //     blue = c;
  //   } else if (300 <= hue && hue < 360) {
  //     red = c;
  //     green = 0;
  //     blue = x;
  //   }
  //
  //   red = Math.round((red + m) * 255).toString(16);
  //   green = Math.round((green + m) * 255).toString(16);
  //   blue = Math.round((blue + m) * 255).toString(16);
  //
  //
  //   if (red.length == 1) {
  //     red = "0" + red;
  //   }
  //   if (green.length == 1) {
  //     green = "0" + green;
  //   }
  //   if (blue.length == 1) {
  //     blue = "0" + blue;
  //   }
  //
  //   return "#" + red + green + blue;
  // }
// });

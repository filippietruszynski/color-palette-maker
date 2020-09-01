import './main.scss';
import './fonts/roboto-light-webfont.woff';
import hslToHex from './utilities/hslToHex.js';

class App {
  constructor() {
    this.samples = JSON.parse(localStorage.getItem('samples')) || [{hue: 232, saturation: 67, lightness: 51, id: 1}];

    this.hue = 0;
    this.saturation = 0;
    this.lightness = 0;
    this.id = 0;

    this.$colorPalette = document.querySelector('.color-palette');
    this.$hueInput = document.querySelector('.picker-ranges-hue__input');
    this.$saturationInput = document.querySelector('.picker-ranges-saturation__input');
    this.$lightnessInput = document.querySelector('.picker-ranges-lightness__input');
    this.$addButton = document.querySelector('.picker-buttons__add-button');

    this.displaySamples();
    this.addEventListeners();
  }

  addEventListeners() {
    this.$colorPalette.addEventListener('click', event => {
      this.selectSample(event);
      this.deleteSample(event);
    });

    [this.$hueInput, this.$saturationInput, this.$lightnessInput].forEach(element => {
      element.addEventListener('input', () => {
        this.getInputValues();
        this.editSample()
      });
    });

    this.$addButton.addEventListener('click', () => {
      this.addSample();
    });
  }

  getInputValues() {
    this.hue = this.$hueInput.value;
    this.saturation = this.$saturationInput.value;
    this.lightness = this.$lightnessInput.value;
  }

  setInputValues() {
    this.$hueInput.value = this.hue;
    this.$lightnessInput.value = this.lightness;
    this.$saturationInput.value = this.saturation;
  }

  addSample() {
    const newSample = {
      hue: this.hue,
      saturation: this.saturation,
      lightness: this.lightness,
      id: this.samples.length > 0 ? this.samples[this.samples.length - 1].id + 1 : 1
    };

    this.samples = [...this.samples, newSample];
    this.renderSamples();
  }

  selectSample(event) {
    const $selectedSample = event.target.closest('.palette-sample');
    if (!$selectedSample) return;

    const selectedSampleId = $selectedSample.dataset.id;
    const selectedSample = this.samples.find(sample => Number(selectedSampleId) === Number(sample.id));


    this.hue = selectedSample.hue;
    this.saturation = selectedSample.saturation;
    this.lightness = selectedSample.lightness;
    this.id = selectedSampleId;

    this.setInputValues();
  }

  editSample() {
    const hue = this.hue;
    const saturation = this.saturation;
    const lightness = this.lightness;

    this.samples = this.samples.map(sample =>
      sample.id === Number(this.id) ? {...sample, hue, saturation, lightness} : sample
    );
    this.renderSamples();
  }

  deleteSample(event) {
    const deleteButton = event.target.closest('.palette-sample__button');
    if (!deleteButton) return;

    const sampleId = deleteButton.parentElement.dataset.id;
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
    const removeSampleButton = require('./icons/minus.svg');

    this.$colorPalette.innerHTML = this.samples
      .map(
        sample => `
          <div class="palette-sample"
               data-id="${sample.id}"
               style="background-color: hsl(${sample.hue}, ${sample.saturation}%, ${sample.lightness}%);">
            <span class="palette-sample__value">${hslToHex(sample.hue, sample.saturation, sample.lightness)}</span>
            <button class="palette-sample__button" data-id="${sample.id}">
              <img class="palette-sample__button-img" src="${removeSampleButton}" alt="remove color sample">
            </button>
          </div>`
      )
      .join("");
  }
}

export default App;
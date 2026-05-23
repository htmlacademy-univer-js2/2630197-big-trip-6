import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import { getFullDate, capitalizeWord, getDestinationById, getOfferById } from '../utils.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import he from 'he';

function createFormEditingTemplate(point, destinations, allOffers, typeOffers) {
  const {basePrice, dateFrom, dateTo, destination, offers, type, isSaving, isDeleting, isDisabled, isPointCreation} = point;
  const pointTypeOffers = typeOffers.map((id) => getOfferById(allOffers, id));
  const destinationInfo = getDestinationById(destinations, destination);
  const eventTypes = Array.from(allOffers.map((item) => item.type));
  const renderDestinationsList = destinations.map((dest) => `<option value="${dest.name}"></option>`).join('');
  const isValid = getFullDate(dateFrom) !== 'Invalid Date';
  const startDate = isValid ? getFullDate(dateFrom) : '';
  const endDate = isValid ? getFullDate(dateTo) : '';
  const deleteText = isDeleting ? 'Deleting...' : 'Delete';
  const saveText = isSaving ? 'Saving...' : 'Save';

  return `<li class="trip-events__item">
              <form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>
                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${eventTypes.map((types) => `<div class="event__type-item">
                          <input id="event-type-${types.toLowerCase()}-1" class="event__${types.toLowerCase()}-input ${isDisabled ? 'disabled' : ''} visually-hidden" type="radio" name="event-type" value="${types.toLowerCase()}">
                          <label class="event__type-label  event__type-label--${types.toLowerCase()}" for="event-type-${types.toLowerCase()}-1">${capitalizeWord(types)}</label>
                        </div>`).join('')}
                      </fieldset>
                    </div>
                  </div>
                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" ${isDisabled ? 'disabled' : ''} name="event-destination" value="${he.encode(destinationInfo ? destinationInfo.name : '')}" list="destination-list-1" required>
                    <datalist id="destination-list-1">
                      ${renderDestinationsList}
                    </datalist>
                  </div>
                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" ${isDisabled ? 'disabled' : ''} value="${startDate}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" ${isDisabled ? 'disabled' : ''} value="${endDate}">
                  </div>
                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" ${isDisabled ? 'disabled' : ''} value="${basePrice}">
                  </div>
                  <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${saveText}</button>
                  <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isPointCreation ? 'Cancel' : deleteText}</button>
                  ${isValid ? `<button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>` : ''}
                </header>
                <section class="event__details">
                  ${pointTypeOffers.length > 0 ? `<section class="event__section  event__section--offers">
                    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
                    <div class="event__available-offers">
                    ${pointTypeOffers.map((offer) => `<div class="event__offer-selector">
                      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.toLowerCase()}" type="checkbox" name="event-offer-${offer.title.toLowerCase()}" value="${offer.id}" ${offers.includes(offer.id) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''}>
                      <label class="event__offer-label" for="event-offer-${offer.title.toLowerCase()}">
                        <span class="event__offer-title">${offer.title}</span>
                          &plus;&euro;&nbsp;
                          <span class="event__offer-price">${offer.price}</span>
                        </label>
                      </div>`).join('')}
                    </div>
                  </section>` : ''}
                  ${destinationInfo && destinationInfo.description !== '' ? `<section class="event__section  event__section--destination">
                    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
                    <p class="event__destination-description">${destinationInfo.description}</p>` : ''}
                    ${destinationInfo && destinationInfo.pictures.length > 0 ? `<div class="event__photos-container">
                      <div class="event__photos-tape">
                      ${destinationInfo.pictures.map((image) => `<img class="event__photo" src="${image.src}" alt="${image.description}">`).join('')}
                      </div>
                    </div>
                  </section>` : ''}
                </section>
              </form>
            </li>`;
}

export default class FormEditing extends AbstractStatefulView {
  #point = null;
  #offers = null;
  #destinations = [];
  #formSubmit = null;
  #formReset = null;
  #datepickerStart = null;
  #datepickerEnd = null;
  #editDelete = null;
  #typeOffers = null;

  constructor({point, offers, destinations, onFormSubmit, onFormReset = null, typeOffers, onDeleteClick}) {
    super();
    this.#point = point;
    this._setState(FormEditing.parsePointToState(point, point.destination));
    this.#offers = offers;
    this.#destinations = destinations;
    this.#formSubmit = onFormSubmit;
    this.#formReset = onFormReset;
    this.#editDelete = onDeleteClick;
    this.#typeOffers = typeOffers;

    this._restoreHandlers();
  }

  get template() {
    return createFormEditingTemplate(this._state, this.#destinations, this.#offers, this.#typeOffers);
  }

  #onFormSubmit = (evt) => {
    evt.preventDefault();
    this.#formSubmit(this._state);
  };

  #onFormReset = (evt) => {
    evt.preventDefault();
    this.#formReset();
  };

  #onEditDelete = (evt) => {
    evt.preventDefault();
    this.#editDelete(this.#point);
  };

  #onPointTypeChange = (evt) => {
    evt.preventDefault();
    const targetType = evt.target.value;
    const typeOffers = this.#offers.find((item) => item.type === targetType).offers.map((offer) => offer.id);
    this.#typeOffers = typeOffers;
    this.updateElement({
      type: targetType,
      offers: []
    });
  };

  #onDestinationChange = (evt) => {
    evt.preventDefault();
    const newDestination = this.#destinations.find((destination) => destination.name === evt.target.value);
    if (newDestination) {
      this.updateElement({
        destination: newDestination.id
      });
    } else {
      evt.target.value = '';
    }
  };

  #onPriceInput = (evt) => {
    evt.preventDefault();
    evt.target.value = Number(evt.target.value.replace(/[^0-9]/g, ''));
    this._setState({
      basePrice: Number(evt.target.value)
    });
  };

  reset(point) {
    this.updateElement(point);
  }

  #onDateFromChange = ([userDate]) => {
    this._setState({
      dateFrom: userDate
    });

    this.#datepickerEnd.set('minDate', this._state.dateFrom);
  };

  #onDateToChange = ([userDate]) => {
    this._setState({
      dateTo: userDate
    });
  };

  #setDatepicker() {
    this.#datepickerStart = flatpickr(
      this.element.querySelector('input[name=\'event-start-time\']'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateFrom,
        onChange: this.#onDateFromChange
      }
    );

    this.#datepickerEnd = flatpickr(
      this.element.querySelector('input[name=\'event-end-time\']'),
      {
        dateFormat: 'd/m/y H:i',
        enableTime: true,
        'time_24hr': true,
        defaultDate: this._state.dateTo,
        onChange: this.#onDateToChange,
        minDate: this._state.dateFrom
      }
    );
  }

  _restoreHandlers() {
    this.element.querySelector('form').addEventListener('submit', this.#onFormSubmit);
    if (this.#formReset) {
      this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#onFormReset);
    }
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#onEditDelete);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#onPointTypeChange);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#onDestinationChange);
    this.element.querySelector('.event__input--price').addEventListener('input', this.#onPriceInput);

    const typeOffers = this.element.querySelectorAll('.event__offer-checkbox');
    typeOffers.forEach((offer) => offer.addEventListener('change', this.#onOffersChange));
    this.#setDatepicker();
  }

  #onOffersChange = (evt) => {
    const offers = this._state.offers;
    const checkedOffers = offers.includes(evt.target.value) ? offers.filter((offerId) => offerId !== evt.target.value) : [...offers, evt.target.value];
    this._setState({ offers: checkedOffers });
  };

  static parsePointToState(point, destinationInfo) {
    return {
      ...point,
      destination: destinationInfo,
    };
  }
}

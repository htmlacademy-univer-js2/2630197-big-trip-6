import FormEditing from '../view/form-editing-view.js';
import { render, remove, RenderPosition } from '../framework/render';
import { UserAction, UpdateType, FilterType } from '../consts.js';
import { getOffersByType } from '../utils.js';

export default class PointCreationPresenter {
  #pointListComponent = null;
  #pointEditComponent = null;
  #filterModel = null;
  #addButton = null;
  #pointsModel = null;
  #point = null;
  #onDataChange = null;
  #onModeChange = null;

  constructor({ filterModel, pointListComponent, point, pointsModel, addButton, onDataChange, onModeChange }) {
    this.#filterModel = filterModel;
    this.#pointListComponent = pointListComponent;
    this.#point = point;
    this.#pointsModel = pointsModel;
    this.#addButton = addButton;
    this.#onDataChange = onDataChange;
    this.#onModeChange = onModeChange;

    this.#addButton.addEventListener('click', this.#onAddButtonClick);
  }

  init() {
    this.#pointEditComponent = new FormEditing({
      point: this.#point,
      typeOffers: getOffersByType(this.#pointsModel.offers, this.#point.type),
      offers: this.#pointsModel.offers,
      destinations: this.#pointsModel.destinations,
      onFormSubmit: this.#onFormSubmit.bind(this),
      onDeleteClick: this.destroy
    });

    this.#pointEditComponent.updateElement({ isPointCreation: true });
    render(this.#pointEditComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  #onAddButtonClick = () => {
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this.#onModeChange();
    document.addEventListener('keydown', this.#onEscKeydown);
    this.init();
    this.#addButton.disabled = true;
  };

  #onFormSubmit = (update) => {
    this.#onDataChange(
      UserAction.ADD_POINT,
      UpdateType.MAJOR,
      update
    );

    if (update.isSaving) {
      this.#filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      document.removeEventListener('keydown', this.#onEscKeydown);
      this.destroy();
    }
  };

  #onEscKeydown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      this.#filterModel.setFilter(UpdateType.MINOR, FilterType.EVERYTHING);
      this.destroy();
      document.removeEventListener('keydown', this.#onEscKeydown);
    }
  };

  destroy = () => {
    remove(this.#pointEditComponent);
    this.#addButton.disabled = false;
  };

  setAborting() {
    this.#pointEditComponent.shake(this.#pointEditComponent.updateElement({ isSaving: false, isDisabled: false }));
  }

  setSaving() {
    this.#pointEditComponent.updateElement({isSaving: true, isDisabled: true });
  }
}

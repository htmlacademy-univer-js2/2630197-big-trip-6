import RoutePoint from '../view/route-point-view.js';
import FormEditing from '../view/form-editing-view.js';
import {render, replace, remove} from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import { Mode, UserAction, UpdateType } from '../consts.js';

export default class PointPresenter {
  #destinations = null;
  #offers = null;
  #point = null;
  #pointItem = null;
  #editFormItem = null;
  #pointsListComponent = null;
  #onDataChange = null;
  #onModeChange = null;
  #mode = Mode.DEFAULT;
  #typeOffers = null;

  #onEscKey = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault();
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#onEscKey);
    }
  };

  constructor({ destinations, offers, pointsListComponent, changeDataOnFavorite, changeMode, typeOffers }) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#pointsListComponent = pointsListComponent;
    this.#onDataChange = changeDataOnFavorite;
    this.#onModeChange = changeMode;
    this.#typeOffers = typeOffers;
  }

  destroy(){
    remove(this.#pointItem);
    remove(this.#editFormItem);
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointItem;
    const prevEditFormComponent = this.#editFormItem;

    this.#pointItem = new RoutePoint({point: this.#point,
      destinations: this.#destinations,
      offers: this.#offers,
      onRollButtonClick: this.#onEditFormReset.bind(this),
      onFavoriteClick: this.#addToFaivorite
    });

    this.#editFormItem = new FormEditing({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#onEditFormSubmit.bind(this),
      onFormReset: this.#replaceEditFormToPoint.bind(this),
      typeOffers: this.#typeOffers,
      onDeleteClick: this.#onDeleteButtonClick
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointItem, this.#pointsListComponent.element);
      return;
    }

    if (this.#pointsListComponent.element.contains(prevPointComponent.element)) {
      replace(this.#pointItem, prevPointComponent);
    }

    if (this.#pointsListComponent.element.contains(prevEditFormComponent.element)) {
      replace(this.#editFormItem, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    replace(this.#editFormItem, this.#pointItem);
    this.#onModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointItem, this.#editFormItem);
    document.removeEventListener('keydown', this.#onEscKey);
    this.#mode = Mode.DEFAULT;
  }

  #addToFaivorite = (point) => {
    this.#onDataChange(UserAction.UPDATE_POINT, UpdateType.PATCH, {...point, isFavorite: !point.isFavorite});
  };

  #onEditFormSubmit = async (point) => {
    await this.#onDataChange(UserAction.UPDATE_POINT, UpdateType.MINOR, point);
    if (point.isSaving) {
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#onEscKey);
    }
  };

  #onEditFormReset = () => {
    this.#replacePointToEditForm();
    document.addEventListener('keydown', this.#onEscKey);
  };

  #onDeleteButtonClick = (point) => {
    this.#onDataChange(UserAction.DELETE_POINT, UpdateType.MINOR, point);
  };

  setAborting() {
    if (this.#mode === Mode.DEFAULT) {
      this.#pointItem.shake();
      return;
    }

    this.#editFormItem.shake(this.#editFormItem.updateElement({ isDisabled: false, isSaving: false, isDeleting: false }));
  }

  setSaving() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormItem.updateElement({ isDisabled: true, isSaving: true });
    }
  }

  setDeleting() {
    if (this.#mode === Mode.EDITING) {
      this.#editFormItem.updateElement({ isDisabled: true, isDeleting: true });
    }
  }
}

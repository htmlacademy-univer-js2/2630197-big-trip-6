import RoutePoint from '../view/route-point-view.js';
import FormEditing from '../view/form-editing-view.js';
import {render, replace, remove} from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import { Mode } from '../consts.js';

export class PointPresenter {
  #destinations = null;
  #offers = null;
  #point = null;
  #pointItem = null;
  #editFormItem = null;
  #pointsListComponent = null;
  #handleDataChange = null;
  #handleModeChange = null;
  #mode = Mode.DEFAULT;

  #escKeyHandler = (event) => {
    if (isEscapeKey(event)) {
      event.preventDefault();
      this.#editFormItem.reset(this.#point);
      this.#replaceEditFormToPoint();
      document.removeEventListener('keydown', this.#escKeyHandler);
    }
  };

  constructor({destinations, offers, pointsListComponent, changeDataOnFavorite, changeMode}) {
    this.#destinations = destinations;
    this.#offers = offers;
    this.#pointsListComponent = pointsListComponent;
    this.#handleDataChange = changeDataOnFavorite;
    this.#handleModeChange = changeMode;
  }

  destroy(){
    remove(this.#pointItem);
    remove(this.#editFormItem);
  }

  init(point) {
    this.#point = point;
    const prevPointComponent = this.#pointItem;
    const prevEditFormComponent = this.#editFormItem;

    this.#pointItem = new RoutePoint({point: this.#point, destinations: this.#destinations,
      onRollButtonClick:() => {
        this.#replacePointToEditForm();
      },
      onFavoriteClick: () => {
        this.#addToFaivorite();
      }
    });

    this.#editFormItem = new FormEditing({
      point: this.#point,
      offers: this.#offers,
      destinations: this.#destinations,
      onFormSubmit: this.#editFormSubmitHandler,
      onFormReset: this.#editFormResetHandler
    });

    if (prevPointComponent === null || prevEditFormComponent === null) {
      render(this.#pointItem, this.#pointsListComponent.element);
      return;
    }

    if (this.#mode === Mode.DEFAULT) {
      replace(this.#pointItem, prevPointComponent);
    }

    if (this.#mode === Mode.EDITING) {
      replace(this.#editFormItem, prevEditFormComponent);
    }

    remove(prevPointComponent);
    remove(prevEditFormComponent);
  }

  resetView() {
    if(this.#mode !== Mode.DEFAULT) {
      this.#editFormItem.reset(this.#point);
      this.#replaceEditFormToPoint();
    }
  }

  #replacePointToEditForm() {
    replace(this.#editFormItem, this.#pointItem);
    document.addEventListener('keydown', this.#escKeyHandler);
    this.#handleModeChange();
    this.#mode = Mode.EDITING;
  }

  #replaceEditFormToPoint() {
    replace(this.#pointItem, this.#editFormItem);
    document.removeEventListener('keydown', this.#escKeyHandler);
    this.#mode = Mode.DEFAULT;
  }

  #addToFaivorite() {
    this.#handleDataChange({...this.#point, isFavorite: !this.#point.isFavorite});
  }

  #editFormSubmitHandler = (point) => {
    this.#handleDataChange(point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };

  #editFormResetHandler = () => {
    this.#editFormItem.reset(this.#point);
    this.#replaceEditFormToPoint();
    document.removeEventListener('keydown', this.#escKeyHandler);
  };
}

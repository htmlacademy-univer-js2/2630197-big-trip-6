import Filters from '../view/filters-view.js';
import FormEditing from '../view/form-editing-view.js';
import RoutePointList from '../view/route-point-list-view.js';
import RoutePoint from '../view/route-point-view.js';
import Sorting from '../view/sorting-view.js';
import { render, replace } from '../framework/render.js';
import { isEscapeKey } from '../utils.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mock/filters-mock.js';

export default class Presenter {
  #RoutePointListComponent = new RoutePointList();

  #pointsModel = null;
  #offersModel = null;
  #destinationsModel = null;
  #tripEvents = null;
  #tripControlFilters = null;
  #points = null;
  #destinations = null;
  #offers = null;

  constructor({pointsModel, offersModel, destinationsModel}) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#destinationsModel = destinationsModel;
    this.#tripEvents = document.querySelector('.trip-events');
    this.#tripControlFilters = document.querySelector('.trip-controls__filters');
  }

  init() {
    this.#points = this.#pointsModel.points;
    this.#offers = this.#offersModel.offers;
    this.#destinations = this.#destinationsModel.destinations;

    const filters = generateFilter(this.#points);

    if (this.#points.length > 0) {
      render(new Filters({filters}), this.#tripControlFilters);
      render(new Sorting(), this.#tripEvents);
      render(this.#RoutePointListComponent, this.#tripEvents);

      this.#points.forEach((point) => {
        this.#renderPoint(point);
      });
    } else {
      render(new EmptyListView(), this.#tripEvents);
    }

  }

  #renderPoint(point) {
    const escKeyHandler = (event) => {
      if (isEscapeKey(event)) {
        event.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyHandler);
      }
    };

    const editForm = new FormEditing({point, destinations: this.#destinations, offers: this.#offers,
      onSubmitClick: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyHandler);
      },
      onRollButtonClick: () => {
        replaceEditFormToPoint();
        document.removeEventListener('keydown', escKeyHandler);
      }
    });

    const pointItem = new RoutePoint({point, destinations: this.#destinations, offers: this.#offers,
      onRollButtonClick: () => {
        replacePointToEditForm();
        document.addEventListener('keydown', escKeyHandler);
      }
    });

    function replacePointToEditForm() {
      replace(editForm, pointItem);
    }

    function replaceEditFormToPoint() {
      replace(pointItem, editForm);
    }

    render(pointItem, this.#RoutePointListComponent.element);
  }
}

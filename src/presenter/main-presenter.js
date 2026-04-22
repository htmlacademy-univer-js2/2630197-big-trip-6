import Filters from '../view/filters-view.js';
import RoutePointList from '../view/route-point-list-view.js';
import Sorting from '../view/sorting-view.js';
import { render } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mock/filters-mock.js';
import { PointPresenter } from './point-presenter.js';
import { updatePointData } from '../utils.js';

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


  #pointPresenters = new Map();

  constructor({pointsModel, offersModel, destinationsModel}) {
    this.#pointsModel = pointsModel;
    this.#offersModel = offersModel;
    this.#points = this.#pointsModel.points;
    this.#destinationsModel = destinationsModel;
    this.#tripEvents = document.querySelector('.trip-events');
    this.#tripControlFilters = document.querySelector('.trip-controls__filters');
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointUpdate = (updatedPoint) => {
    this.#points = updatePointData(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint);
  };

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
    const pointPresenter = new PointPresenter({

      destinations: this.#destinations,
      offers: this.#offers,
      pointsListComponent: this.#RoutePointListComponent,
      changeDataOnFavorite: this.#handlePointUpdate,
      changeMode: this.#handleModeChange
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }
}

import Filters from '../view/filters-view.js';
import RoutePointList from '../view/route-point-list-view.js';
import Sorting from '../view/sorting-view.js';
import { render, remove } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mock/filters-mock.js';
import { PointPresenter } from './point-presenter.js';
import { updatePointData, sortByDuration, sortByDay, sortByPrice } from '../utils.js';
import { SortTypes } from '../consts.js';

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
  #sortComponent = null;

  #currentSortType = SortTypes[0];
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
    render(new Filters({filters}), this.#tripControlFilters);
    this.#renderPoint();
  }

  #renderPoint() {
    if (this.#points.length > 0) {
      this.#sortComponent = new Sorting({ sortType: this.#currentSortType, onSortTypeChange: this.#handleSortTypeChange });
      this.#sortWaypoints();
      render(this.#sortComponent, this.#tripEvents);
      render(this.#RoutePointListComponent, this.#tripEvents);

      this.#points.forEach((point) => {
        const pointPresenter = new PointPresenter({
          destinations: this.#destinations,
          offers: this.#offers,
          pointsListComponent: this.#RoutePointListComponent,
          changeDataOnFavorite: this.#handlePointUpdate,
          changeMode: this.#handleModeChange
        });

        pointPresenter.init(point);
        this.#pointPresenters.set(point.id, pointPresenter);
      });
    } else {
      render(new EmptyListView(), this.#tripEvents);
    }
  }

  #sortWaypoints() {
    switch (this.#currentSortType) {
      case SortTypes[0]:
        this.#points.sort(sortByDay);
        break;
      case SortTypes[2]:
        this.#points.sort(sortByDuration);
        break;
      case SortTypes[3]:
        this.#points.sort(sortByPrice);
        break;
      default:
        throw new Error('Incorrect sortType');
    }
  }

  #clearListView() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    remove(this.#sortComponent);
    remove(this.#RoutePointListComponent);
  }

  #handleSortTypeChange = (sortType) => {
    if (this.#currentSortType === sortType) {
      return;
    }

    this.#sortWaypoints();
    this.#currentSortType = sortType;
    this.#clearListView();
    this.#renderPoint();
  };
}

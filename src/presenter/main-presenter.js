import Sorting from '../view/sorting-view.js';
import { render, remove, RenderPosition } from '../framework/render.js';
import EmptyListView from '../view/empty-list-view.js';
import PointPresenter from './point-presenter.js';
import { getOffersByType } from '../utils.js';
import { SortType, SortingBySection, UpdateType, UserAction, NEW_POINT, Filter, TimeLimit } from '../consts.js';
import PointCreationPresenter from './point-creation-presenter.js';
import LoadingView from '../view/loading-view.js';
import ErrorView from '../view/error-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';

export default class Presenter {
  #pointsModel = null;
  #sortComponent = null;
  #filterModel = null;
  #filterType = null;
  #currentSortType = null;
  #pointListComponent = null;
  #emptyPointListComponent = null;
  #pointCreationPresenter = null;
  #eventsContainer = null;

  #pointPresenters = new Map();
  #loadingComponent = new LoadingView();
  #errorComponent = new ErrorView();
  #addButton = document.querySelector('.trip-main__event-add-btn');
  #uiBlocker = new UiBlocker({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({ eventsContainer, pointListComponent, pointsModel, filterModel }) {
    this.#pointsModel = pointsModel;
    this.#eventsContainer = eventsContainer;
    this.#pointListComponent = pointListComponent;
    this.#filterModel = filterModel;
    this.#pointsModel.addObserver(this.#onModelChange);
    this.#filterModel.addObserver(this.#onModelChange);

    this.#pointCreationPresenter = new PointCreationPresenter({
      filterModel: this.#filterModel,
      pointListComponent: this.#pointListComponent,
      point: NEW_POINT,
      pointsModel: this.#pointsModel,
      addButton: this.#addButton,
      onDataChange: this.#onUserAction.bind(this),
      onModeChange: this.#onModeChange.bind(this)
    });
  }

  #onModelChange = (updateType, update) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(update.id).init(update);
        break;
      case UpdateType.MINOR:
        this.#resetPointList();
        break;
      case UpdateType.MAJOR:
        this.#resetPointList(true);
        break;
      case UpdateType.INIT:
        remove(this.#loadingComponent);
        if (update.isLoadingFailed) {
          this.#renderError();
        } else {
          this.#renderPointList();
        }
    }
  };

  #resetPointList(isFilterTypeChanged = false) {
    this.#clearListView();
    this.#renderPointList(isFilterTypeChanged);
  }

  #onModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
    this.#pointCreationPresenter.destroy();
  };

  async init() {
    this.#onSortChange(SortType.DAY);
  }

  #renderPoint(point) {
    const pointPresenter = new PointPresenter({
      destinations: this.destinations,
      offers: this.offers,
      pointsListComponent: this.#pointListComponent,
      changeDataOnFavorite: this.#onUserAction.bind(this),
      changeMode: this.#onModeChange.bind(this),
      typeOffers: getOffersByType(this.offers, point.type)
    });

    pointPresenter.init(point);
    this.#pointPresenters.set(point.id, pointPresenter);
  }

  #onUserAction = async (actionType, updateType, update) => {
    const presenter = this.#pointPresenters.get(update.id);
    try {
      this.#uiBlocker.block();
      switch (actionType) {
        case UserAction.UPDATE_POINT:
          presenter.setSaving();
          await this.#pointsModel.updatePoint(updateType, update);
          break;
        case UserAction.ADD_POINT:
          this.#pointCreationPresenter.setSaving();
          await this.#pointsModel.addPoint(updateType, update);
          break;
        case UserAction.DELETE_POINT:
          presenter.setDeleting();
          await this.#pointsModel.deletePoint(updateType, update);
          break;
      }
    } catch {
      if (actionType === UserAction.ADD_POINT) {
        this.#pointCreationPresenter.setAborting();
      } else {
        presenter.setAborting();
      }
    } finally {
      this.#uiBlocker.unblock();
    }
  };

  #clearListView() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    this.#pointCreationPresenter.destroy();
  }

  #onSortChange(sortType) {
    if (this.#currentSortType !== sortType) {
      this.#currentSortType = sortType;
      this.#renderSort();
      this.#clearListView();
      this.#renderPointList();
    }
  }

  #renderSort() {
    if (this.#sortComponent !== null) {
      remove(this.#sortComponent);
    }

    this.#sortComponent = new Sorting(this.#currentSortType, this.#onSortChange.bind(this));
    render(this.#sortComponent, this.#eventsContainer);
  }

  #renderPointList(isFilterTypeChanged = false) {
    if (this.#pointsModel.loading) {
      this.#renderLoading();
      return;
    }

    if (isFilterTypeChanged) {
      this.#currentSortType = SortType.DAY;
      this.#renderSort();
    }

    remove(this.#emptyPointListComponent);
    render(this.#pointListComponent, this.#eventsContainer);
    if (this.points.length > 0) {
      this.points.forEach((point) => this.#renderPoint(point));
    } else if (!isFilterTypeChanged) {
      this.#renderEmptyPointList();
    }
  }

  #renderLoading() {
    render(this.#loadingComponent, this.#eventsContainer, RenderPosition.BEFOREEND);
  }

  #renderError() {
    render(this.#errorComponent, this.#eventsContainer, RenderPosition.BEFOREEND);
  }

  #renderEmptyPointList() {
    this.#emptyPointListComponent = new EmptyListView({ filterType: this.#filterType });
    render(this.#emptyPointListComponent, this.#pointListComponent.element, RenderPosition.AFTERBEGIN);
  }

  get points() {
    this.#filterType = this.#filterModel.filter;
    let points = this.#pointsModel.points;

    switch (this.#currentSortType) {
      case SortType.PRICE:
        points = SortingBySection[SortType.PRICE](points);
        break;
      case SortType.TIME:
        points = SortingBySection[SortType.TIME](points);
        break;
      default:
        points = SortingBySection[SortType.DAY](points);
        break;
    }
    return Filter[this.#filterType](points);
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  get offers() {
    return this.#pointsModel.offers;
  }
}

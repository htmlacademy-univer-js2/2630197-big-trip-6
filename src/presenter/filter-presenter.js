import { render, remove, replace } from '../framework/render.js';
import { FilterType, UpdateType, Filter } from '../consts.js';
import Filters from '../view/filters-view.js';

export default class FilterPresenter {
  #filtersContainer = null;
  #filterModel = null;
  #pointsModel = null;
  #filterComponent = null;

  constructor({filtersContainer, filterModel, pointsModel}) {
    this.#filtersContainer = filtersContainer;
    this.#filterModel = filterModel;
    this.#pointsModel = pointsModel;
    this.#filterModel.addObserver(this.#onModelChange);
    this.#pointsModel.addObserver(this.#onModelChange);
  }

  get filters() {
    const points = this.#pointsModel.points;

    return Object.values(FilterType).map((type) => ({
      type,
      points: Filter[type](points)
    }));
  }

  init() {
    const filters = this.filters;
    const prevFilterComponent = this.#filterComponent;

    this.#filterComponent = new Filters({
      filters,
      currentFilterType: this.#filterModel.filter,
      onFilterTypeChange: this.#onFilterTypeChange.bind(this)
    });
    if (prevFilterComponent === null) {
      render(this.#filterComponent, this.#filtersContainer);
      return;
    }
    replace(this.#filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  #onModelChange = () => {
    this.init();
  };

  #onFilterTypeChange = (filterType) => {
    if (this.#filterModel.filter === filterType || this.filters.some((item) => item.type === filterType && item.points.length === 0)) {
      return;
    }
    this.#filterModel.setFilter(UpdateType.MAJOR, filterType);
  };
}

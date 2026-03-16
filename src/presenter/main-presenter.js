import Filters from '../view/filters-view.js';
import FormCreation from '../view/form-creation-view.js';
import FormEditing from '../view/form-editing-view.js';
import RoutePointList from '../view/route-point-list-view.js';
import RoutePoint from '../view/route-point-view.js';
import Sorting from '../view/sorting-view.js';
import { render } from '../render.js';

export default class Presenter {
  RoutePointListComponent = new RoutePointList();

  constructor({mainModel}) {
    this.mainModel = mainModel;
    this.tripEvents = document.querySelector('.trip-events');
    this.tripControlFilters = document.querySelector('.trip-controls__filters');
  }

  init() {
    this.points = this.mainModel.getPoints();
    this.offers = this.mainModel.getOffers();
    this.destinations = this.mainModel.getDestinations();

    render(new Filters(), this.tripControlFilters);
    render(new Sorting(), this.tripEvents);
    render(this.RoutePointListComponent, this.tripEvents);
    render(new FormEditing({point: this.points[0], destinations: this.destinations}), this.RoutePointListComponent.getElement());

    this.points.forEach((point) => {
      render(new RoutePoint({point, destinations: this.destinations}), this.RoutePointListComponent.getElement());
    });

    render(new FormCreation(), this.RoutePointListComponent.getElement());
  }
}

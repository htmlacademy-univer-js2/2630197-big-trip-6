import Presenter from './presenter/main-presenter';
import MainModel from './model/main-model';

const mainModel = new MainModel();
const presenter = new Presenter({mainModel});

presenter.init();

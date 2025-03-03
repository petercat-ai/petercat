import components from './components';
import edit from './edit';
import utils from './utils';
import app from './app';
import chunk from './chunk';
import release from './release';
import DeployBotModal from './DeployBotModal';

export default Object.assign(
  {},
  {
    chunk,
    components,
    app,
    utils,
    edit,
    release,
    DeployBotModal,
  },
);

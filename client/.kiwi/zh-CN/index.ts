import components from './components';
import chunk from './chunk';
import release from './release';
import DeployBotModal from './DeployBotModal';
import edit from './edit';
import utils from './utils';
import app from './app';

export default Object.assign(
  {},
  {
    components,
    app,
    utils,
    edit,
    DeployBotModal,
    release,
    chunk
  },
);

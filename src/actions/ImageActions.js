import alt from '../alt';
import dockerUtil from '../utils/dockerUtil';

class ImageActions {
  all () {
    this.dispatch({});
    dockerUtil.fetchAllImages();
  }

  updated (images) {
    this.dispatch(images);
  }
}

export default alt.createActions(ImageActions);

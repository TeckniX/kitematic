import _ from 'underscore';
import alt from '../alt';
import imageActions from '../actions/ImageActions';

class ImageStore {
  constructor () {
    this.bindActions(imageActions);
    this.results = [];
    this.images = [];
    this.imagesLoading = false;
    this.resultsLoading = false;
    this.error = null;
  }

  error ({error}) {
    this.setState({error: error, imagesLoading: false, resultsLoading: false});
  }

  images () {
    this.setState({error: null, imagesLoading: true});
  }

  imagesLoading () {
    this.setState({imagesLoading: true});
  }

  updated (images) {
    this.setState({images: images, imagesLoading: false});
  }

  static all () {
    let state = this.getState();
    return state.images;
  }
}

export default alt.createStore(ImageStore);

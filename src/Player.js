import React, { Component } from 'react';
import './Player.css';

class Player extends Component {
  constructor() {
    super();

    this.state = {
      is_playing: false,
      progress: 0,
      in_set_progress_mode: false
    };

    this.is_progress_dirty = false;
    this.interval_id = setInterval(this.onUpdate.bind(this), 250);
  }
  onUpdate() {
    if (this._player) {
      if (!this.is_progress_dirty) {
        this.setState({
          progress: this._player.currentTime / this._player.duration
        });
      }

      if (this._player.ended && this.props.onDone) {
        this.props.onDone(this.props.src);
      }
    }
  }
  togglePlay() {
    this.setState({ is_playing: !this.state.is_playing });
  }
  startSetProgress(evt) {
    this.setState({
      in_set_progress_mode: true
    });
    this.setProgress(evt);
  }
  stopSetProgress(evt) {
    this.setState({
      in_set_progress_mode: false
    });
    this.setProgress(evt);
  }
  setProgress(evt) {
    if (this.state.in_set_progress_mode) {
      var progress = (evt.clientX - offsetLeft(this._progress_bar)) / this._progress_bar.clientWidth;
      this.setState({
        progress: progress
      });
      this.is_progress_dirty = true;
    }
  }
  render() {
    var currentTime = 0;
    var totalTime = 0;

    if (this._player) {
      if (this._player.currentSrc !== this.props.src) {
        this._player.src = this.props.src;
      }

      if (this._player.paused && !this._player.ended) {
        if (this.state.is_playing) {
          this._player.play();
        }
      }
      else if (!this.state.is_playing) {
        this._player.pause();
      }

      if (this.is_progress_dirty) {
        this.is_progress_dirty = false;

        this._player.currentTime = this._player.duration * this.state.progress;
      }

      currentTime = this._player.currentTime;
      totalTime = this._player.duration;
    }

    var playerClsName = {
      "fa": true,
      "fa-play": !this.state.is_playing,
      "fa-pause": this.state.is_playing
    };

    return (
      <div className="player">
        <div className="controls">
          <a onClick={this.props.onPrev}><i className="fa fa-chevron-left" aria-hidden="true"></i></a>
          <a onClick={this.togglePlay.bind(this)}>
            <i className={classnames(playerClsName)} aria-hidden="true"></i>
          </a>
          <a onClick={this.props.onNext}><i className="fa fa-chevron-right" aria-hidden="true"></i></a>
        </div>
        <div
          onMouseDown={this.startSetProgress.bind(this)}
          onMouseMove={this.setProgress.bind(this)}
          onMouseLeave={this.stopSetProgress.bind(this)}
          onMouseUp={this.stopSetProgress.bind(this)}
          className="progress"
        >
          <div ref={(ref) => this._progress_bar = ref} className="bar">
            <div style={{ width: (this.state.progress * 100) + '%' }}></div>
          </div>
        </div>
        <div className="time">
        {formatTime(currentTime)} / {formatTime(totalTime)}
        </div>
        <audio ref={(ref) => this._player = ref} autoPlay={this.state.is_playing}>
            <source src={this.props.src} />
            <source/>
        </audio>
      </div>
    );
  }
}

function format2Number(num) {
  var str = num + '';
  if (str.length === 1) {
    return '0' + str;
  }
  if (str.length === 0) {
    return '00';
  }
  return str;
}

function formatTime(s) {
  if (!s && s !== 0) {
    return '??:??';
  }

  var total_seconds = Math.floor(s);
  var hours = Math.floor(total_seconds / 3600);
  var minutes = Math.floor(total_seconds / 60) - hours * 60;
  var seconds = total_seconds - minutes * 60 - hours * 3600;

  if (hours) {
    return hours + ':' + format2Number(minutes) + ':' + format2Number(seconds);
  }

  return format2Number(minutes) + ':' + format2Number(seconds);
}

function offsetLeft(el) {
  var left = 0;
  while (el && el !== document) {
    left += el.offsetLeft;
    el = el.offsetParent;
  }
  return left;
}

function classnames(obj) {
  var css = [];
  Object.keys(obj).forEach((key) => {
    if (obj[key]) {
      css.push(key);
    }
  });
  return css.join(' ');
}

export default Player;

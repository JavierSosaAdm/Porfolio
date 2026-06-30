import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root'
})
export class MusicService {

  private music = new Howl({
    src: ['assets/music/12 - End Of Line.mp3'],
    loop: true,
    volume: 0.2,
    html5: true
  })

  play() {
    if (!this.music.playing()) {
      this.music.play();
      console.log('Deberia estar sonando Daft Punk en servicio')
    }
  }

  pause() {
    if (this.music.playing()) {
      this.music.pause();
      console.log('Se debe pausar la musica');
    }
  }

  stop() {
    if (this.music.playing()) {
      this.music.stop();
      console.log('Se debe detener la musica el servicio')
    }
  }

  isPlaying() {
    return this.music.playing();
  }

  setVolume(volume: number) {
    this.music.volume(volume);
  }
}

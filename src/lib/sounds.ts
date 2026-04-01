type SoundName = "coin" | "win" | "lose" | "levelup" | "blip";

const SOUND_FILES: Record<SoundName, string> = {
  coin: "/sounds/coin.mp3",
  win: "/sounds/win.mp3",
  lose: "/sounds/lose.mp3",
  levelup: "/sounds/levelup.mp3",
  blip: "/sounds/blip.mp3",
};

class SoundManager {
  private enabled = true;
  private cache = new Map<string, HTMLAudioElement>();

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  play(name: SoundName) {
    if (!this.enabled || typeof window === "undefined") return;
    let audio = this.cache.get(name);
    if (!audio) {
      audio = new Audio(SOUND_FILES[name]);
      audio.volume = 0.3;
      this.cache.set(name, audio);
    }
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }
}

export const sounds = new SoundManager();

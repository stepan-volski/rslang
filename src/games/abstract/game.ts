import { Word } from '../../service/interfaces';

class Game {
  name: string;
  gameData: Word[];

  constructor(name: string) {
    this.name = name;
    this.gameData = [];
  }

  setGameData(words: Word[]): void {
    this.gameData = words;
  }

  // render(): void {}

  // initHandlers(): void {}

  // startGame(): void {}

  // finishGame(): void {}

  // displayResults(): void {}

  registerCorrectAnswer(): void {
    const a = this.name;
  }

  registerIncorrectAnswer(): void {
    const a = this.name;
  }
}

export default Game;

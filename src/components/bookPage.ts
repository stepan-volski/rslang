import Word from '../entity/word';
import { getWords } from '../service/api';

class BookPage {
  pageNumber: number;
  groupNumber: number;

  constructor(pageNumber: number, groupNumber: number) {
    this.pageNumber = pageNumber;
    this.groupNumber = groupNumber;
  }

  async getWords(): Promise<Word[]> {
    return getWords(this.groupNumber, this.pageNumber);
  }

  async render(): Promise<void> {
    const container = document.getElementById('textbookContainer') as HTMLDivElement;
    const words = await this.getWords();
    words.map((word) => BookPage.createWordCard(word))
      .forEach((wordCard) => container.insertAdjacentHTML('beforeend', wordCard));
  }

  static createWordCard(word: Word): string { // TODO - move to separate class?
    return `
      <div class="wordCard">
        <div>Word: ${word.word}</div>
        <div>Translation: ${word.wordTranslate}</div>
        <div>Transcription: ${word.transcription}</div>
      </div>
    `;
  }
}

export default BookPage;

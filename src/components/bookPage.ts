import Word from '../entity/word';
import { getWords } from '../service/api';

class BookPage {
  pageNumber: number;
  groupNumber: number;

  constructor(groupNumber: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.groupNumber = groupNumber;
  }

  async getWords(): Promise<Word[]> {
    return getWords(this.groupNumber, this.pageNumber);
  }

  async render(): Promise<void> {
    const container = document.getElementById('content') as HTMLDivElement;
    const words = await this.getWords();
    const wordsHtml = words.map((word) => BookPage.createWordCard(word)).join('');
    container.innerHTML = wordsHtml;
  }

  static createWordCard(word: Word): string { // TODO - move to wordCard class?
    return `
      <div class="wordCard" data-wordId=${word.id}>
        <div>Word: ${word.word}</div>
        <div>Translation: ${word.wordTranslate}</div>
        <div>Transcription: ${word.transcription}</div>
        <button class="difficultBtn">difficult</button>
      </div>
    `;
  }
}

export default BookPage;

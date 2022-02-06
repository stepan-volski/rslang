import { Word } from '../service/interfaces';
import { getWords, getAggregatedWords } from '../service/api';
import { isUserLoggedIn } from '../utils/loginUtils';

class BookPage {
  pageNumber: number;
  groupNumber: number;

  constructor(groupNumber: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.groupNumber = groupNumber;
  }

  async getWords(): Promise<Word[]> {
    return isUserLoggedIn()
      ? getWords(this.groupNumber, this.pageNumber)
      : getAggregatedWords(this.groupNumber, this.pageNumber);
  }

  async render(): Promise<void> {
    const container = document.getElementById('content') as HTMLDivElement;
    const words = await this.getWords();
    const wordsHtml = words.map((word) => BookPage.createWordCard(word)).join('');
    container.innerHTML = wordsHtml;
  }

  static createWordCard(word: Word): string {
    let isDifficult = '';
    const isLearnt = '';

    if (word.userWord) {
      isDifficult = word.userWord.difficulty;
      // isLearnt = (word.userWord.isLearnt) ? 'learnt' : '';
    }

    const isHidden = (isUserLoggedIn()) ? '' : 'hidden';

    return `
      <div class="wordCard ${isDifficult} ${isLearnt}" data-wordId=${word.id}>
        <div>Word: ${word.word}</div>
        <div>Translation: ${word.wordTranslate}</div>
        <div>Transcription: ${word.transcription}</div>
        <button class="difficultBtn" ${isHidden}>difficult</button>
        <button class="learntBtn" ${isHidden}>learnt</button>
      </div>
    `;
  }
}

export default BookPage;

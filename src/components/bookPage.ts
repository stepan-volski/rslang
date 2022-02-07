/* eslint-disable no-underscore-dangle */
import { Word } from '../service/interfaces';
import { getWords, getAggregatedWords, getDifficultWords } from '../service/api';
import { isUserLoggedIn } from '../utils/loginUtils';

class BookPage {
  pageNumber: number;
  groupNumber: number;
  isUserLoggedIn: boolean;

  constructor(groupNumber: number, pageNumber: number) {
    this.pageNumber = pageNumber;
    this.groupNumber = groupNumber;
    this.isUserLoggedIn = isUserLoggedIn();
  }

  async getWords(): Promise<Word[]> {
    return (this.isUserLoggedIn)
      ? getAggregatedWords(this.groupNumber, this.pageNumber)
      : getWords(this.groupNumber, this.pageNumber);
  }

  async render(isOnlyDifficultWords = false): Promise<void> {
    const container = document.getElementById('content') as HTMLDivElement;
    const words = isOnlyDifficultWords ? await getDifficultWords() : await this.getWords();
    const wordsHtml = words.map((word) => this.createWordCard(word)).join('');
    container.innerHTML = wordsHtml;
  }

  createWordCard(word: Word): string {
    let isDifficult = '';
    let btnText = 'mark difficult';
    const isLearnt = '';

    if (word.userWord) {
      if (word.userWord.difficulty === 'difficult') {
        isDifficult = 'difficult';
        btnText = 'unmark difficult';
      }
      // isLearnt = (word.userWord.isLearnt) ? 'learnt' : '';
    }

    const isHidden = (this.isUserLoggedIn) ? '' : 'hidden';
    return `
      <div class="wordCard ${isDifficult} ${isLearnt}" data-wordId=${word._id || word.id}>
        <div>Word: ${word.word}</div>
        <div>Translation: ${word.wordTranslate}</div>
        <div>Transcription: ${word.transcription}</div>
        <button class="difficultBtn" ${isHidden}>${btnText}</button>
        <button class="learntBtn" ${isHidden}>learnt</button>
      </div>
    `;
  }
}

export default BookPage;

/* eslint-disable no-underscore-dangle */
import { baseUrl } from '../service/api';
import { Word } from '../service/interfaces';
import { getAggregatedWords, getDifficultWords } from '../service/usersWordsApi';
import { getWords } from '../service/wordsApi';
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
    const wordsHtml = words.map((word: Word) => this.createWordCard(word)).join('');
    container.innerHTML = wordsHtml;
  }

  createWordCard(word: Word): string {
    let isDifficult = '';
    let diffBtnText = 'mark difficult';
    let isLearnt = '';
    let learnBtnText = 'mark learned';
    let wordGameScore = '-';

    if (word.userWord) {
      if (word.userWord.difficulty === 'difficult') {
        isDifficult = 'difficult';
        diffBtnText = 'unmark difficult';
      }
      if (word.userWord.optional.learned) {
        isLearnt = 'learnt';
        learnBtnText = 'unmark learnt';
      }
      wordGameScore = `${word.userWord.optional.correctAnswerCounter}/${word.userWord.optional.incorrectAnswerCounter}`;
    }

    const isHidden = (this.isUserLoggedIn) ? '' : 'hidden';
    return `
      <div class="wordCard ${isDifficult} ${isLearnt}" data-wordId=${word._id || word.id}>
        <img class="cardImage" src="${baseUrl}/${word.image}"></img>
        <div class="cardContent">
          <div class="cardHeader">
            <div class="subHeader">
              <span>${word.word}</span>
              <span>${word.transcription}</span>
              <span><img class="cardAudioIcon" src="../assets/audio_icon.png"></img></span>
            </div>
            <div>${word.wordTranslate}</div>
          </div>

          <div class="cardBody">
            <div>${word.textExample}</div>
            <div class="subSentence">${word.textExampleTranslate}</div>
          </div>
          <div class="cardBody">
            <div>${word.textMeaning}</div>
            <div class="subSentence">${word.textMeaningTranslate}</div>
          </div>

          <button class="difficultBtn" ${isHidden}>${diffBtnText}</button>
          <button class="learntBtn" ${isHidden}>${learnBtnText}</button>
          <div ${isHidden}>Word Game Score: ${wordGameScore}</div>
        </div>
      </div>
    `;
  }
}

export default BookPage;

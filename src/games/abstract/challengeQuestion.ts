import { Word } from '../../service/interfaces';

class ChallengeQuestion {
  questionWord: Word | null = null;
  answers: string[] = [];
}

export default ChallengeQuestion;

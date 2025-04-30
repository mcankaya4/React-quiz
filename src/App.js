import Header from "./components/Header";
import Main from "./components/Main";
import { useReducer } from "react";
import Loader from "./components/Loader";
import Err from "./components/Err";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import FinishedScreen from "./components/FinishedScreen";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import Footer from "./components/Footer";
import Timer from "./components/Timer";
import { questions } from "./data/questions";
import LevelScreen from "./components/LevelScreen";
import CompleteScreen from "./components/CompleteScreen";

function createShuffledQuestionOrder(totalQuestions) {
  const indices = Array.from({ length: totalQuestions }, (_, i) => i);

  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  return indices;
}

// Todo: Varsayılan state'ler
const initialState = {
  questions: [...questions],
  quizSort: [...createShuffledQuestionOrder(questions.length)],
  level: 1,
  // loading, error, ready, active, finished
  status: "ready",
  index: 0,
  answer: null,
  points: 0,
  highScore: 0,
  secondsRemaining: 100,
};

// Todo: State yönetimi
function reducer(state, action) {
  switch (action.type) {
    case "start":
      return {
        ...state,
        status: "active",
      };
    // Todo: Cevabı işaretlediğinde, soruyu tespit et.
    // Todo: answer içerisine işaretlenen cevap sıra numarasını aktar.
    // Todo: işaretlenen cevap sıra numarası, api'deki doğru şık ise;
    // Todo: puana soru puanını ekle, değilse soru puanı olarak devam et.
    case "newAnswer":
      const isLevel = state.index !== 0 && (state.index + 1) % 10 === 0;
      const question = state.questions.at(state.quizSort.at(state.index));
      const numQuiz = state.questions.length - 1;
      return {
        ...state,
        index: state.index + 1,
        status:
          state.index < numQuiz
            ? !isLevel
              ? action.payload !== question?.correctOption
                ? "finished"
                : state.status
              : "levelUp"
            : "complete",
        points:
          action.payload === question?.correctOption
            ? state.points + question.points
            : state.points,
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    // Todo: Süre bittiğinde veya soru sayısı bittiğinde aktif olacak.
    // Todo: Durumu finished olarak ayarla.
    // Todo: Score yüksek score'dan fazla ise yüksek score'u güncelle.
    case "finish":
      return {
        ...state,
        status: "finished",
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
      };
    // Todo: Restart olurken initial'i aktar ve güncelle.
    // Todo: Durumu ready yap, soruları aktar, highscore'u al.
    case "restartQuiz":
      return {
        ...initialState,
        status: "active",
        highScore: state.highScore,
        quizSort: [...createShuffledQuestionOrder(questions.length)],
      };
    // Todo: Her 1 saniyede tetiklenecek olan tik'de saniyeyi 1 azalt.
    // Todo: secondsRemaining 0 ise durumu finished yap yoksa durum kalsın.
    case "tik":
      return {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        highScore:
          state.points > state.highScore ? state.points : state.highScore,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
    case "nextLevel":
      return {
        ...state,
        level: state.level + 1,
        status: "active",
      };
    // Todo: Yanlış komut geldiyse hata döndür.
    default:
      throw new Error(`Unknown action type ${action.type}`);
  }
}

function App() {
  // Todo: tüm state'leri kullanılabilir olarak dışa aktar.
  const [
    {
      questions,
      status,
      index,
      answer,
      points,
      highScore,
      secondsRemaining,
      quizSort,
      level,
    },
    dispatch,
  ] = useReducer(reducer, initialState);

  // Todo: Soru sayısını ve toplam puan durumunu değişkene depola.
  const numQuestions = questions.length;
  const totalPoints = questions.reduce(
    (sum, question) => sum + question.points,
    0,
  );

  // // Todo: Api'den soruları çek
  // useEffect(() => {
  //   async function fetchQuestions() {
  //     try {
  //       const res = await fetch("http://localhost:8000/questions");
  //       if (!res.ok) throw new Error("Failed to fetch questions");
  //       const data = await res.json();
  //       // Todo: Data geldiyse setData'yı çalıştır.
  //       dispatch({ type: "setData", payload: data });
  //     } catch (error) {
  //       // Todo: Error varsa dataFailed'ı çalıştır.
  //       dispatch({ type: "dataFailed" });
  //     }
  //   }
  //
  //   fetchQuestions();
  // }, []);

  return (
    <div className="app">
      <Header />
      <Main>
        {/* Todo: Duruma göre loader */}
        {status === "loading" && <Loader />}
        {/* Todo: Duruma göre error */}
        {status === "error" && <Err />}
        {/* Todo: Duruma göre başlangıç ekranı */}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "levelUp" && (
          <LevelScreen level={level} dispatch={dispatch} points={points} />
        )}
        {/* Todo: Duruma göre soruları çalıştır */}
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestions={numQuestions}
              totalPoints={totalPoints}
              points={points}
              answer={answer}
            />
            <Question
              question={questions.at(quizSort.at(index))}
              dispatch={dispatch}
              answer={answer}
            />
            <Footer>
              <Timer dispatch={dispatch} secondsRemaining={secondsRemaining} />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                numQuestions={numQuestions}
                index={index}
              />
            </Footer>
          </>
        )}
        {/* Todo: Duruma göre bitiş ekranı */}
        {status === "finished" && (
          <FinishedScreen
            points={points}
            totalPoints={totalPoints}
            highScore={highScore}
            dispatch={dispatch}
          />
        )}
        {status === "complete" && <CompleteScreen dispatch={dispatch} />}
      </Main>
    </div>
  );
}

export default App;

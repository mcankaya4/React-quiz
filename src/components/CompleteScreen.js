function CompleteScreen({ dispatch }) {
  return (
    <>
      <p className="result">
        <p>
          Congratulations (Tebrikler) <span className="result-span">💯</span>
        </p>
      </p>
      <p className="highscore">
        <p>You managed to answer them all, you're perfect.</p>
        <p>(Tümünü cevaplamayı başardın, mükemmelsin.)</p>
      </p>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "restartQuiz" });
        }}
      >
        Restart Again 👉🏻
      </button>
    </>
  );
}

export default CompleteScreen;

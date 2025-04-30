function LevelScreen({ level, points, dispatch }) {
  return (
    <>
      <p className="highscore">Congratulations (Tebrikler)</p>
      <p className="result">
        <p>
          {level}st level completed. <span>💯</span>
        </p>
      </p>
      <p className="highscore">
        At level <strong>{level}</strong> you managed to collect {points}
        points.
      </p>
      <p className="highscore">
        <strong>{level}</strong>. levelde {points} puan toplamayı başardın.
      </p>
      <button
        className="btn btn-ui"
        onClick={() => {
          dispatch({ type: "nextLevel" });
        }}
      >
        Next Level 👉🏻
      </button>
    </>
  );
}

export default LevelScreen;

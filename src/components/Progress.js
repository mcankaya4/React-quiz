function progress({ index, numQuestions, points, answer }) {
  const num = 10;
  return (
    <header className="progress">
      <progress max={num} value={index + +(answer !== null)} />
      <p>
        Question <strong>{index + 1}</strong> / {num}
      </p>
      <p>
        Point: <strong>{points}</strong>
      </p>
    </header>
  );
}

export default progress;

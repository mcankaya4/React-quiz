import { useReducer } from "react";

function reducer(state, action) {
  switch (action.type) {
    case "inc":
      return { ...state, count: state.count + 1 };
    case "dec":
      return { ...state, count: state.count - 1 };
    case "setCount":
      return { ...state, count: action.payload };
    case "setStep":
      return { ...state, step: action.payload };
    case "reset":
      return { count: 0, step: 1 };
    default:
      throw new Error(`Bu aksiyon bulunamadı: ${action.type}`);
  }
}

function DateCounter() {
  const initialState = { count: 0, step: 1 };
  const [{ count, step }, dispatch] = useReducer(reducer, initialState);

  // This mutates the date object.
  const time = new Date();
  time.setDate(time.getDate() + count * step);
  const timeFormat = new Intl.DateTimeFormat("tr-TR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(time);

  const defineCount = function (e) {
    dispatch({ type: "setCount", payload: +e.target.value });
  };

  const defineStep = function (e) {
    dispatch({ type: "setStep", payload: +e.target.value });
  };

  const reset = function () {
    dispatch({ type: "reset" });
  };

  return (
    <div className="counter">
      <div>
        <input
          type="range"
          min="1"
          max="5"
          value={step}
          onChange={defineStep}
        />
        <span>{step}</span>
      </div>

      <div>
        <button onClick={() => dispatch({ type: "dec" })}>-</button>
        <input value={count} onChange={defineCount} />
        <button onClick={() => dispatch({ type: "inc" })}>+</button>
      </div>

      <p>{timeFormat}</p>

      <div>
        <button onClick={reset}>Reset</button>
      </div>
    </div>
  );
}

export default DateCounter;

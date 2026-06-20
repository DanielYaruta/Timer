import { useState, useEffect } from 'react';

// --- геометрия круга для прогресс-бара ---
const RADIUS = 84;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// форматирование секунд в "мм:сс" с ведущими нулями
function formatTime(seconds) {
  const total = Math.max(0, seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
}

// --- деления по кругу, как на механическом секундомере ---
// 60 чёрточек; каждая 5-я длиннее и красная
const TICKS = Array.from({ length: 60 }, (_, i) => {
  const center = 120;
  const outerR = 108;
  const isMajor = i % 5 === 0;
  const innerR = isMajor ? 94 : 100;
  const angle = (i / 60) * 2 * Math.PI;
  return {
    x1: center + outerR * Math.cos(angle),
    y1: center + outerR * Math.sin(angle),
    x2: center + innerR * Math.cos(angle),
    y2: center + innerR * Math.sin(angle),
    isMajor,
  };
});

export default function App() {
  const [minutes, setMinutes] = useState('1');
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remainingSeconds, setRemainingSeconds] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [status, setStatus] = useState('готов');

  // --- сердце таймера: пока isRunning, каждую секунду уменьшаем остаток ---
  // setInterval живёт внутри useEffect, очистка делает работу clearInterval
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      // функциональный апдейт — иначе поймаем stale closure
      setRemainingSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning]);

  // --- обработка конца отсчёта ---
  // когда остаток ушёл ниже нуля -- останавливаемся и фиксируем 00:00
  useEffect(() => {
    if (remainingSeconds < 0) {
      setRemainingSeconds(0);
      setIsRunning(false);
      setStatus('время вышло');
    }
  }, [remainingSeconds]);

  // читает минуты из поля, отрезает всё за пределами 1..99 и возвращает число
  function clampMinutes() {
    let m = parseInt(minutes, 10);
    if (isNaN(m) || m < 1) m = 1;
    if (m > 99) m = 99;
    setMinutes(String(m));
    return m;
  }

  // одна кнопка: Старт -> Стоп(пауза) -> Продолжить -> Стоп(пауза) ...
  function toggleStartStop() {
    if (isRunning) {
      // ставим на паузу, остаток сохраняется как есть
      setIsRunning(false);
      setStatus('пауза');
      return;
    }

    // если таймер ещё не запускался (полный круг) или уже отыграл -- читаем минуты;
    // если это продолжение после паузы -- остаток уже стоит где надо
    const justStarting =
      remainingSeconds === totalSeconds || remainingSeconds <= 0;
    if (justStarting) {
      const m = clampMinutes();
      const total = m * 60;
      setTotalSeconds(total);
      setRemainingSeconds(total);
    }

    setStatus('идёт отсчёт');
    setIsRunning(true);
  }

  // сброс работает в любой момент, даже во время отсчёта -- аварийная остановка
  function resetTimer() {
    setIsRunning(false);
    const m = clampMinutes();
    const total = m * 60;
    setTotalSeconds(total);
    setRemainingSeconds(total);
    setStatus('готов');
  }

  // и текст, и круг считаются из одного remainingSeconds -- рассинхрона быть не может
  const fractionLeft = remainingSeconds / totalSeconds;
  const offset = CIRCUMFERENCE * (1 - fractionLeft);
  const hintsVisible = !isRunning;

  return (
    <div className="app">
      <h1 className="app-title">Стадионный таймер</h1>
      <p className="app-subtitle">круговой обратный отсчёт</p>

      <div className="stopwatch">
        <div className="timer-wrapper">
          <button
            className="side-button"
            aria-label="Сброс"
            title="Сброс"
            onClick={resetTimer}
          />
          <button
            className="top-button"
            aria-label="Старт"
            title="Старт"
            onClick={toggleStartStop}
          />

          <div className={'hint hint-top' + (hintsVisible ? '' : ' hidden')}>
            <span className="hint-label">Старт / Стоп</span>
          </div>
          <div className={'hint hint-side' + (hintsVisible ? '' : ' hidden')}>
            <span className="hint-label">Сброс</span>
          </div>

          <svg
            className="dial-svg"
            width="240"
            height="240"
            viewBox="0 0 240 240"
          >
            <g>
              {TICKS.map((t, i) => (
                <line
                  key={i}
                  x1={t.x1.toFixed(2)}
                  y1={t.y1.toFixed(2)}
                  x2={t.x2.toFixed(2)}
                  y2={t.y2.toFixed(2)}
                  className={t.isMajor ? 'tick major' : 'tick'}
                  strokeWidth={t.isMajor ? 2 : 1}
                />
              ))}
            </g>
            <circle className="track" cx="120" cy="120" r="84" />
            <circle
              className="progress"
              cx="120"
              cy="120"
              r="84"
              style={{
                strokeDasharray: CIRCUMFERENCE.toFixed(2),
                strokeDashoffset: offset.toFixed(2),
              }}
            />
          </svg>

          <div className="timer-text">
            <span className="time">{formatTime(remainingSeconds)}</span>
            <span className={'status' + (isRunning ? ' running' : '')}>
              {status}
            </span>
            <div className="minutes-row">
              <input
                type="number"
                min="1"
                max="99"
                value={minutes}
                disabled={isRunning}
                aria-label="Минуты"
                onChange={(e) => setMinutes(e.target.value)}
                onBlur={clampMinutes}
              />
              <label>Min</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

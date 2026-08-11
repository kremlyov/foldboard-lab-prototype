"use client";

import { useEffect, useRef, useState } from "react";

const layouts = {
  RU: [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д"],
    ["⇧", "я", "ч", "с", "м", "и", "т", "ь", "⌫"],
  ],
  EN: [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["⇧", "z", "x", "c", "v", "b", "n", "m", "⌫"],
  ],
};

const digits = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];

export default function Home() {
  const [text, setText] = useState("Попробуйте набрать текст двумя руками");
  const [language, setLanguage] = useState<"RU" | "EN">("RU");
  const [shift, setShift] = useState(false);
  const [pressed, setPressed] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const flash = (key: string) => {
    setPressed(key);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setPressed(null), 110);
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(7);
  };

  const typeKey = (key: string) => {
    flash(key);
    if (key === "⇧") return setShift((value) => !value);
    if (key === "⌫") return setText((value) => value.slice(0, -1));
    setText((value) => value + (shift ? key.toUpperCase() : key));
    if (shift) setShift(false);
  };

  const keyButton = (key: string, index: number, alt?: string) => (
    <button
      aria-label={key === "⌫" ? "Удалить" : key === "⇧" ? "Shift" : `Клавиша ${key}`}
      className={`key ${key === "⇧" || key === "⌫" ? "key-wide utility-key" : ""} ${shift && key === "⇧" ? "key-active" : ""} ${pressed === key ? "is-pressed" : ""}`}
      data-alt={alt}
      key={`${key}-${index}`}
      onPointerDown={(event) => { event.preventDefault(); typeKey(key); }}
    >
      <span>{shift && key.length === 1 ? key.toUpperCase() : key}</span>
    </button>
  );

  const half = (row: string[], side: "left" | "right", rowIndex: number) => {
    const cut = Math.ceil(row.length / 2);
    const start = side === "left" ? 0 : cut;
    const keys = side === "left" ? row.slice(0, cut) : row.slice(cut);
    return keys.map((key, index) => keyButton(key, start + index, rowIndex === 0 ? digits[start + index] : undefined));
  };

  const add = (value: string) => setText((current) => current + value);

  return (
    <main className="prototype">
      <section className="workspace" aria-label="Область приложения">
        <div className="message-shell">
          <textarea aria-label="Тестовое поле" value={text} onChange={(event) => setText(event.target.value)} />
        </div>
      </section>

      <section className="keyboard split" aria-label="Экранная клавиатура">
        <div className="key-area">
          <div className="key-half left-half">
            {layouts[language].map((row, index) => <div className="key-row" key={index}>{half(row, "left", index)}</div>)}
          </div>
          <div className="fold-zone" aria-label="Линия сгиба" />
          <div className="key-half right-half">
            {layouts[language].map((row, index) => <div className="key-row" key={index}>{half(row, "right", index)}</div>)}
          </div>
        </div>

        <div className="bottom-row">
          <button className="utility utility-wide">?123</button>
          <button className="utility" onPointerDown={(event) => { event.preventDefault(); add(","); }}>,</button>
          <button className="emoji" aria-label={`Сменить язык, сейчас ${language}`} onClick={() => setLanguage((value) => value === "RU" ? "EN" : "RU")}><span>☺</span><small>{language}</small></button>
          <button className="space" aria-label="Пробел" onPointerDown={(event) => { event.preventDefault(); flash("space"); add(" "); }} />
          <button className="utility" onPointerDown={(event) => { event.preventDefault(); add("."); }}>.</button>
          <button className="search" aria-label="Поиск" onPointerDown={(event) => { event.preventDefault(); flash("search"); }}>⌕</button>
        </div>
        <div className="system-row"><span className="down">⌄</span><div className="home-indicator" /><span className="keyboard-icon">⌨</span></div>
      </section>
    </main>
  );
}

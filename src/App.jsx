import React, { useState, useEffect } from 'react';
import { lessons } from './lessons.js';
import { runInterpreter } from './interpreter.js';

// HTML文字列を安全に表示するためのコンポーネント
function DangerouslySetHTML({ html }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

function App() {
  const [currentLessonKey, setCurrentLessonKey] = useState('variables');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [code, setCode] = useState("");
  const [output, setOutput] = useState('実行結果がここに表示されます...');
  const [outputColor, setOutputColor] = useState('#22c55e');
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState(null);
  
  const [isAboutModalOpen, setAboutModalOpen] = useState(false);
  const currentLesson = lessons[currentLessonKey];
  
  useEffect(() => {
    setSelectedOption(null);
    setShowExplanation(false);
    if (currentLesson.examples) {
      const firstTabKey = currentLesson.examples[0].key;
      setActiveTabKey(firstTabKey);
      setCode(currentLesson.examples[0].code);
    } else {
      setActiveTabKey(null);
      setCode(currentLesson.example);
    }
  }, [currentLessonKey]);

  // ▼▼▼ ボタンアニメーション用の関数をこの場所へ移動 ▼▼▼
  const animateButton = (event) => {
    const button = event.currentTarget;
    button.classList.add('btn-active');
    setTimeout(() => {
        button.classList.remove('btn-active');
    }, 150);
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const openAboutModal = () => setAboutModalOpen(true);
  const closeAboutModal = () => setAboutModalOpen(false);

  const executeCode = (event) => {
    animateButton(event);
    const result = runInterpreter(code);
    if (result.error) { setOutput(result.error); setOutputColor('#e999dfff'); } 
    else { setOutput(result.output); setOutputColor('#22c55e'); }
  };
  
  const clearOutput = (event) => {
      animateButton(event);
      setOutput('実行結果がここに表示されます...');
      setOutputColor('#22c55e');
  };

  const loadExample = (event) => {
    animateButton(event);
    if (currentLesson.examples) {
      const activeExample = currentLesson.examples.find(ex => ex.key === activeTabKey);
      if (activeExample) setCode(activeExample.code);
    } else {
      setCode(currentLesson.example);
    }
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
    setShowExplanation(true);
  };
  
  const handleTabClick = (example) => {
    setActiveTabKey(example.key);
    setCode(example.code);
  };

  let theoryContent;
  if (currentLesson.examples) {
    const activeExample = currentLesson.examples.find(ex => ex.key === activeTabKey);
    theoryContent = activeExample ? activeExample.theory : "";
  } else {
    theoryContent = currentLesson.theory;
  }

  return (
    <>
      <header className="header">
        <div className="header-left">
          <button className="hamburger" onClick={toggleSidebar}>
            <span></span><span></span><span></span>
          </button>
          <h1 className="app-title">共通テスト「情報」プログラミング学習</h1>
        </div>
        <div className="header-right">
          <button className="btn btn-secondary" onClick={openAboutModal}>
            このサイトについて
          </button>
        </div>
      </header>

      <nav className={`sidebar ${isSidebarOpen ? 'open' : ''}`} id="sidebar">
         <div className="sidebar-header">
            <h2 className="sidebar-title">学習メニュー</h2>
            <p className="sidebar-subtitle">疑似コードを実際に書いてみよう</p>
        </div>
        <div className="menu-list">
          {Object.keys(lessons).map((key, index) => (
            <button 
              key={key}
              className={`menu-item ${currentLessonKey === key ? 'active' : ''}`} 
              onClick={() => {
                setCurrentLessonKey(key);
                closeSidebar();
              }}>
              <span className="menu-item-number">{index + 1}</span>
              {lessons[key].title}
            </button>
          ))}
        </div>
        <div className="sidebar-footer">
            <button className="menu-item" onClick={openAboutModal}>
                このサイトについて
            </button>
        </div>
      </nav>

      <div className={`overlay ${isSidebarOpen ? 'show' : ''}`} id="overlay" onClick={closeSidebar}></div>

      <main className="main-content">
        <div className="content-grid">
          <section className="content-section">
            <header className="section-header"><h2 className="section-title">理論・解説</h2></header>
            <div className="section-content">
              {currentLesson.examples && (
                <div className="example-tabs">
                  {currentLesson.examples.map(ex => (
                    <button 
                      key={ex.key} 
                      className={`tab-button ${activeTabKey === ex.key ? 'active' : ''}`}
                      onClick={() => handleTabClick(ex)}
                    >
                      {ex.tabName}
                    </button>
                  ))}
                </div>
              )}
              <div id="theory-content" className="theory-content">
                <DangerouslySetHTML html={theoryContent} />
              </div>
            </div>
          </section>

          <section className="content-section">
            <header className="section-header"><h2 className="section-title">実践・コード実行</h2></header>
            <div className="section-content">
              <p style={{ marginBottom: '16px', color: '#64748b' }}>下のエディタに疑似コードを入力して実行してみましょう。</p>
              <div className="indent-warning">
                <span className="warning-icon">⚠️</span>
                <p>
                <strong>注意！ </strong> <code>もし</code> や <code>繰り返し</code> の中身は、必ず先頭に<strong>全角スペース2つ</strong>を入れて下さい。
                <br/>
                <div className='warning-detail'>（先頭にある全角スペースの個数で「もし」や「繰り返し」の<strong>範囲</strong>を判定しています</div>
                </p>
              </div>
              <div className="indent-warning">
                <span className="warning-icon">⚠️</span>
                <p><strong>注意！ </strong>プログラム（特に記号）は <strong>半角英数字</strong> で記述して下さい。</p>
              </div>
              <div className="indent-warning">
                <span className="warning-icon">⚠️</span>
                <p><strong></strong>コーディングのルールは共通テストの擬似言語とほぼ同じです。</p>
              </div>
              <textarea 
                id="code-editor" 
                className="code-editor" 
                placeholder="ここにコードを入力してください..."
                value={code}
                onChange={(e) => setCode(e.target.value)}
              ></textarea>
              {/* ▼▼▼ ボタンの記述をReact(JSX)形式に修正 ▼▼▼ */}
              <div className="button-group">
                <button className="btn btn-primary" onClick={executeCode}>実行</button>
                <button className="btn btn-secondary" onClick={clearOutput}>出力クリア</button>
                <button className="btn btn-secondary" onClick={loadExample}>例を表示</button>
              </div>
              <p>実行結果</p>
              <div className="output" id="output" style={{ color: outputColor }}>
                {output}
              </div>
            </div>
          </section>

          <section className="content-section">
            <header className="section-header"><h2 className="section-title">理解度チェック</h2></header>
            <div className="section-content">
              <div id="quiz-content">
                <div className="quiz-question">
                  <h4>問題：{currentLesson.quiz.question}</h4>
                  <div className="quiz-code">
                    <DangerouslySetHTML html={currentLesson.quiz.code.split('\n').map(line => `<div className="code-line">${line}</div>`).join('')} />
                  </div>
                </div>
                <div className="quiz-options">
                  {currentLesson.quiz.options.map((option, index) => {
                    let optionClass = 'quiz-option';
                    if (showExplanation) {
                      if (option.correct) {
                        optionClass += ' correct';
                      } else if (selectedOption === index) {
                        optionClass += ' incorrect';
                      }
                    }
                    return (
                      <div key={index} className={optionClass} onClick={() => handleOptionSelect(index)}>
                        {option.text}
                      </div>
                    );
                  })}
                </div>
                {showExplanation && (
                  <div id="quiz-explanation" className="quiz-explanation">
                    <DangerouslySetHTML html={currentLesson.quiz.explanation} />
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      {isAboutModalOpen && (
        <div className="modal-overlay" onClick={closeAboutModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">このサイトについて</h2>
            <ul className="modal-list">
              <li>共通テストにおける【情報】の対策用サイトです。</li>
              <li>あくまで学習の「補助」としてお使い下さい。このサイトを使用して発生した損害の責任は負いかねます。</li>
              <li>このサイトは【プログラム・プログラミングの流れや感覚を掴んだり、抵抗感を減らすこと】が目的のものです。そのため、一部共通テストで用いられている擬似言語とは「仕様や動作が異なる箇所」や「動作が不安定な箇所」があるかもしれません。ご容赦ください。</li>
              <li>制作の一部工程に生成AI（Gemini, Claude）を使用しています。</li>
            </ul>
            <p className="modal-footer">受験、応援しています！</p>
            <button className="btn btn-primary" onClick={closeAboutModal}>閉じる</button>
          </div>
        </div>
      )}

    </>
  );
}

export default App;
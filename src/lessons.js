export const lessons = {
            variables: {
                title: "変数と代入",
                theory: '<h3>変数と代入</h3><p>変数とは、数値や文字列などのデータを一時的に保管できる箱のようなものです。</p><div class="explanation-box"><strong>変数の特徴：</strong><br>• データを一時的に保管する<br>• 箱の中身を別の値に変更できる<br>• 変数名で大文字と小文字が区別される<br>• 初期値を代入することを初期化という</div><div class="code-example"><div class="code-line">name = "太郎"</div><div class="code-line">age = 17</div><div class="code-line">表示する("名前は", name, "です")</div><div class="code-line">表示する("年齢は", age, "歳です")</div></div><div class="key-points"><strong>重要なポイント：</strong><ul><li>文字列はダブルクォーテーションで囲む</li><li>数値はダブルクォーテーションで囲まない</li><li>変数名は意味のある名前をつける</li></ul></div>',
                example: 'name = "佐藤"\nsubject = "情報"\nscore = 85\n表示する(name, "さんの", subject, "の点数は", score, "点です")',
                quiz: {
                    question: "次のプログラムの実行結果はどれでしょうか？",
                    code: 'x = "Hello"\ny = "World"\n表示する(x + y)',
                    options: [{text: "A. Hello World", correct: false},{text: "B. HelloWorld", correct: true},{text: "C. xy", correct: false},{text: "D. エラー", correct: false}],
                    explanation: "<strong>正解：B. HelloWorld</strong><br>+演算子で文字列を結合すると、間にスペースは入りません。"
                }
            },
            arithmetic: {
                title: "算術演算子",
                theory: '<h3>算術演算子</h3><p>プログラムで四則演算などの算術的な計算を行うための記号です。</p><div class="explanation-box"><strong>共通テスト用プログラム表記の算術演算子：</strong><br>• + : 加算（足し算）<br>• - : 減算（引き算）<br>• * : 乗算（掛け算）<br>• / : 除算（割り算）<br>• % : 剰余（割り算の余り）</div><div class="code-example"><div class="code-line">a = 10</div><div class="code-line">b = 3</div><div class="code-line">表示する("足し算：", a + b)</div><div class="code-line">表示する("掛け算：", a * b)</div><div class="code-line">表示する("余り：", a % b)</div></div><div class="key-points"><strong>重要なポイント：</strong><ul><li>掛け算は「×」ではなく「*」を使用</li><li>演算の優先順位は数学と同じ</li><li>括弧を使って計算順序を明確にできる</li></ul></div>',
                example: 'a = 10\nb = 3\n表示する("足し算：", a + b)\n表示する("掛け算：", a * b)\n表示する("余り：", a % b)',
                quiz: {
                    question: "次のプログラムの実行結果は何でしょうか？",
                    code: 'a = 8\nb = 3\n表示する(a * b + 5)',
                    options: [{text: "A. 16", correct: false},{text: "B. 27", correct: false},{text: "C. 29", correct: true},{text: "D. 32", correct: false}],
                    explanation: "<strong>正解：C. 29</strong><br>計算順序：a * b + 5 = 8 * 3 + 5 = 24 + 5 = 29<br>乗算は加算より優先されます。"
                }
            },
            conditions: {
                title: "条件分岐（IF文）",
                theory: '<h3>条件分岐（IF文）</h3><p>条件によって処理を分岐させるための制御構造です。</p><div class="explanation-box"><strong>IF文の基本構造：</strong><br>• もし 条件 ならば: 処理<br>• そうでなければ: 処理<br>• 条件が真の場合に処理を実行<br>• 偽の場合は「そうでなければ」の処理を実行</div><div class="code-example"><div class="code-line">score = 85</div><div class="code-line">もし score >= 80 ならば:</div><div class="code-line">　　表示する("合格です")</div><div class="code-line">そうでなければ:</div><div class="code-line">　　表示する("不合格です")</div></div><div class="key-points"><strong>重要なポイント：</strong><ul><li>条件式は比較演算子を使用</li><li>インデント（字下げ）で処理の範囲を表す</li><li>「そうでなければ」は省略可能</li></ul></div>',
                example: 'score = 85\nもし score >= 80 ならば:\n　　表示する("合格です")\nそうでなければ:\n　　表示する("不合格です")',
                quiz: {
                    question: "次のプログラムでage = 16の場合の実行結果は？",
                    code: 'age = 16\nもし age >= 18 ならば:\n　　表示する("成人です")\nそうでなければ:\n　　表示する("未成年です")',
                    options: [{text: "A. 成人です", correct: false},{text: "B. 未成年です", correct: true},{text: "C. 何も表示されない", correct: false},{text: "D. エラー", correct: false}],
                    explanation: "<strong>正解：B. 未成年です</strong><br>16 >= 18は偽なので、「そうでなければ」の処理が実行されます。"
                }
            },
            comparison: {
                title: "比較演算子",
                theory: '<h3>比較演算子</h3><p>2つの値を比較して、真（true）または偽（false）を返す演算子です。</p><div class="explanation-box"><strong>主な比較演算子：</strong><br>• == : 等しい<br>• != : 等しくない<br>• > : より大きい<br>• < : より小さい<br>• >= : 以上<br>• <= : 以下</div><div class="code-example"><div class="code-line">a = 10</div><div class="code-line">b = 5</div><div class="code-line">表示する("a > b: ", a > b)</div><div class="code-line">表示する("a == b: ", a == b)</div><div class="code-line">表示する("a <= 10: ", a <= 10)</div></div><div class="key-points"><strong>重要なポイント：</strong><ul><li>等価比較は「==」（代入の「=」と区別）</li><li>文字列の比較も可能</li><li>条件分岐でよく使用される</li></ul></div>',
                example: 'a = 10\nb = 5\n表示する("a > b: ", a > b)\n表示する("a == b: ", a == b)\n表示する("a <= 10: ", a <= 10)',
                quiz: {
                    question: "次の条件式の結果はどれでしょうか？",
                    code: 'x = 7\ny = 3\n表示する(x * y > 20)',
                    options: [{text: "A. 真（true）", correct: true},{text: "B. 偽（false）", correct: false},{text: "C. 21", correct: false},{text: "D. エラー", correct: false}],
                    explanation: "<strong>正解：A. 真（true）</strong><br>x * y = 7 * 3 = 21で、21 > 20は真です。"
                }
            },
            logical: {
                title: "論理演算子",
                theory: '<h3>論理演算子</h3><p>論理演算子は、複数の条件を組み合わせて、より複雑な判定を行うために使います。「かつ（AND）」や「または（OR）」が代表的です。<br>「ベン図」で考えるとわかりやすいと思います。</p><div class="explanation-box"><strong>主な論理演算子：</strong><br>• <b>A かつ B</b>: AとBの両方の条件が真のときだけ、全体も真になります。<br>• <b>A または B</b>: AかBの少なくとも一方が真のとき、全体も真になります。</div><div class="code-example"><div class="code-line">score = 80</div><div class="code-line">出席日数 = 20</div><div class="code-line">もし score >= 80 かつ 出席日数 >= 20 ならば:</div><div class="code-line">　　表示する("成績優秀です")</div><div class="code-line">そうでなければ:</div><div class="code-line">　　表示する("よく頑張りました")</div></div><div class="key-points"><strong>重要なポイント：</strong><ul><li>条件式が複雑になるときに使うと便利</li><li>「かつ」と「または」の優先順位にも注意が必要</li></ul></div>',
                example: 'score = 80\n出席日数 = 20\nもし score >= 80 かつ 出席日数 >= 20 ならば:\n　　表示する("成績優秀です")\nそうでなければ:\n　　表示する("よく頑張りました")',
                quiz: {
                    question: "次のプログラムの実行結果はどれでしょうか？",
                    code: 'tenki = "hare"\nkion = 26\nもし tenki == "ame" または kion >= 25 ならば:\n　　表示する("半袖でOK")\nそうでなければ:\n　　表示する("長袖が良いかも")',
                    options: [{text: "A. 半袖でOK", correct: true},{text: "B. 長袖が良いかも", correct: false},{text: "C. 何も表示されない", correct: false},{text: "D. エラー", correct: false}],
                    explanation: '<strong>正解：A. 半袖でOK</strong><br>条件 `tenki == "ame"` は偽ですが、`kion >= 25` は真です。「または」は片方が真なら全体の条件も真になるため、`もし`の中の処理が実行されます。'
                }
            },
            loops: {
                title: "繰り返し文（For文）",
                theory: '<h3>繰り返し文（For文）</h3><p>繰り返し文は、同じ処理を何度も実行したい場合に使います。特に、決まった回数だけ処理を繰り返す際に便利です。</p><div class="explanation-box"><strong>基本構造：</strong><br><code>i（カウンター変数）を A から B まで C ずつ増やしながら繰り返す:</code><br>　　（ここに繰り返したい処理を書く）<br><br>この構造は、カウンターとなる「変数」(通常は i や j 、 k)を用意し、その開始値(A)、終了値(B)、そして一回ごとに変化する量(C)を指定します。</div><div class="code-example"><div class="code-line">合計 = 0</div><div class="code-line">iを 1 から 10 まで 1 ずつ増やしながら繰り返す:</div><div class="code-line">　　合計 = 合計 + i</div><div class="code-line">表示する("1から10までの合計は", 合計, "です")</div></div>',
                example: 'iを 1 から 5 まで 1 ずつ増やしながら繰り返す:\n　　表示する("現在", i, "回目の処理です")',
                quiz: {
                    question: "次のプログラムの実行結果はどれでしょうか？",
                    code: 'cnt = 0\niを 5 から 1 まで 1 ずつ減らしながら繰り返す:\n　　cnt = cnt + 1\n表示する(cnt)',
                    options: [{text: "A. 0", correct: false},{text: "B. 4", correct: false},{text: "C. 5", correct: true},{text: "D. エラー", correct: false}],
                    explanation: '<strong>正解：C. 5</strong><br>この繰り返し文は、変数 `i` の値が 5, 4, 3, 2, 1 のときにそれぞれ実行されます。合計で5回処理が繰り返されるため、変数 `cnt` の最終的な値は5になります。'
                }
            },
            whileLoops: {
                title: "繰り返し文（While文）",
                theory: '<h3>繰り返し文（While文）</h3><p>While文は、指定した条件が真（true）である間、処理を繰り返し実行します。For文が決まった回数の繰り返しを得意とするのに対し、While文は「特定の状態になるまで」処理を続けたい場合に便利です。</p><div class="explanation-box"><strong>基本構造：</strong><br><code>条件 の間、繰り返す:</code><br>　　（ここに繰り返したい処理を書く）<br><br>条件が偽（false）になった時点で、繰り返しは終了します。</div><div class="code-example"><div class="code-line">n = 10</div><div class="code-line">n > 0 の間、繰り返す:</div><div class="code-line">　　表示する(n)</div><div class="code-line">　　n = n - 1</div><div class="code-line">表示する("終了")</div></div><div class="key-points"><strong>重要なポイント：</strong><ul><li>ループ内で条件に関わる変数を更新しないと、無限ループに陥る危険がある</li><li>繰り返す回数が事前にわからない処理に適している</li></ul></div>',
                example: 'n = 10\nn > 0 の間、繰り返す:\n　　表示する(n)\n　　n = n - 1\n表示する("終了")',
                quiz: {
                    question: "次のプログラムを実行したとき、「こんにちは」は何回表示されますか？",
                    code: 'count = 5\ncount < 5 の間、繰り返す:\n　　表示する("こんにちは")\n　　count = count + 1',
                    options: [{text: "A. 0回", correct: true},{text: "B. 1回", correct: false},{text: "C. 5回", correct: false},{text: "D. 無限に繰り返される", correct: false}],
                    explanation: '<strong>正解：A. 0回</strong><br>最初の時点で変数 `count` は5であり、ループの条件 `count < 5` は偽（false）です。そのため、ループ内の処理は一度も実行されません。'
                }
            },
            array1d: {
        title: "配列（1次元）",
        theory: `
            <h3>配列（1次元）</h3>
            <p>配列は、複数のデータをまとめて管理するための仕組みです。<b>横にずらっと並んだマンションの部屋</b>をイメージしてください。</p>
            <div class="explanation-box">
                <strong>具体例：マンションの部屋番号</strong><br>
                <ul>
                    <li>配列全体が「パークハイツ」という名前のマンションです。</li>
                    <li>各部屋には <code>0</code>号室, <code>1</code>号室...と<b>一つの番号（添字）</b>が振られています。</li>
                    <li><code>パークハイツ[2]</code>のように、<code>配列名[番号]</code>で特定の部屋（データ）を指定できます。</li>
                </ul>
            </div>
            <div class="code-example">
                <div class="code-line">// 住人リストという配列を用意</div>
                <div class="code-line">Residents = ["佐藤", "鈴木", "高橋", "田中"]</div>
                <br>
                <div class="code-line">// 3号室(添字は2)の住人を入れ替える</div>
                <div class="code-line">Residents[2] = "伊藤"</div>
                <div class="code-line">表示する("3号室の表札は", Residents[2], "です")</div>
            </div>
            <h4>表で見る「場所」と「中身」</h4>
            <p><code>Residents</code> の中身は、以下のような対応関係になっています。</p>
            <table style="width:100%; border-collapse: collapse; text-align: center; margin: 1em 0;">
                <thead>
                    <tr>
                        <th style="border: 1px solid #ccc; padding: 8px;">場所 (添字)</th>
                        <th style="border: 1px solid #ccc; padding: 8px;"><code>[0]</code></th>
                        <th style="border: 1px solid #ccc; padding: 8px;"><code>[1]</code></th>
                        <th style="border: 1px solid #ccc; padding: 8px;"><code>[2]</code></th>
                        <th style="border: 1px solid #ccc; padding: 8px;"><code>[3]</code></th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ccc; padding: 8px;"><b>中身 (値)</b></td>
                        <td style="border: 1px solid #ccc; padding: 8px;">"佐藤"</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">"鈴木"</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">"伊藤"</td>
                        <td style="border: 1px solid #ccc; padding: 8px;">"田中"</td>
                    </tr>
                </tbody>
            </table>
            <div class="key-points">
                <strong>重要なポイント：</strong>
                <ul>
                    <li>最初の要素の添字は <code>0</code> から始まる。</li>
                    <li>N個の要素を持つ配列の最後の添字は <code>N-1</code>になる。</li>
                </ul>
            </div>
        `,
        example: '// 住人リストという配列を用意\nResidents = ["佐藤", "鈴木", "高橋", "田中"]\n表示する("3号室の表札は", Residents[2], "です")\n\n// 3号室(添字は2)の住人を入れ替える\nResidents[2] = "伊藤"\n表示する("1号室の表札は", Residents[2], "です")',
        quiz: {
            question: "次のプログラムの実行結果はどれでしょうか？",
            code: 'Data = [10, 20, 30, 40]\n表示する(Data[3])',
            options: [{text: "A. 20", correct: false},{text: "B. 30", correct: false},{text: "C. 40", correct: true},{text: "D. エラー", correct: false}],
            explanation: '<strong>正解：C. 40</strong><br>配列の添字は0から始まります。したがって、`Data[0]`が10、`Data[1]`が20、`Data[2]`が30、そして`Data[3]`は4番目の要素である40を指します。'
        }
    },
            array2d: {
    title: "配列（2次元）",
    examples: [
        {
            key: 'bookshelf',
            tabName: '例1：本棚 📚',
            theory: `
                <h3>配列（2次元）- 例1：本棚</h3>
                <p>2次元配列は<b>「棚」が集まってできた「本棚」全体</b>だと考えてみてください。</p>
                
                <h4>構造のイメージ</h4>
                <p>まず「本棚」という大きな箱があり、その中に「棚」という小さな箱（1次元配列）が並んでいます。</p>
                <div class="code-example">
                    <div class="code-line">本棚 = [</div>
                    <div class="code-line">　["国語", "数学", "歴史"],  // ← 📖 1段目の棚（添字は0）</div>
                    <div class="code-line">　["物理", "化学", "生物"],  // ← 📖 2段目の棚（添字は1）</div>
                    <div class="code-line">　["英語", "美術", "音楽"]   // ← 📖 3段目の棚（添字は2）</div>
                    <div class="code-line">]</div>
                    <br />
                    <div class="code-line">⚠️このサイトでは、</div>
                    <div class="code-line">本棚 = [["国語", "数学", "歴史"],["物理", "化学", "生物"],["英語", "美術", "音楽"]]</div>
                    <div class="code-line">このように配列を作ります。</div>
                </div>

                <h4>アクセス方法：「本棚[1][2]」の例</h4>
                <p><code>本棚[1][2]</code> と書くと、以下の2段階のステップで本を取り出します。</p>
                    <div class="table-container">
        <table>
            <thead>
                <tr>
                    <th>ステップ</th>
                    <th>コード</th>
                    <th>動き</th>
                    <th>取り出されるもの</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><b>1. 棚を選ぶ</b><br>(タテの移動)</td>
                    <td><code>本棚[1]</code></td>
                    <td>本棚全体から<b>2番目（添字に注意！）</b>の棚を選ぶ</td>
                    <td><code>["物理", "化学", "生物"]</code></td>
                </tr>
                <tr>
                    <td><b>2. 本を選ぶ</b><br>(ヨコの移動)</td>
                    <td><code>...[2]</code></td>
                    <td>選んだ棚の中から<b>3番目<br>（添字に注意！）</b>の本を選ぶ</td>
                    <td><code>"生物"</code></td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div class="key-points">
        <strong>重要なポイント：</strong>
        <ul>
            <li>2次元配列は「配列の配列」である。</li>
            <li><code>配列名[棚の段数][本の番号]</code>のように、2段階でアクセスする。</li>
            <li>添字は <code>0</code> から始まる。</li>
        </ul>
    </div>
`,
            code: '本棚 = [["国語", "数学", "歴史"],["物理", "化学", "生物"],["英語", "美術", "音楽"]]\n\n// 1段目の棚の、2番目の本を取り出す\n// 添字は「0」から始まるので・・・\ndan = 0\nbango = 1\n\n表示する(dan, "段目の", bango, "番目の本は…") //添字のままだと違和感\n表示する(dan + 1, "段目の", bango + 1, "番目の本は…")\n表示する(本棚[dan][bango])'
        },
        {
            key: 'theater',
            tabName: '例2：映画館 🎟️',
            theory: `
                <h3>配列（2次元）- 例2：映画館</h3>
                <p>2次元配列は<b>「横の列」が集まってできた「座席全体」</b>だと考えてみてください。</p>

                <h4>構造のイメージ</h4>
                <p>「座席全体」という大きな箱があり、その中に「横の列」という小さな箱（1次元配列）が並んでいます。</p>
                <div class="code-example">
                    <div class="code-line">SeatChart = [</div>
                    <div class="code-line">　[0, 1, 1, 0],  // ← 0番目の列（最前列）</div>
                    <div class="code-line">　[0, 0, 1, 0],  // ← 1番目の列</div>
                    <div class="code-line">　[1, 1, 0, 0]   // ← 2番目の列</div>
                    <div class="code-line">]</div>
                </div>

                <h4>アクセス方法：「SeatChart[2][1]」の例</h4>
                <p><code>SeatChart[2][1]</code> は、「<b>タテに2</b>進んだ段（3段目）の、<b>ヨコに1</b>進んだ場所（2番目）」を指します。</p>
                 <table style="width:100%; border-collapse: collapse; text-align: center; margin: 1em 0;">
                    <thead><tr><th style="border: 1px solid #ccc; padding: 8px;"></th><th style="border: 1px solid #ccc; padding: 8px;">ヨコ[0]</th><th style="border: 1px solid #ccc; padding: 8px;">ヨコ[1]</th><th style="border: 1px solid #ccc; padding: 8px;">ヨコ[2]</th><th style="border: 1px solid #ccc; padding: 8px;">ヨコ[3]</th></tr></thead>
                    <tbody>
                        <tr><td style="border: 1px solid #ccc; padding: 8px;"><b>タテ[0]</b></td><td style="border: 1px solid #ccc; padding: 8px;">0</td><td style="border: 1px solid #ccc; padding: 8px;">1</td><td style="border: 1px solid #ccc; padding: 8px;">1</td><td style="border: 1px solid #ccc; padding: 8px;">0</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 8px;"><b>タテ[1]</b></td><td style="border: 1px solid #ccc; padding: 8px;">0</td><td style="border: 1px solid #ccc; padding: 8px;">0</td><td style="border: 1px solid #ccc; padding: 8px;">1</td><td style="border: 1px solid #ccc; padding: 8px;">0</td></tr>
                        <tr><td style="border: 1px solid #ccc; padding: 8px;"><b>タテ[2]</b></td><td style="border: 1px solid #ccc; padding: 8px;">1</td><td style="border: 1px solid #ccc; padding: 8px; background-color: #eff6ff;"><b>1</b></td><td style="border: 1px solid #ccc; padding: 8px;">0</td><td style="border: 1px solid #ccc; padding: 8px;">0</td></tr>
                    </tbody>
                </table>
                <p>表を見ると、その場所には<code>1</code>（予約済）が入っているのが分かります。</p>
            `,
            code: '// 座席の予約状況 (0:空席, 1:予約済)\nSeatChart = [[0, 1, 1, 0], [0, 0, 1, 0], [1, 1, 0, 0]]\n\n// 確認したい座席のタテとヨコの添字\ntate = 2\nyoko = 1\n\n表示する(tate, "行目", yoko, "列目の席は...")\nもし SeatChart[tate][yoko] == 1 ならば:\n　　表示する("予約済みです。")\nそうでなければ:\n　　表示する("空いています。")'
        }
    ],
    quiz: {
        question: "「タテ→ヨコ」の順でアクセスする次の配列で、`Table[2][0]`は何を指しますか？",
        code: 'Table = [[10, 20], [30, 40], [50, 60]]\n// Table[タテ][ヨコ]\n表示する(Table[2][0])',
        options: [{text: "A. 20", correct: false},{text: "B. 30", correct: false},{text: "C. 50", correct: true},{text: "D. 60", correct: false}],
        explanation: '<strong>正解：C. 50</strong><br><code>Table[2][0]</code>は「タテに2進んだ段（3段目）の、ヨコに0進んだ場所（1番目）」を指します。3段目は `[50, 60]` で、その中の1番目の要素は `50` です。'
    }
}
        };
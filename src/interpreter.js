// src/interpreter.js

// --- ヘルパー関数群 ---
function extractDisplayContent(line) { return line.substring(line.indexOf('(') + 1, line.lastIndexOf(')')); }
function extractCondition(line) { return line.substring(line.indexOf('もし ') + 3, line.lastIndexOf('ならば:')).trim(); }

function evaluateExpression(expr, variables) {
    expr = expr.trim();

    // ▼▼▼ 引数を分割するロジックを新しいものに置き換え ▼▼▼
    const parts = [];
    let currentPart = '';
    let inQuote = false;
    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        if (char === '"' && (i === 0 || expr[i-1] !== '\\')) {
            inQuote = !inQuote;
        }
        if (char === ',' && !inQuote) {
            parts.push(currentPart.trim());
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parts.push(currentPart.trim());

    // 引数が複数ある場合
    if (parts.length > 1) {
        const evaluatedParts = [];
        for (const part of parts) {
            if (part === '') continue; // 空のパーツは無視
            evaluatedParts.push(evaluateExpression(part, variables));
        }
        // スペースなしで結合
        return evaluatedParts.join('');
    }
    // ▲▲▲ ここまで ▲▲▲

    // --- 以下は単一の引数を評価するロジック (変更なし) ---
    const stringLiteralRegex = /^"((?:[^"\\]|\\.)*)"$/;
    if (stringLiteralRegex.test(expr)) {
        return expr.substring(1, expr.length - 1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    }

    if (variables.hasOwnProperty(expr)) { 
        const result = variables[expr];
        if (typeof result === 'boolean') {
            return result ? '真（true)' : '偽(false)';
        }
        return result;
    }

    if (!isNaN(expr) && expr !== '') { return parseFloat(expr); }
    
    try {
        const func = new Function('scope', `with(scope) { return ${expr}; }`);
        const result = func(variables);
        if (typeof result === 'boolean') {
            return result ? '真（true)' : '偽(false)';
        }
        return result;
    } catch (e) {
        throw e;
    }
}

function evaluateConditionForIf(condition, variables) {
    let expr = condition.replace(/ かつ /g, ' && ').replace(/ または /g, ' || ');
    try {
        const keys = Object.keys(variables);
        const values = Object.values(variables);
        const func = new Function(...keys, `return !!(${expr});`);
        return func(...values);
    } catch (e) {
        console.error("Condition evaluation failed:", { condition: condition, error: e });
        return false;
    }
}

function parseLoopStatement(line, variables) {
    const regex = /(\S+)\s*を\s*(.+)\s*から\s*(.+)\s*まで\s*(.+)\s*ずつ\s*(増やし|減らし)ながら繰り返す:/;
    const match = line.match(regex);
    if (!match) return null;
    const [, variable, startExpr, endExpr, stepExpr, direction] = match;
    const start = evaluateExpression(startExpr.trim(), variables);
    const end = evaluateExpression(endExpr.trim(), variables);
    const rawStep = evaluateExpression(stepExpr.trim(), variables);
    const step = (direction === '減らし') ? -Math.abs(rawStep) : Math.abs(rawStep);
    return { variable, start, end, step };
}

const executeAssignment = (line, scope) => {
    const parts = line.split('=');
    const leftHand = parts[0].trim();
    const expression = parts.slice(1).join('=').trim();
    const arrayMatch2D = leftHand.match(/(\S+)\[([^\]]+)\]\[([^\]]+)\]/);
    if (arrayMatch2D) {
        const [, varName, indexExpr1, indexExpr2] = arrayMatch2D;
        const index1 = evaluateExpression(indexExpr1, scope);
        const index2 = evaluateExpression(indexExpr2, scope);
        if (scope[varName] && Array.isArray(scope[varName][index1])) {
            scope[varName][index1][index2] = evaluateExpression(expression, scope);
        }
        return;
    }
    const arrayMatch1D = leftHand.match(/(\S+)\[([^\]]+)\]/);
    if (arrayMatch1D) {
        const [, varName, indexExpr] = arrayMatch1D;
        const index = evaluateExpression(indexExpr, scope);
        if (scope[varName] && Array.isArray(scope[varName])) {
            scope[varName][index] = evaluateExpression(expression, scope);
        }
        return;
    }
    const varName = leftHand;
    if (expression.startsWith('[') && expression.endsWith(']')) {
        scope[varName] = eval(expression);
    } else {
        scope[varName] = evaluateExpression(expression, scope);
    }
};

// --- 再帰的なブロック実行関数 ---
function executeBlock(lines, baseIndentLevel, scope, outputBuffer) {
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        try{
        const currentIndentMatch = line.match(/^\s*/);
        const currentIndent = currentIndentMatch ? currentIndentMatch[0] : "";

        if (currentIndent.length < baseIndentLevel && line.trim() !== '') {
            return i; 
        }

        const trimmedLine = line.trim();
        if (trimmedLine === '') { i++; continue; }

        const isDisplayFunc = trimmedLine.startsWith('表示する(');
        const isIfStatement = trimmedLine.startsWith('もし ');
        const isForLoop = /を.*から.*まで.*(増やし|減らし)ながら繰り返す:/.test(trimmedLine);
        const isWhileLoop = /の間、繰り返す:$/.test(trimmedLine);
        const isAssignment = trimmedLine.includes('=') && !/==|>=|<=|!=/.test(trimmedLine);

        if (isIfStatement) {
            const condition = extractCondition(trimmedLine);
            const conditionResult = evaluateConditionForIf(condition, scope);
            
            const ifBlockStartIndex = i + 1;
            let ifBlockEndIndex = ifBlockStartIndex;
            while (ifBlockEndIndex < lines.length && (lines[ifBlockEndIndex].match(/^\s*/)[0].length > currentIndent.length || lines[ifBlockEndIndex].trim() === '')) {
                ifBlockEndIndex++;
            }
            
            let elseBlockStartIndex = -1;
            let elseBlockEndIndex = -1;
            if (ifBlockEndIndex < lines.length && lines[ifBlockEndIndex].trim().startsWith('そうでなければ')) {
                 if (lines[ifBlockEndIndex].match(/^\s*/)[0].length === currentIndent.length) {
                    elseBlockStartIndex = ifBlockEndIndex + 1;
                    elseBlockEndIndex = elseBlockStartIndex;
                    while (elseBlockEndIndex < lines.length && (lines[elseBlockEndIndex].match(/^\s*/)[0].length > currentIndent.length || lines[elseBlockEndIndex].trim() === '')) {
                        elseBlockEndIndex++;
                    }
                }
            }

            if (conditionResult) {
                executeBlock(lines.slice(ifBlockStartIndex, ifBlockEndIndex), currentIndent.length + 4, scope, outputBuffer);
            } else if(elseBlockStartIndex !== -1) {
                executeBlock(lines.slice(elseBlockStartIndex, elseBlockEndIndex), currentIndent.length + 4, scope, outputBuffer);
            }
            
            i = elseBlockEndIndex !== -1 ? elseBlockEndIndex : ifBlockEndIndex;
        }
        else if (isForLoop) {
            const loopParams = parseLoopStatement(trimmedLine, scope);
            const loopBodyStartIndex = i + 1;
            let loopBodyEndIndex = loopBodyStartIndex;
            while (loopBodyEndIndex < lines.length && (lines[loopBodyEndIndex].match(/^\s*/)[0].length > currentIndent.length || lines[loopBodyEndIndex].trim() === '')) {
                loopBodyEndIndex++;
            }
            const loopBody = lines.slice(loopBodyStartIndex, loopBodyEndIndex);

            if (loopParams && loopBody.length > 0) {
                const { variable, start, end, step } = loopParams;
                for (let j = start; (step > 0 ? j <= end : j >= end); j += step) {
                    scope[variable] = j;
                    executeBlock(loopBody, currentIndent.length + 4, scope, outputBuffer);
                }
            }
            i = loopBodyEndIndex;
        }
        else if (isWhileLoop) {
             const condition = trimmedLine.substring(0, trimmedLine.indexOf('の間、繰り返す:')).trim();
             const loopBodyStartIndex = i + 1;
             let loopBodyEndIndex = loopBodyStartIndex;
             while (loopBodyEndIndex < lines.length && (lines[loopBodyEndIndex].match(/^\s*/)[0].length > currentIndent.length || lines[loopBodyEndIndex].trim() === '')) {
                 loopBodyEndIndex++;
             }
             const loopBody = lines.slice(loopBodyStartIndex, loopBodyEndIndex);

             if (loopBody.length > 0) {
                 let loopCount = 0; const maxLoops = 1000;
                 while (evaluateConditionForIf(condition, scope)) {
                     if (loopCount++ > maxLoops) throw new Error("無限ループの可能性があります。");
                     executeBlock(loopBody, currentIndent.length + 4, scope, outputBuffer);
                 }
             }
             i = loopBodyEndIndex;
        }
         else if (isDisplayFunc) {
            outputBuffer.push(evaluateExpression(extractDisplayContent(trimmedLine), scope));
            i++;
        } else if (isAssignment) {
            executeAssignment(trimmedLine, scope);
            i++;
        } else {
            i++;
        }
    }   catch (e) { // ▼▼▼ エラーを捕捉し、情報を付加して再スロー ▼▼▼
            e.lineNumber = i + 1; // 1から始まる行番号
            e.lineContent = line;
            throw e; // 上位のcatchブロックに投げる
        }
    }
    return i;
}

// --- メインの実行関数をエクスポート ---
export function runInterpreter(code) {
    code = code
        .replace(/\u201c/g, '"')  // 左ダブルクォート (U+201C)
        .replace(/\u201d/g, '"')  // 右ダブルクォート (U+201D)
        .replace(/\u2018/g, "'")  // 左シングルクォート (U+2018)
        .replace(/\u2019/g, "'")  // 右シングルクォート (U+2019)
        .replace(/\u00a0/g, " ");  // ノーブレークスペースを通常のスペースに変換 (U+00A0)
    // ▼▼▼ ここからセキュリティチェックを追加 ▼▼▼
    const blacklist = /\b(window|document|alert|script|eval|Function|setTimeout|setInterval|fetch|XMLHttpRequest)\b/i;
    if (blacklist.test(code)) {
        return {
            output: null,
            error: 'エラー: 安全でない可能性のあるコードが含まれているため、実行をブロックしました。変数名等を見直してみて下さいm(_ _)m'
        };
    }
    // ▲▲▲ ここまで ▲▲▲
    try {
        const lines = code.replace(/　/g, '    ').split('\n');
        const variables = {};
        const outputBuffer = [];
        
        executeBlock(lines, 0, variables, outputBuffer);

        return {
            output: outputBuffer.join('\n').trim() || '（出力なし）',
            error: null
        };
    }  catch (error) {
        // ▼▼▼ エラーメッセージの表示形式をリッチにする ▼▼▼
        let errorMessage = 'おっと、エラーのようです🥺もう一度コードを見直してみましょう: ' + error.message;
        if (error.lineNumber) {
            errorMessage += `\n場所: ${(error.lineNumber)}行目\nコード: ${error.lineContent.trim()}`;
        }
        return {
            output: null,
            error: errorMessage
        };
        // ▲▲▲ ここまで ▲▲▲
    }
}
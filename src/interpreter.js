// src/interpreter.js

// --- ヘルパー関数群 ---
function extractDisplayContent(line) { return line.substring(line.indexOf('(') + 1, line.lastIndexOf(')')); }
function extractCondition(line) { return line.substring(line.indexOf('もし ') + 3, line.lastIndexOf('ならば:')).trim(); }

function evaluateExpression(expr, variables) {
    expr = expr.trim();

    // ▼▼▼ 要素数()の処理を、より強力な再帰的な評価方法に変更 ▼▼▼
    // この処理は、他の計算よりも先に行う必要があります。
    if (expr.startsWith('要素数(') && expr.endsWith(')')) {
        const innerExpr = expr.substring('要素数('.length, expr.length - 1);
        // 括弧の中身をまず評価する
        const arrayValue = evaluateExpression(innerExpr, variables);
        if (Array.isArray(arrayValue)) {
            return arrayValue.length;
        }
    }
    // ▲▲▲ ここまで ▲▲▲

    expr = expr.replace(/乱数\s*\(\s*\)/g, () => Math.random());
    expr = expr.replace(/整数\s*\(/g, 'Math.floor(');
    
    // `要素数()`が式の一部として使われる場合（例：要素数(Data) - 1）
    expr = expr.replace(/要素数\s*\(\s*(\S+?)\s*\)/g, (match, varName) => {
        if (variables[varName] && Array.isArray(variables[varName])) {
            return variables[varName].length;
        }
        return match;
    });
    
    const containsIntDivision = expr.includes('÷');
    if (containsIntDivision) {
        expr = expr.replace(/÷/g, '/');
    }

    const parts = [];
    let currentPart = '';
    let inQuote = false;
    let bracketDepth = 0;
    for (let i = 0; i < expr.length; i++) {
        const char = expr[i];
        if (char === '"' && (i === 0 || expr[i-1] !== '\\')) {
            inQuote = !inQuote;
        } else if (char === '[' && !inQuote) {
            bracketDepth++;
        } else if (char === ']' && !inQuote) {
            bracketDepth--;
        }

        if (char === ',' && !inQuote && bracketDepth === 0) {
            parts.push(currentPart.trim());
            currentPart = '';
        } else {
            currentPart += char;
        }
    }
    parts.push(currentPart.trim());

    if (parts.length > 1 && expr.includes(',')) {
        const evaluatedParts = [];
        for (const part of parts) {
            if (part === '') continue;
            evaluatedParts.push(evaluateExpression(part, variables));
        }
        return evaluatedParts.join('');
    }

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
        const keys = Object.keys(variables);
        const values = Object.values(variables);
        const func = new Function(...keys, `return ${expr};`);
        let result = func(...values);
        
        if (containsIntDivision && typeof result === 'number') {
            result = Math.floor(result);
        }

        if (typeof result === 'boolean') {
            return result ? '真（true)' : '偽(false)';
        }
        return result;
    } catch (e) {
        throw e;
    }
}

function evaluateConditionForIf(condition, variables) {
    // and, or, not に対応
    let expr = condition
        .replace(/ かつ | and /gi, ' && ')
        .replace(/ または | or /gi, ' || ')
        .replace(/ not /gi, ' !');
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

    // 複数代入の処理
    if (leftHand.includes(',') && expression.includes(',')) {
        const leftVars = leftHand.split(',').map(v => v.trim());
        const rightExprs = expression.split(',').map(e => e.trim());

        if (leftVars.length === rightExprs.length) {
            const tempResults = rightExprs.map(expr => evaluateExpression(expr, scope));
            leftVars.forEach((varName, index) => {
                scope[varName] = tempResults[index];
            });
            return;
        }
    }

    // 単一代入の処理
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
    scope[varName] = evaluateExpression(expression, scope);
};

function executeBlock(lines, baseIndentLevel, scope, outputBuffer) {
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        try {
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
                let conditionMet = false;
                let currentIndex = i;

                // もし (if)
                const ifCondition = extractCondition(lines[currentIndex].trim());
                let blockStartIndex = currentIndex + 1;
                let blockEndIndex = blockStartIndex;
                while (blockEndIndex < lines.length && (lines[blockEndIndex].match(/^\s*/)[0].length > currentIndent.length || lines[blockEndIndex].trim() === '')) {
                    blockEndIndex++;
                }
                if (evaluateConditionForIf(ifCondition, scope)) {
                    conditionMet = true;
                    executeBlock(lines.slice(blockStartIndex, blockEndIndex), currentIndent.length + 4, scope, outputBuffer);
                }
                currentIndex = blockEndIndex;

                // そうでなくもし (else if)
                while (currentIndex < lines.length && lines[currentIndex].trim().startsWith('そうでなくもし')) {
                    const elseIfLine = lines[currentIndex].trim();
                    blockStartIndex = currentIndex + 1;
                    blockEndIndex = blockStartIndex;
                    while (blockEndIndex < lines.length && (lines[blockEndIndex].match(/^\s*/)[0].length > currentIndent.length || lines[blockEndIndex].trim() === '')) {
                        blockEndIndex++;
                    }

                    if (!conditionMet) {
                        const elseIfCondition = elseIfLine.substring(elseIfLine.indexOf('もし ') + 3, elseIfLine.lastIndexOf('ならば:')).trim();
                        if (evaluateConditionForIf(elseIfCondition, scope)) {
                            conditionMet = true;
                            executeBlock(lines.slice(blockStartIndex, blockEndIndex), currentIndent.length + 4, scope, outputBuffer);
                        }
                    }
                    currentIndex = blockEndIndex;
                }

                // そうでなければ (else)
                if (currentIndex < lines.length && lines[currentIndex].trim().startsWith('そうでなければ')) {
                    blockStartIndex = currentIndex + 1;
                    blockEndIndex = blockStartIndex;
                    while (blockEndIndex < lines.length && (blockEndIndex < lines.length && (lines[blockEndIndex].match(/^\s*/)[0].length > currentIndent.length || lines[blockEndIndex].trim() === ''))) {
                        blockEndIndex++;
                    }
                    if (!conditionMet) {
                        executeBlock(lines.slice(blockStartIndex, blockEndIndex), currentIndent.length + 4, scope, outputBuffer);
                    }
                    currentIndex = blockEndIndex;
                }
                i = currentIndex;
                continue;
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
                const content = extractDisplayContent(trimmedLine);
                const parts = [];
                let currentPart = '';
                let inQuote = false;
                let bracketDepth = 0;
                for (let charIndex = 0; charIndex < content.length; charIndex++) {
                    const char = content[charIndex];
                    if (char === '"' && (charIndex === 0 || content[charIndex-1] !== '\\')) { inQuote = !inQuote; } 
                    else if (char === '[' && !inQuote) { bracketDepth++; } 
                    else if (char === ']' && !inQuote) { bracketDepth--; }
                    if (char === ',' && !inQuote && bracketDepth === 0) {
                        parts.push(currentPart);
                        currentPart = '';
                    } else {
                        currentPart += char;
                    }
                }
                parts.push(currentPart);

                const evaluatedParts = [];
                for (const part of parts) {
                    if (part.trim() === '') continue;
                    evaluatedParts.push(evaluateExpression(part, scope));
                }
                outputBuffer.push(evaluatedParts.join(''));
                i++;
            } else if (isAssignment) {
                executeAssignment(trimmedLine, scope);
                i++;
            } else {
                i++;
            }
        } catch (e) {
            e.lineNumber = i + 1;
            e.lineContent = line;
            throw e;
        }
    }
    return i;
}

// --- メインの実行関数をエクスポート ---
export function runInterpreter(code) {
    // スマートクォートなどを標準的な記号に変換
    code = code
        .replace(/\u201c/g, '"')
        .replace(/\u201d/g, '"')
        .replace(/\u2018/g, "'")
        .replace(/\u2019/g, "'")
        .replace(/\u00a0/g, " ");

    let processedCode = code.replace(/#.*$/gm, '');

    // セキュリティチェック
    const blacklist = /\b(window|document|alert|script|eval|Function|setTimeout|setInterval|fetch|XMLHttpRequest)\b/i;
    if (blacklist.test(processedCode)) {
        return {
            output: null,
            error: 'エラー: 安全でない可能性のあるコードが含まれているため、実行をブロックしました。'
        };
    }
    
    try {
        const lines = processedCode.replace(/　/g, '    ').split('\n');
        const variables = {
            '階乗': (n) => {
                if (n < 0 || !Number.isInteger(n)) return NaN;
                if (n === 0) return 1;
                let result = 1;
                for (let i = n; i > 0; i--) result *= i;
                return result;
            }
        };
        const outputBuffer = [];
        
        executeBlock(lines, 0, variables, outputBuffer);

        return {
            output: outputBuffer.join('\n').trim() || '（出力なし）',
            error: null
        };
    }catch (error) {
        let errorMessage = 'おっと、エラーのようです😓もう一度コードを見直してみましょう: ' + error.message;
        if (error.lineNumber) {
            errorMessage += `\n場所: ${error.lineNumber}行目\nコード: ${error.lineContent.trim()}`;
        }
        return {
            output: null,
            error: errorMessage
        };
    }
}
document.getElementById('analyzeBtn').addEventListener('click', analyze);

function getSignature(expr) {
    const operators = {
        '&&': 'AND', '&': 'AND', '∧': 'AND', 'AND': 'AND',
        '||': 'OR', '|': 'OR', '∨': 'OR', 'OR': 'OR',
        '^': 'XOR', '⊕': 'XOR', 'XOR': 'XOR',
        '!': 'NOT', '~': 'NOT', '¬': 'NOT', 'NOT': 'NOT',
        '->': 'IMP', '→': 'IMP', 'IMPLIES': 'IMP',
        '<->': 'BIC', '↔': 'BIC', '<=>': 'BIC', '≡': 'BIC', 'EQUIV': 'BIC',
        'NAND': 'NAND', '⊼': 'NAND',
        'NOR': 'NOR', '⊽': 'NOR'
    };

    function tokenize(input) {
        const cleaned = input.toUpperCase().replace(/\s+/g, '');
        const tokens = [];
        let i = 0;
        while (i < cleaned.length) {
            if (cleaned.slice(i, i + 3) === '<->') { tokens.push('<->'); i += 3; continue; }
            if (cleaned.slice(i, i + 2) === '->') { tokens.push('->'); i += 2; continue; }
            if (cleaned.slice(i, i + 3) === '<=>') { tokens.push('<=>'); i += 3; continue; }
            const two = cleaned.slice(i, i + 2);
            if (two === '&&' || two === '||') { tokens.push(two); i += 2; continue; }
            const ch = cleaned[i];
            if ('()&|^!~'.includes(ch) || '∧∨¬→↔⊕⊼⊽'.includes(ch)) {
                tokens.push(ch);
                i++;
                continue;
            }
            if (/\w/.test(ch)) {
                let j = i;
                while (j < cleaned.length && /[A-Z0-9]/.test(cleaned[j])) j++;
                const word = cleaned.slice(i, j);
                if (operators[word]) {
                    tokens.push(word);
                } else if (word === 'TRUE' || word === 'FALSE' || word === 'T' || word === 'F') {
                    tokens.push(word);
                } else {
                    tokens.push(word); // variable
                }
                i = j;
                continue;
            }
            return null;
        }
        return tokens;
    }

    function parse(tokens) {
        let pos = 0;
        function peek() { return tokens[pos]; }
        function consume() { return tokens[pos++]; }
        function parseExpression() { return parseBiconditional(); }

        function parseBiconditional() {
            let node = parseImplication();
            while (peek() && ['<->', '↔', '<=>', '≡', 'EQUIV'].includes(peek()) || (operators[peek()] === 'BIC')) {
                const op = consume();
                let right = parseImplication();
                node = { type: 'BIC', left: node, right };
            }
            return node;
        }

        function parseImplication() {
            let node = parseOr();
            while (peek() && ['->', '→', 'IMPLIES', 'IMP'].includes(peek()) || (operators[peek()] === 'IMP')) {
                consume();
                let right = parseOr();
                node = { type: 'IMP', left: node, right };
            }
            return node;
        }

        function parseOr() {
            let node = parseXor();
            while (peek() && (peek() === '|' || peek() === '∨' || peek() === '||' || operators[peek()] === 'OR')) {
                consume();
                let right = parseXor();
                node = { type: 'OR', left: node, right };
            }
            return node;
        }

        function parseXor() {
            let node = parseAnd();
            while (peek() && (peek() === '^' || peek() === '⊕' || operators[peek()] === 'XOR')) {
                consume();
                let right = parseAnd();
                node = { type: 'XOR', left: node, right };
            }
            return node;
        }

        function parseAnd() {
            let node = parseUnary();
            while (peek() && (peek() === '&' || peek() === '∧' || peek() === '&&' || operators[peek()] === 'AND')) {
                consume();
                let right = parseUnary();
                node = { type: 'AND', left: node, right };
            }
            return node;
        }

        function parseUnary() {
            const token = peek();
            if (!token) return null;
            if (token === '!' || token === '~' || token === '¬' || operators[token] === 'NOT') {
                consume();
                const operand = parseUnary();
                return { type: 'NOT', value: operand };
            }
            if (token === '(') {
                consume();
                const inside = parseExpression();
                if (peek() !== ')') return null;
                consume();
                return inside;
            }
            if (/^[A-Z][A-Z0-9]*$/.test(token)) {
                consume();
                if (token === 'TRUE' || token === 'T') return { type: 'CONST', value: true };
                if (token === 'FALSE' || token === 'F') return { type: 'CONST', value: false };
                return { type: 'VAR', name: token };
            }
            return null;
        }

        const result = parseExpression();
        if (pos !== tokens.length) return null;
        return result;
    }

    function evaluate(ast, map) {
        if (!ast) return null;
        switch (ast.type) {
            case 'CONST': return ast.value;
            case 'VAR': return Boolean(map[ast.name] || false);
            case 'NOT': return !evaluate(ast.value, map);
            case 'AND': return evaluate(ast.left, map) && evaluate(ast.right, map);
            case 'OR': return evaluate(ast.left, map) || evaluate(ast.right, map);
            case 'XOR': {
                const l = evaluate(ast.left, map);
                const r = evaluate(ast.right, map);
                return Boolean(l) !== Boolean(r);
            }
            case 'IMP': {
                const l = evaluate(ast.left, map);
                const r = evaluate(ast.right, map);
                return !l || r;
            }
            case 'BIC': {
                const l = evaluate(ast.left, map);
                const r = evaluate(ast.right, map);
                return l === r;
            }
            case 'NAND': {
                const l = evaluate(ast.left, map);
                const r = evaluate(ast.right, map);
                return !(l && r);
            }
            case 'NOR': {
                const l = evaluate(ast.left, map);
                const r = evaluate(ast.right, map);
                return !(l || r);
            }
            default:
                return null;
        }
    }

    const tokens = tokenize(expr);
    if (!tokens) return null;

    const ast = parse(tokens);
    if (!ast) return null;

    const results = [];
    for (let p of [true, false]) {
        for (let q of [true, false]) {
            for (let r of [true, false]) {
                const env = { P: p, Q: q, R: r };
                results.push(Boolean(evaluate(ast, env)));
            }
        }
    }

    return results.map(v => v ? 'true' : 'false').join(',');
}

function analyze() {
    const input = document.getElementById('logicInput').value.trim();
    const resArea = document.getElementById('result-area');
    const label = document.getElementById('lawLabel');
    const name = document.getElementById('lawName');
    const equiv = document.getElementById('lawEquiv');
    const tableContainer = document.getElementById('truth-table-container');

    if (!input) return;

    const inputSig = getSignature(input);
    if (!inputSig) {
        alert("Syntax Error! Use P, Q, R, &, |, !, ->, <->");
        return;
    }

    const laws = [
        { name: "Distributive Law", sig: getSignature("P & (Q | R)"), equiv: "(P & Q) | (P & R)" },
        { name: "Distributive Law", sig: getSignature("P | (Q & R)"), equiv: "(P | Q) & (P | R)" },
        { name: "Associative Law", sig: getSignature("(P & Q) & R"), equiv: "P & (Q & R)" },
        { name: "De Morgan's (3-Var)", sig: getSignature("!(P & Q & R)"), equiv: "!P | !Q | !R" },
        { name: "Absorption Law", sig: getSignature("P | (P & Q)"), equiv: "P" },
        { name: "Biconditional Identity", sig: getSignature("(P -> Q) & (Q -> P)"), equiv: "P <-> Q" },
        { name: "Tautology", sig: "true,true,true,true,true,true,true,true", equiv: "Always True" },
        { name: "Contradiction", sig: "false,false,false,false,false,false,false,false", equiv: "Always False" }
    ];

    const match = laws.find(l => l.sig === inputSig);

    // Render Table
    let tableHtml = `<table><tr><th>P</th><th>Q</th><th>R</th><th>Result</th></tr>`;
    const sigArray = inputSig.split(',');
    let i = 0;
    for (let p of ['T','F']) {
        for (let q of ['T','F']) {
            for (let r of ['T','F']) {
                const res = sigArray[i] === 'true';
                tableHtml += `<tr><td>${p}</td><td>${q}</td><td>${r}</td><td class="${res ? 'val-true' : 'val-false'}">${res ? 'T' : 'F'}</td></tr>`;
                i++;
            }
        }
    }
    tableHtml += `</table>`;
    tableContainer.innerHTML = tableHtml;

    // Determine tautology/contradiction/contingency
    const boolValues = sigArray.map(v => v === 'true');
    let statementType;
    if (boolValues.every(v => v)) {
        statementType = "Tautology";
    } else if (boolValues.every(v => !v)) {
        statementType = "Contradiction";
    } else {
        statementType = "Contingency";
    }

    const typeElem = document.getElementById('lawType');
    typeElem.innerText = statementType;

    // Display Results
    resArea.style.display = "block";
    if (match) {
        label.innerText = "Identity Matched";
        label.style.background = "var(--primary)";
        name.innerText = `${match.name} (${statementType})`;
        equiv.innerText = match.equiv;
    } else {
        label.innerText = "Custom Statement";
        label.style.background = "#64748b";
        name.innerText = `Unique Logic Pattern (${statementType})`;
        equiv.innerText = "No named standard identity found.";
    }
}
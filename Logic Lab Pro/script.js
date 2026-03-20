document.getElementById('analyzeBtn').addEventListener('click', analyze);

function getSignature(expr) {
    try {
        let results = [];
        // 8 combinations for P, Q, R
        for (let p of [true, false]) {
            for (let q of [true, false]) {
                for (let r of [true, false]) {
                    let temp = expr
                        .replace(/<->/g, ' === ')
                        .replace(/->/g, ' <= ')
                        .replace(/&/g, ' && ')
                        .replace(/\|/g, ' || ')
                        .replace(/!/g, ' ! ')
                        .replace(/\bP\b/g, p)
                        .replace(/\bQ\b/g, q)
                        .replace(/\bR\b/g, r);
                    results.push(eval(temp));
                }
            }
        }
        return results.join(',');
    } catch (e) { return null; }
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
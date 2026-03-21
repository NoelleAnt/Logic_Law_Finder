# 🧠 Logic Lab Pro: 3-Variable Edition

A sleek, browser-based tool for analyzing logical expressions with three variables (P, Q, R) or TRUE/FALSE constants. It evaluates expressions, generates truth tables, identifies matching logical laws, and determines if the statement is a tautology, contradiction, or contingency.

## 🚀 Features
* **Expression Analysis**: Parse and evaluate logical expressions with support for multiple operators.
* **Truth Table Generation**: Automatically generates a complete truth table for the input expression.
* **Law Identification**: Matches input against known logical identities like Distributive, Associative, De Morgan's, Absorption, and more.
* **Statement Classification**: Determines if the expression is always true (Tautology), always false (Contradiction), or contingent.
* **Modern UI**: Built with a "Glassmorphism" aesthetic using CSS backdrop filters for a sleek, modern look.
* **Instant Evaluation**: Uses a JavaScript logic engine to compute results on the fly.

## 📖 How to Use
1. **Input**: Enter a logical expression in the input field. Use variables `P`, `Q`, `R` or constants `TRUE`/`FALSE` (or `T`/`F`).
2. **Operators Supported**:
   - AND: `&`, `&&`, `∧`
   - OR: `|`, `||`, `∨`
   - NOT: `!`, `~`, `¬`
   - XOR: `^`, `⊕`
   - Implication: `->`, `→`, `IMP`
   - Biconditional: `<->`, `↔`, `<=`, `≡`, `EQUIV`
   - NAND: `NAND`, `⊼`
   - NOR: `NOR`, `⊽`
3. **Analyze**: Click the "Analyze Logic" button.
4. **Results**: View the truth table, identified law (if any), statement type, and equivalent simplification.

## 🛠️ The Math Behind It
The app uses a parser to build an Abstract Syntax Tree (AST) from the input expression. It then evaluates the expression for all 8 possible combinations of P, Q, R (or TRUE/FALSE). This generates a "signature" (truth table values) which is compared against a database of known logical laws. It also classifies the statement based on whether all outputs are true, all false, or mixed.

## 📂 Installation
No installation required!
1. Download the files: `index.html`, `script.js`, `style.css`.
2. Open `index.html` in any modern web browser (Chrome, Firefox, Safari, Edge).

## ⚖️ Supported Laws
* **Distributive Law**: `P & (Q | R)` ≡ `(P & Q) | (P & R)` and `P | (Q & R)` ≡ `(P | Q) & (P | R)`
* **Associative Law**: `(P & Q) & R` ≡ `P & (Q & R)`
* **De Morgan's Law (3-Variable)**: `!(P & Q & R)` ≡ `!P | !Q | !R`
* **Absorption Law**: `P | (P & Q)` ≡ `P`
* **Biconditional Identity**: `(P -> Q) & (Q -> P)` ≡ `P <-> Q`
* **Tautology**: Always true expressions
* **Contradiction**: Always false expressions

## 📝 Examples
- Input: `P & (Q | R)` → Matches Distributive Law
- Input: `!(P & Q & R)` → Matches De Morgan's (3-Var)
- Input: `P | !P` → Tautology
- Input: `P & !P` → Contradiction

Enjoy exploring Boolean logic!


# 🧠 Logic Lab Pro
A sleek, browser-based tool that uses **Truth Table Signatures** to identify fundamental laws of Boolean Algebra.

## 🚀 Features
* **Pattern Recognition**: Automatically identifies identities like De Morgan's, Absorption, and Distributive laws.
* **Modern UI**: Built with a "Glassmorphism" aesthetic using CSS backdrop filters.
* **Instant Evaluation**: Uses a JavaScript logic engine to generate truth tables on the fly.

## 📖 How to Use
1.  **Input**: Enter a logical expression using the following syntax:
    * `P`, `Q`: Variables
    * `&`: AND (Conjunction)
    * `|`: OR (Disjunction)
    * `!`: NOT (Negation)
2.  **Analyze**: Click "Identify Law."
3.  **Result**: The app will compare your input's truth table against a library of known discrete math identities.

## 🛠️ The Math Behind It
The app doesn't just look for strings, it evaluates the **Truth Table Signature**.

Every logical law has a unique "fingerprint." For example, the expression `!(P & Q)` always produces the sequence `[false, true, true, true]` across the four possible combinations of $P$ and $Q$. The app generates this sequence for your input and matches it against its internal database.

## 📂 Installation
No installation required! 
1. Save the code as `index.html`.
2. Open it in any modern web browser (Chrome, Firefox, Safari, Edge).

## ⚖️ Supported Laws
* **De Morgan's Laws**
* **Absorption Laws**
* **Double Negation**
* **Idempotent Laws**
* **Commutative Laws**


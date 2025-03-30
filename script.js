let currentQuestionIndex = 0;
let questions = [];
let selectedQuestions = []; // Liste mit 10 zufällig ausgewählten Fragen
let score = 0;

// 📥 Läd die Fragen aus der JSON-Datei und wählt 10 zufällige Fragen aus
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        console.log("📥 JSON geladen:", data);
        if (!data || data.length === 0) {
            console.error("⚠️ Keine Fragen verfügbar!");
        } else {
            questions = data;
            selectedQuestions = getRandomQuestions(questions, 10); // Wählt 10 zufällige Fragen aus
            loadQuestion(currentQuestionIndex); // 🔹 Lädt die erste Frage
        }
    })
    .catch(error => console.error("❌ Fehler beim Laden der JSON-Datei:", error));

// 📌 Funktion zum zufälligen Auswählen von 10 Fragen aus dem gesamten Fragenkatalog
function getRandomQuestions(allQuestions, num) {
    const shuffled = allQuestions.sort(() => 0.5 - Math.random()); // Mische die Fragen
    return shuffled.slice(0, num); // Wählt die ersten 10 Fragen aus
}

// 🔄 Lädt die aktuelle Frage
function loadQuestion(index) {
    console.log("🔄 Lade Frage:", index);

    if (selectedQuestions.length === 0) {
        console.error("⚠️ Keine Fragen vorhanden!");
        return;
    }

    const question = selectedQuestions[index];
    if (!question || !question.alternativfragen) {
        console.error("⚠️ Frage existiert nicht!");
        return;
    }

    const multipleChoiceQuestion = question.alternativfragen.find(altQuestion =>
        altQuestion.typ === "multiple_choice" && altQuestion.optionen
    );

    if (multipleChoiceQuestion) {
        const questionContainer = document.getElementById('question-container');
        questionContainer.innerHTML = ''; // Setzt den Inhalt für die aktuelle Frage

        const altQuestionContainer = document.createElement('div');
        altQuestionContainer.innerHTML = `<h3>${multipleChoiceQuestion.frage}</h3>`;

        // Erstelle die Antwortoptionen
        const optionsHtml = Object.keys(multipleChoiceQuestion.optionen).map((optionKey, index) => {
            const optionValue = multipleChoiceQuestion.optionen[optionKey];
            const letter = ['a', 'b', 'c', 'd'][index];

            return `
        <label class="option">
          <input type="radio" name="answer" value="${letter}" class="option-radio">
          ${optionValue}
        </label>
      `;
        }).join('');

        altQuestionContainer.innerHTML += `<div class="options">${optionsHtml}</div>`;
        questionContainer.appendChild(altQuestionContainer);

        // Fügt einen Event Listener für jede Antwortoption hinzu
        document.querySelectorAll(".option-radio").forEach(input => {
            input.addEventListener("change", checkAnswer);
        });

        // Speichert die richtigen Antworten
        correctAnswers = multipleChoiceQuestion.korrekte_antworten;
        console.log("Richtige Antwort:", correctAnswers);
    } else {
        console.error("⚠️ Keine Frage mit Multiple-Choice-Optionen vorhanden!");
    }

    // Steuerung der Schaltflächen für vorherige und nächste Frage
    document.getElementById('prev').classList.toggle('hidden', index === 0);
    document.getElementById('next').classList.toggle('hidden', index === selectedQuestions.length - 1);
}

// ✅ Überprüft die Antwort und aktualisiert die Punktzahl
// ✅ Überprüft die Antwort und aktualisiert die Punktzahl automatisch
function checkAnswer() {
    const selectedOption = document.querySelector('.option-radio:checked');
    if (!selectedOption) return;

    const selectedAnswer = selectedOption.value;

    // Greift auf die richtigen Antworten der aktuellen Frage zu
    const currentQuestion = selectedQuestions[currentQuestionIndex];
    const multipleChoiceQuestion = currentQuestion.alternativfragen.find(altQuestion => altQuestion.typ === "multiple_choice");

    if (!multipleChoiceQuestion || !multipleChoiceQuestion.korrekte_antworten) {
        console.error("⚠️ Richtige Antworten sind für diese Frage nicht definiert!");
        return;
    }

    const correctAnswers = multipleChoiceQuestion.korrekte_antworten;
    console.log("Richtige Antwort:", correctAnswers);

    const resultContainer = document.getElementById('result');
    if (correctAnswers.includes(selectedAnswer)) {
        resultContainer.innerHTML = '✅ Richtige Antwort!';
        resultContainer.style.color = 'green';
        score++;
    } else {
        resultContainer.innerHTML = '❌ Falsche Antwort!';
        resultContainer.style.color = 'red';
    }

    document.getElementById('score').innerText = `Punkte: ${score}`;

    // Wenn wir uns bei der letzten Frage befinden, verstecke den 'next'-Button und zeige den 'restart'-Button
    if (currentQuestionIndex === selectedQuestions.length - 1) {
        document.getElementById('next').classList.add('hidden');
        document.getElementById('restart').classList.remove('hidden');
    }
}

// ⏩ Nächste Frage
function nextQuestion() {
    if (currentQuestionIndex < selectedQuestions.length - 1) {
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex);
        document.getElementById("result").innerText = "";
    }
}

// ⏪ Vorherige Frage
function prevQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        loadQuestion(currentQuestionIndex);
        document.getElementById("result").innerText = "";
    }
}

// 🔄 Quiz neu starten
function restartQuiz() {
    score = 0;
    currentQuestionIndex = 0;
    selectedQuestions = getRandomQuestions(questions, 10); // Wählt 10 neue zufällige Fragen aus
    loadQuestion(currentQuestionIndex);
    document.getElementById('score').innerText = `Punkte: ${score}`;
    document.getElementById('restart').classList.add('hidden');
    document.getElementById('next').classList.remove('hidden');
}
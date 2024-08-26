const questions = [
    { question: "What is the capital of France?", correct: "Paris", options: ["Paris", "London", "Berlin", "Rome"] },
    { question: "What is the capital of Japan?", correct: "Tokyo", options: ["Tokyo", "Beijing", "Seoul", "Bangkok"] },
    { question: "What is the capital of Brazil?", correct: "Brasília", options: ["Venice", "Rome", "Milan", "Brasília"] },
    { question: "What is the capital of Amerika?", correct: "Washington d.c.", options: ["Washington d.c.", "Munich", "Berlin", "Frankfurt"] },
    { question: "What is the capital of India?", correct: "New Delhi", options: ["Barcelona", "New Delhi", "Seville", "Valencia"] }
];

let currentQuestion = 0;
let score = 0;
let timeLeft = 30;
let timer;
let userAnswers = [];

function startQuiz() {
    document.getElementById('start-container').style.display = 'none';  //it is hiding the start screen
    document.getElementById('quiz-info').style.display = 'block';       //displays the quiz
    document.getElementById('question-container').style.display = 'block';
    document.getElementById('next-btn').style.display = 'block';
    loadQuestion();                                                     //Displays the question
    startTimer();                                                       //Displays timer
}

function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').textContent = timeLeft;
        if (timeLeft === 0) {
            finalSubmission();
        }
    }, 1000);
}

function checkAnswer(selectedOption, answer) {
    const correctAnswer = questions[currentQuestion].correct;
    userAnswers[currentQuestion] = answer;

    if (answer === correctAnswer) {
        score++;
        selectedOption.classList.add('correct');
    } else {
        selectedOption.classList.add('wrong');
    }

    document.getElementById('score').textContent = score;
    document.querySelectorAll('.option').forEach(button => button.disabled = true);

    if (currentQuestion < questions.length - 1) {
        document.getElementById('next-btn').disabled = false;
    } else {
        document.getElementById('submit-btn').style.display = 'block';
        document.getElementById('next-btn').style.display = 'none';
    }
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
    document.getElementById('next-btn').disabled = true;
}

function loadQuestion() {
    document.getElementById('question-number').textContent = currentQuestion + 1;
    document.getElementById('question-text').textContent = questions[currentQuestion].question;
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    questions[currentQuestion].options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option');
        button.onclick = () => checkAnswer(button, option);
        optionsContainer.appendChild(button);
    });
}

function finalSubmission() {
    clearInterval(timer);
    document.getElementById('quiz-info').style.display = 'none';
    document.getElementById('question-container').style.display = 'none';
    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('next-btn').style.display = 'none';

    showResults();
}


function showResults() {
    document.getElementById('question-container').style.display = 'block';
    const resultContainer = document.getElementById('question-container');
    
    // Clear existing content
    resultContainer.innerHTML = '';

    // Create a message
    const message = document.createElement('h2');
    const percentage = Math.round((score / questions.length) * 100);
    if (score === questions.length) {
        message.innerHTML = `Congratulations! <br>You got ${score}/${questions.length} questions right! 🎉🎈`;
        resultContainer.style.textAlign = 'center';
        resultContainer.classList.add('balloons');

        // Trigger confetti when the quiz is completed perfectly
        triggerConfetti();
    } else {
        message.innerHTML = `Your final score is ${score}/${questions.length}. You got ${percentage}% correct.`;
    }
    resultContainer.appendChild(message);

    // Add review and try again buttons
    const reviewButton = document.createElement('button');
    reviewButton.textContent = 'Review Questions';
    reviewButton.onclick = () => reviewQuestions();
    reviewButton.classList.add('result-button');
    resultContainer.appendChild(reviewButton);

    const tryAgainButton = document.createElement('button');
    tryAgainButton.textContent = 'Try Again';
    tryAgainButton.onclick = () => location.reload();
    tryAgainButton.classList.add('result-button');
    resultContainer.appendChild(tryAgainButton);
}

// Function to trigger confetti
function triggerConfetti() {
    confetti({
        particleCount: 200,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Optional: Repeated confetti bursts
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const colors = ['#bb0000', '#ffffff','#ffffff'];

    (function frame() {
        confetti({
            particleCount: 7,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: colors
        });
        confetti({
            particleCount: 7,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: colors
        });

        if (Date.now() < animationEnd) {
            requestAnimationFrame(frame);
        }
    }());
}

function reviewQuestions() {
    const reviewContainer = document.getElementById('question-container');
    reviewContainer.innerHTML = `<h2>Review of Your Answers</h2><ul id="review-list"></ul>`;
    const reviewList = document.getElementById('review-list');

    questions.forEach((q, index) => {
        const listItem = document.createElement('li');
        const isCorrect = q.correct === userAnswers[index];
        listItem.innerHTML = `
            <strong>Question ${index + 1}:</strong> ${q.question}<br>
            <span class="${isCorrect ? 'correct' : 'wrong'}">Your Answer: ${userAnswers[index]}</span><br>
            <span>Correct Answer: ${q.correct}</span>
        `;
        listItem.classList.add(isCorrect ? 'correct' : 'wrong');
        reviewList.appendChild(listItem);
    });

    const backButton = document.createElement('button');
    backButton.textContent = 'Back';
    backButton.onclick = () => location.reload();
    reviewContainer.appendChild(backButton);
}
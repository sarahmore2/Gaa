// script.js - Interactive behavior for the Learn GAA page

// Wait until DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  /* ===== Responsive menu toggle (mobile) ===== */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      // Toggle nav visibility (simple show/hide)
      mainNav.style.display = expanded ? 'none' : 'flex';
    });
  }

  /* ===== Drag-and-drop "Place the Position" game ===== */
  const tokens = document.querySelectorAll('.token');
  const drops = document.querySelectorAll('.drop-target');
  let dragged = null;

  tokens.forEach(token => {
    token.addEventListener('dragstart', (e) => {
      dragged = token;
      // add a dragging style
      token.classList.add('dragging');
    });
    token.addEventListener('dragend', () => {
      token.classList.remove('dragging');
      dragged = null;
    });
  });

  drops.forEach(drop => {
    // allow drop
    drop.addEventListener('dragover', (e) => {
      e.preventDefault();
      drop.classList.add('over');
    });
    drop.addEventListener('dragleave', () => {
      drop.classList.remove('over');
    });
    drop.addEventListener('drop', (e) => {
      e.preventDefault();
      drop.classList.remove('over');
      if (!dragged) return;
      // If a token is already placed here, move it back to tokens area
      const existing = drop.querySelector('.token');
      const tokensContainer = document.querySelector('.tokens');
      if (existing) tokensContainer.appendChild(existing);
      // Place dragged token inside the drop-target
      drop.appendChild(dragged);
    });
  });

  // Allow tokens to be returned to the tokens list by dropping there
  const tokensArea = document.querySelector('.tokens');
  tokensArea.addEventListener('dragover', (e) => e.preventDefault());
  tokensArea.addEventListener('drop', (e) => {
    e.preventDefault();
    if (dragged) tokensArea.appendChild(dragged);
  });

  // Check answers logic
  const checkBtn = document.getElementById('checkPositions');
  const resetBtn = document.getElementById('resetPositions');
  const resultP = document.getElementById('positionResult');

  checkBtn.addEventListener('click', () => {
    let correct = 0;
    drops.forEach(drop => {
      const accept = drop.dataset.accept;
      const placed = drop.querySelector('.token');
      if (placed && placed.dataset.pos === accept) correct++;
    });
    const total = drops.length;
    if (correct === total) {
      resultP.textContent = `Great job! All ${total} positions are correct.`;
      resultP.style.color = '#2b9f78';
    } else {
      resultP.textContent = `${correct} / ${total} correct. Try again!`;
      resultP.style.color = '#f45d6c';
    }
  });

  resetBtn.addEventListener('click', () => {
    // Move all placed tokens back to tokens area
    const allPlaced = document.querySelectorAll('.drop-target .token');
    allPlaced.forEach(t => document.querySelector('.tokens').appendChild(t));
    resultP.textContent = '';
  });

  /* ===== Simple multiple-choice quiz ===== */
  const quizQuestions = [
    {
      q: "How many points is a goal (under the bar) worth in Gaelic football?",
      choices: ["1 point", "2 points", "3 points", "5 points"],
      a: 2
    },
    {
      q: "Which of these is a good pre-training snack?",
      choices: ["Candy bar only", "Banana and yoghurt", "Soda", "No food ever"],
      a: 1
    },
    {
      q: "True or false: Always warm up before playing.",
      choices: ["True", "False"],
      a: 0
    }
  ];

  let currentQ = 0;
  let score = 0;
  let answered = false;

  const questionText = document.getElementById('questionText');
  const choicesDiv = document.getElementById('choices');
  const submitBtn = document.getElementById('submitAnswer');
  const nextBtn = document.getElementById('nextQuestion');
  const feedback = document.getElementById('quizFeedback');
  const scoreDisplay = document.getElementById('scoreDisplay');

  function renderQuestion() {
    answered = false;
    feedback.textContent = '';
    const q = quizQuestions[currentQ];
    questionText.textContent = q.q;
    choicesDiv.innerHTML = '';
    q.choices.forEach((choice, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choiceBtn';
      btn.type = 'button';
      btn.textContent = choice;
      btn.dataset.index = idx;
      btn.addEventListener('click', () => {
        // Toggle selection - only one selection allowed
        const prev = choicesDiv.querySelector('.selected');
        if (prev) prev.classList.remove('selected');
        btn.classList.add('selected');
      });
      choicesDiv.appendChild(btn);
    });
    updateScoreDisplay();
  }

  function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score} / ${quizQuestions.length}`;
  }

  submitBtn.addEventListener('click', () => {
    if (answered) return;
    const selected = choicesDiv.querySelector('.choiceBtn.selected');
    if (!selected) {
      feedback.textContent = 'Please choose an answer first.';
      feedback.style.color = '#f45d6c';
      return;
    }
    const chosen = Number(selected.dataset.index);
    const correctIndex = quizQuestions[currentQ].a;
    if (chosen === correctIndex) {
      feedback.textContent = 'Correct!';
      feedback.style.color = '#2b9f78';
      score++;
    } else {
      feedback.textContent = `Not quite — the correct answer is: "${quizQuestions[currentQ].choices[correctIndex]}".`;
      feedback.style.color = '#f45d6c';
    }
    answered = true;
    updateScoreDisplay();
  });

  nextBtn.addEventListener('click', () => {
    currentQ++;
    if (currentQ >= quizQuestions.length) {
      // Quiz finished
      questionText.textContent = 'Quiz complete — well done!';
      choicesDiv.innerHTML = '';
      feedback.textContent = `Final score: ${score} / ${quizQuestions.length}`;
      feedback.style.color = '#2b9f78';
      submitBtn.disabled = true;
      nextBtn.disabled = true;
      return;
    }
    renderQuestion();
  });

  // Start the quiz
  renderQuestion();

});

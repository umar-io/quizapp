// DOM Element Selection
const main = document.querySelector(".main");
const regForm = document.querySelector(".regForm");
const pop_upload = document.querySelector(".pop_upload");
const upload_card = document.querySelector(".upload_card");
const proceed = document.querySelector(".proceed");
const fileInput = document.getElementById("file");
const profileImg = document.querySelector(".profile-img");
const image = document.querySelector(".success_img");
const close_proceed = document.querySelector(".close_proceed");
const start = document.querySelector(".start");
const decision = document.querySelector(".decision");
const quiz = document.querySelector(".quiz");
const timer = document.querySelector(".timer");
const audioName = "../static/audio/click.mp3";
const audio = new Audio(audioName);
const answer = document.querySelectorAll(".answer");
const questionArea = document.querySelector(".question-area");
const answertitle = document.querySelectorAll(".answer_title");
const result = document.querySelector(".result");
const actionbtn = document.querySelector(".actionbtn");
const body = document.querySelector("body");

const playSound = (audioName) => {
  const audio = new Audio(audioName);
  document.addEventListener(
    "click",
    () => {
      audio.play();
    },
    { once: true }
  );
};

let getTimer; // Declare getTimer outside the event listener

// Function to start the timer
function startTimer() {
  let duration = 5;
  getTimer = setInterval(() => {
    duration = duration - 1;
    timer.textContent = 0 + "" + duration;
    audio.play();
    const answerForm = document.querySelector(".response");
    const submitButton = answerForm.querySelector("button");
    submitButton.style.cursor = "not-allowed"
    submitButton.disabled = true;
    if (duration === 0) {
      const options = document.querySelectorAll("[name='answer']"); // Select all option spans
      options.forEach((option) => {
        option.style.cursor = "not-allowed"; // Set cursor to not-allowed
        option.disabled = true;

        submitButton.style.cursor = "pointer"
        submitButton.disabled = false;
      });

      clearInterval(getTimer);
    }
  }, 1000);
}

if (regForm) {
  // Event Listeners

  if (window.innerWidth < 768) {
    pop_upload.addEventListener("click", function () {
      upload_card.classList.toggle("mobile_slider");
    });
  } else {
    // Screen width is 768px or greater (desktop)
    pop_upload.addEventListener("click", function () {
      upload_card.classList.toggle("slider");
    });
  }

  fileInput.addEventListener("change", (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      profileImg.src = e.target.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    } else {
      profileImg.src = "../static/images/avatar.png"; // Reset to default
    }
  });

  let errorSpan = document.querySelectorAll(".error");

  errorSpan.forEach((span) => (span.textContent = ""));

  regForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const username = document.querySelector("[name='username']");
    const email = document.querySelector("[name='email']");
    const password = document.querySelector("[name='password']");
    const confirm_password = document.querySelector(
      "[name='confirm_password']"
    );

    // Reset error messages
    errorSpan.forEach((span) => (span.textContent = ""));

    let hasErrors = false;

    // Validation checks
    if (username.value.trim() === "") {
      errorSpan[0].textContent = "Username is required";
      setTimeout(() => {
        errorSpan[0].textContent = "";
      }, 3000);
      hasErrors = true;
    }

    if (email.value.trim() === "") {
      errorSpan[1].textContent = "Email is required";
      setTimeout(() => {
        errorSpan[1].textContent = "";
      }, 3000);
      hasErrors = true;
    }

    if (password.value.trim() === "") {
      errorSpan[2].textContent = "Password is required";
      setTimeout(() => {
        errorSpan[2].textContent = "";
      }, 3000);
      hasErrors = true;
    }

    if (confirm_password.value.trim() === "") {
      errorSpan[3].textContent = "Enter your password again";
      setTimeout(() => {
        errorSpan[3].textContent = "";
      }, 3000);
      hasErrors = true;
    }

    if (password.value.trim() !== confirm_password.value.trim()) {
      errorSpan[3].textContent = "Make sure both passwords match";
      setTimeout(() => {
        errorSpan[3].textContent = "";
      }, 3000);
      hasErrors = true;
    }

    if (!hasErrors) {
      const regForm = e.target;
      const formData = new FormData(regForm);

      fetch(regForm.action, {
        method: regForm.method,
        body: formData,
        headers: {
          "X-CRSFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
      })
        .then((response) => {
          if (response.status === 200) {
            // Handle successful registration
            main.style.display = "none";
            proceed.classList.add("show_proceed");
            setTimeout(() => {
              image.classList.add("illustrate_success");
            }, 1000);
          } else {
            // Handle server-side errors
            response.json().then((data) => {
              // Display all errors at once
              if (data.type === "username_error") {
                errorSpan[0].textContent = data.message;
                setTimeout(() => {
                  errorSpan[0].textContent = "";
                }, 3000);
                hasErrors = true;
              }

              if (data.type === "email_error") {
                errorSpan[1].textContent = data.message;
                setTimeout(() => {
                  errorSpan[1].textContent = "";
                }, 3000);
                hasErrors = true;
                j;
              }
            });
          }
        })
        .catch((error) => {
          console.log("Account creation failed!!!");
        });
    }
  });

  const close_modal = () => {
    proceed.classList.remove("show_proceed");
    main.style.display = "flex";
    // Clear form fields
    document.querySelector("[name='username']").value = "";
    document.querySelector("[name='email']").value = "";
    document.querySelector("[name='password']").value = "";
    document.querySelector("[name='confirm_password']").value = "";

    // Reset profile image
    profileImg.src = "../static/images/avatar.png";

    // Clear error messages
    errorSpan.forEach((span) => (span.textContent = ""));
  };

  close_proceed.addEventListener('click', close_modal)
}

// login functinality

const loginForm = document.querySelector(".logForm");

if (loginForm) {
  document.querySelector("h3").style.marginTop = 0;
  const errorSpan = document.querySelectorAll(".error");
  errorSpan.forEach((span) => (span.textContent = ""));
  const password = document.querySelector("[name='password']");
  const password_toggle = document.querySelector(".password_toggle");

  //show password toggler
  password_toggle.addEventListener("click", function () {
    if (password.type === "password") {
      password.type = "text";
    } else {
      password.type = "password";
    }
  });

  // form error checker
  let hasErrors = false;

  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.querySelector("[name='username']").value;
    const password = document.querySelector("[name='password']").value;

    errorSpan.forEach((span) => (span.textContent = ""));
    // login validation
    if (username.trim() === "") {
      errorSpan[0].textContent = "username field cannot be empty";
      setTimeout(() => {
        errorSpan[0].textContent = "";
      }, 3000);
      hasErrors = true;
    }

    if (password === "") {
      errorSpan[1].textContent = "password field cannot be empty";
      setTimeout(() => {
        errorSpan[1].textContent = "";
      }, 3000);
      hasErrors = true;
    }

    if (!hasErrors) {
      const loginForm = e.target;
      const formData = new FormData(loginForm);

      fetch(loginForm.action, {
        method: loginForm.method,
        body: formData,
        headers: {
          "X-CRSFToken": document.querySelector("[name=csrfmiddlewaretoken]")
            .value,
        },
      }).then((response) => {
        if (response.status === 200) {
          console.log("logged in");
          window.location.href = "/test";
        } else {
          response.json().then((data) => {
            if (data.type === "username_error") {
              errorSpan[0].textContent = data.message;
              setTimeout(() => {
                errorSpan[0].textContent = "";
              }, 3000);
              hasErrors = true;
            }

            if (data.type === "password_error") {
              errorSpan[1].textContent = data.message;
              setTimeout(() => {
                errorSpan[1].textContent = "";
              }, 3000);
              hasErrors = true;
            }
          });
        }
      });
    }
  });
}

if (start) {
  document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("body");
    const audioName = "../static/audio/click.mp3";
    if (actionbtn) {
      actionbtn.addEventListener("click", () => {
        playSound(audioName),
          (actionbtn.style.display = "none"),
          (decision.style.display = "flex"),
          (body.style.backgroundColor = "#e3e3e3");
      });
    }
  });
}

if (decision) {
  document.addEventListener("DOMContentLoaded", () => {
    const yes = document.querySelector("#yes");
    const no = document.querySelector("#no");
    const body = document.querySelector("body");
    const quiz = document.querySelector(".quiz");

    answer.forEach((answer) => (answer.disabled = false));

    if (yes) {
      yes.addEventListener("click", function () {
        decision.style.display = "none";
        quiz.style.display = "flex";
        body.style.backgroundColor = "pink";
        timer.textContent = 0 + "" + 5; // Start with 5 seconds

        startTimer(); // Start the timer
      });
    }

    if (no) {
      no.addEventListener("click", function () {
        decision.style.display = "none";
        actionbtn.style.display = "flex";
        document.querySelector("body").style.backgroundColor = "";
      });
    }
  });
}

function displayQuestion(questionData) {
  const quizTypeDiv = document.querySelector(".quiz_type");
  const questionArea = document.querySelector(".question-area");
  const answerForm = document.querySelector(".response");
  const progressionDiv = document.querySelector(".progression");

  // Update quiz type image
  quizTypeDiv.innerHTML = `<img src="/static/images/${questionData.type}.png" alt="${questionData.type} Logo" />`;

  // Update question
  questionArea.querySelector("h3").textContent = questionData.question;

  // Clear existing options
  const existingOptions = answerForm.querySelectorAll("label");
  existingOptions.forEach((option) => option.remove());

  // Update options

  const optionsHtml = questionData.options
    .map(
      (option) => `
      <label>
        <input type="radio" name="answer" value="${option}" class="option" />
        <span class="answer_title">${option}</span>
      </label>
    `
    )
    .join("");
  // ...

  answerForm
    .querySelector("button")
    .insertAdjacentHTML("beforebegin", optionsHtml);

  // Update button text
  const submitButton = answerForm.querySelector("button");
  submitButton.textContent = questionData.id === 4 ? "Finish" : "Next";

  // Update progression dots
  progressionDiv.innerHTML = Array.from(
    { length: 4 },
    (_, i) => `<span class="dot${i < questionData.id ? " filled" : ""}"></span>`
  ).join("");
}

const fetch_initial = () => {
  fetch("/get_initial_question")
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      displayQuestion(data);
    })
    .catch((error) => {
      console.error("Error fetching initial question:", error);
    });
};

if (quiz) {
  const answerForm = document.querySelector(".response");
  document.addEventListener("DOMContentLoaded", () => {
    fetch('/get_session_id')
    .then(response => response.json())
    .then(data => {
      if (data.session_id) {
        sessionStorage.setItem('session_id', data.session_id);
        actionbtn.style.display = "none";
        body.style.backgroundColor = "#e3e3e3";
        result.style.display = "flex";
      } else {
        fetch_initial();
      }
    })
    .catch(error => {
      console.error('Error fetching session ID:', error);
    });
  });
  answerForm.addEventListener("submit", function (e) {
    e.preventDefault();
    clearInterval(getTimer);
    const selectedAnswer = document.querySelector(
      'input[name="answer"]:checked'
    );
    const quizArea = document.querySelector(".quiz");
    const result = document.querySelector(".result");
    const selectedAnswerValue = selectedAnswer ? selectedAnswer.value : null;
    fetch(answerForm.action, {
      method: answerForm.method,
      body: JSON.stringify({ answer: selectedAnswerValue }),
      headers: {
        "X-CSRFToken": document.querySelector("[name=csrfmiddlewaretoken]")
          .value,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.status === "ongoing" && data.next_question) {
          displayQuestion(data.next_question);
          startTimer();
          answerForm.reset();
        } else {
          // Quiz is finished
          clearInterval(timer);
          actionbtn.style.display = "none"
          quizArea.style.display = "none";
          result.style.display = "flex";
          location.replace(location.href);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

  const logout = document.querySelector(".logout");

  if (logout) {
    logout.addEventListener('click', () => {
      fetch('/logout/', { 
        method: 'POST',
        headers: {
          'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value 
        },
      })
      .then(response => {
        if (response.ok) {
          // Logout successful, redirect to the desired page
          window.location.href = '/login'; // Replace '/' with your desired redirect URL
        } else {
          // Handle logout errors (e.g., display an error message)
          console.error('Logout failed');
        }
      })
      .catch(error => {
        console.error('Logout request failed:', error);
      });
    });
  }
}

const mobileNav = document.querySelector(".nav");
const mobileNavControl = document.querySelector(".mobile-nav");

mobileNavControl.addEventListener("click", () => {
  mobileNav.classList.toggle("slide_mobile");
});

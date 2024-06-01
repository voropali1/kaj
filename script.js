// Определение переменной buttonSound
const buttonSound = new Audio("zvuk.mp3");
const foodZvuk = new Audio("zvuk2.mp3");
document.addEventListener("DOMContentLoaded", () => {
    // Конструктор для игрового объекта
    function GameObject() {
        this.gameOver = false;
        this.foodX = null;
        this.foodY = null;
        this.snakeX = 5;
        this.snakeY = 5;
        this.velocityX = 0;
        this.velocityY = 0;
        this.snakeBody = [];
        this.setIntervalId = null;
        this.score = 0;
        this.highScore = localStorage.getItem("high-score") || 0;
        this.playBoard = document.querySelector(".play-board");
        this.scoreElement = document.querySelector(".score");
        this.highScoreElement = document.querySelector(".high-score");
        this.controls = document.querySelectorAll(".controls i");
    }

    // Метод для изменения направления движения змейки
GameObject.prototype.changeDirection = function(e) {
    console.log("Change direction method called");
    // Изменение значения скорости в зависимости от нажатой клавиши
    if(e.key === "ArrowUp" && this.velocityY !== 1) {
        this.velocityX = 0;
        this.velocityY = -1;
        console.log("1");
    } else if(e.key === "ArrowDown" && this.velocityY !== -1) {
        this.velocityX = 0;
        this.velocityY = 1;
        console.log("2");
    } else if(e.key === "ArrowLeft" && this.velocityX !== 1) {
        this.velocityX = -1;
        this.velocityY = 0;
        console.log("3");
    } else if(e.key === "ArrowRight" && this.velocityX !== -1) {
        this.velocityX = 1;
        this.velocityY = 0;
        console.log("4");
    }
};


GameObject.prototype.initGame = function(playBoard, scoreElement, highScoreElement) {
    if(this.gameOver) return this.handleGameOver();
    
    // Очищаем игровое поле перед отрисовкой нового кадра
    playBoard.innerHTML = '';
    
    // Обновляем позицию змейки в соответствии с ее скоростью
    this.snakeX += this.velocityX;
    this.snakeY += this.velocityY;

   
    
    // Создаем SVG элемент для еды
    let foodSVG = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    foodSVG.setAttribute("x", this.foodX * 20);
    foodSVG.setAttribute("y", this.foodY * 20);
    foodSVG.setAttribute("width", "20");
    foodSVG.setAttribute("height", "20");
    foodSVG.setAttribute("fill", "red");
    playBoard.appendChild(foodSVG);
    
    // Создаем SVG элемент для головы змейки
    let snakeHead = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    snakeHead.setAttribute("x", this.snakeX * 20); 
    snakeHead.setAttribute("y", this.snakeY * 20);
    snakeHead.setAttribute("width", "20");
    snakeHead.setAttribute("height", "20");
    snakeHead.setAttribute("fill", "green");
    playBoard.appendChild(snakeHead);
    
    // Обновляем массив с координатами тела змейки
    this.snakeBody.unshift([this.snakeX, this.snakeY]);
    
    // Проверяем, совпадает ли позиция головы змейки с позицией еды
    this.ateFood = this.snakeX === this.foodX && this.snakeY === this.foodY;

    // Если змейка съела еду, генерируем новую еду
    if (this.ateFood) {
        this.updateFoodPosition();
    } else {
        // Если не съела еду, удаляем последний сегмент тела змейки
        this.snakeBody.pop();
    }

    // Отрисовываем каждый сегмент тела змейки
    this.snakeBody.forEach(segment => {
        let snakePart = document.createElementNS("http://www.w3.org/2000/svg", "rect");
        snakePart.setAttribute("x", segment[0] * 20); 
        snakePart.setAttribute("y", segment[1] * 20);
        snakePart.setAttribute("width", "20");
        snakePart.setAttribute("height", "20");
        snakePart.setAttribute("fill", "green");
        playBoard.appendChild(snakePart);
    });

    if (this.ateFood) {
        foodZvuk.play();
        console.log("yes");
        this.score++; // Увеличиваем счет
        if (this.score > this.highScore) {
            this.highScore = this.score; // Обновляем максимальный счет
            localStorage.setItem("high-score", this.highScore); // Сохраняем максимальный счет в локальном хранилище
        }
        // Обновляем HTML для отображения нового счета и максимального счета
        this.scoreElement.innerText = `Score: ${this.score}`;
        this.highScoreElement.innerText = `High Score: ${this.highScore}`;
    }

    // Проверяем столкновение змейки с границами поля
    if(this.snakeX < 0 || this.snakeX > 29 || this.snakeY < 0 || this.snakeY > 29) {
        return this.gameOver = true;
    }
    for (let i = 1; i < this.snakeBody.length; i++) {
        if (this.snakeX === this.snakeBody[i][0] && this.snakeY === this.snakeBody[i][1]) {
            this.gameOver = true;
            this.handleGameOver();
            return;
        }
    }
    
};



    
    

    // Метод для обработки конца игры
    GameObject.prototype.handleGameOver = function() {
        clearInterval(this.setIntervalId);
        this.gameOver = false;
        this.showResultPage();
        // Обновляем HTML для отображения итогового счета и максимального счета
    this.scoreElement.innerText = `Score: ${this.score}`;
    this.highScoreElement.innerText = `High Score: ${this.highScore}`;
    // Добавляем запись в историю браузера
    history.pushState({ page: "result" }, "Snake Game - Result Page", "/result");
    };

    // Обрабатываем событие нажатия кнопки "назад" в браузере
window.onpopstate = function(event) {
    if (event.state) {
        // Если страница была игровой страницей, скрываем страницу игры и отображаем домашнюю страницу
        if (event.state.page === "game") {
            document.getElementById("game-page").style.display = "none";
            document.getElementById("home-page").style.display = "block";
            console.log("back1");
        }
        // Если страница была страницей результатов, скрываем страницу результатов и отображаем страницу игры
        else if (event.state.page === "result") {
            document.getElementById("result-page").style.display = "none";
            document.getElementById("game-page").style.display = "block";
            console.log("back2");
        }
    }
};

    // Метод для показа страницы результатов
    GameObject.prototype.showResultPage = function() {
        document.getElementById("game-page").style.display = "none";
        document.getElementById("result-page").style.display = "block";
        document.getElementById("final-score").innerText = this.score;
        document.getElementById("food-count").innerText = this.snakeBody.length - 1;
    };

    // Метод для обновления позиции еды
    GameObject.prototype.updateFoodPosition = function(e) {
        this.foodX = Math.floor(Math.random() * 29);
        this.foodY = Math.floor(Math.random() * 29);
        console.log("Food position:", this.foodX, this.foodY);
    };

    // Метод для старта игры
   // Метод для старта игры
GameObject.prototype.startGame = function(e) {
    this.snakeX = 5;
    this.snakeY = 5;
    
    // Очищаем массив snakeBody перед началом игры
    this.snakeBody = [];

    // Добавляем начальные координаты головы змейки в массив snakeBody
    this.snakeBody.push([this.snakeX, this.snakeY]);
    
    // Устанавливаем начальную скорость змейки
    this.velocityX = 0;
    this.velocityY = 0;
    this.updateFoodPosition();
    document.getElementById("home-page").style.display = "none";
    document.getElementById("game-page").style.display = "block";
    //this.playBoard.focus(); // Установка фокуса на игровое поле
    this.setIntervalId = setInterval(() => this.initGame(this.playBoard, this.scoreElement, this.highScoreElement), 200);
};


    // Метод для старта игры
    GameObject.prototype.restartGame = function(e) {
        clearInterval(this.setIntervalId);
        // Resetování herních proměnných
        this.gameOver = false;
        this.snakeBody = [];
        this.snakeX = 5;
        this.snakeY = 5;
        this.velocityX = 0;
        this.velocityY = 0;
        this.score = 0;
        // Добавляем начальные координаты головы змейки в массив snakeBody
    this.snakeBody.push([this.snakeX, this.snakeY]);
        // Resetování HTML obsahu herního pole
        this.playBoard.innerHTML = "";
        this.scoreElement.innerText = `Score: ${this.score}`;
        // Skrytí stránky výsledků a zobrazení domovské stránky
        this.updateFoodPosition();
        document.getElementById("result-page").style.display = "none";
        document.getElementById("game-page").style.display = "block";
        this.setIntervalId = setInterval(() => this.initGame(this.playBoard, this.scoreElement, this.highScoreElement), 200);
    };
    // Создание экземпляра игрового объекта
    const game = new GameObject();
    const userGreeting = document.getElementById("user-greeting");

    document.getElementById("player-form").addEventListener("submit", (event) => {
        event.preventDefault(); // Предотвращаем стандартное поведение формы
    
      });

        // Добавление обработчиков событий
        document.getElementById("start-button").addEventListener("click", () => {
            // Проверяем, введено ли имя пользователя
            // Получаем имя пользователя из input поля
            const playerName = document.getElementById("player-name").value;
            console.log(playerName);
    if (playerName) {
        // Если введено, вставляем его в элемент userGreeting
        userGreeting.textContent = `Good luck, ${playerName}!`;
        buttonSound.play();
            game.startGame();
             // Добавляем запись в историю браузера
        history.pushState({ page: "game" }, "Snake Game - Game Page", "/game");
        // Здесь можно добавить другие действия перед началом игры
    } else {
        // Если имя пользователя не введено, выводим сообщение об ошибке или предупреждение
        alert("Please enter your name before starting the game!");
    }
        });


    
    
        // Добавление обработчика событий для нажатий клавиш
        document.addEventListener("keydown", (event) => {
            game.changeDirection(event);
        });

    
        document.getElementById("restart-button").addEventListener("click", () => {
            buttonSound.play();
            game.restartGame();
        });

        // Получаем все кнопки управления
const controls = document.querySelectorAll(".controls i");
// Добавляем обработчик клика на каждую кнопку управления
controls.forEach(button => {
    button.addEventListener("click", () => {
        // Получаем значение клавиши из атрибута data-key кнопки
        const key = button.dataset.key;
        // Вызываем метод changeDirection, передавая значение клавиши
        game.changeDirection({ key });
    });
});
        

    });
    

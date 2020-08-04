class RollAnimationBox {
    /*
     animation-duration: 0.2s;
     animation-iteration-count: 25;
     animation-name: continueDown;
     animation-name: continueDown;
     background-color: red;
     */
    constructor(output, texts, startAnimation, continueAnimation1, continueAnimation2, endAnimationName, onBoxFinishAnimation, value) {
        this.slowDuration = "0.1s";
        this.fastDuration = "0.05s";

        this.continueAnimation1 = continueAnimation1;
        this.continueAnimation2 = continueAnimation2;
        this.endAnimationName = endAnimationName;
        this.startAnimation = startAnimation;
        this.findAnimation1Active = true;

        this.text = output.innerHTML
        this.arrayTexts = texts;
        this.output = output;

        this.ejecuteRollingAnimation = this.ejecuteRollingAnimation.bind(this);
        this.tryToStopFindAnimation = this.tryToStopFindAnimation.bind(this);
        this.ejecuteFindAnimation = this.ejecuteFindAnimation.bind(this);
        this.ejecuteEndAnimation = this.ejecuteEndAnimation.bind(this);
        this.onfinishAnimation = this.onfinishAnimation.bind(this);
        this.updateText = this.updateText.bind(this);

        this.onBoxFinishAnimation = onBoxFinishAnimation;
        this.value = value;
    }
    updateText() {
        const text = this.getText();
        let currentIndex = this.arrayTexts.indexOf(text);
        currentIndex++;
        if (currentIndex == this.arrayTexts.length) {
            currentIndex = 0;
        }
        this.setText(this.arrayTexts[currentIndex]);
    }
    stopEjecute() {
        //this.output.removeAttribute("style");
        this.output.style.animationIterationCount = 1; /////////////////////////////////
    }
    fastEjecute(animationName) {
        this.output.style.animationDuration = this.fastDuration;
        this.output.style.animationIterationCount = 1;
        this.output.style.animationName = animationName;
        //this.output.style.animationDirection = "reverse";
    }
    slowEjecute(animationName, times) {
        this.output.style.animationDuration = this.slowDuration
        this.output.style.animationIterationCount = times;
        this.output.style.animationName = animationName;
        //this.output.style.animationDirection = "reverse";
    }
    infiniteEjecute(animationName) {
        this.output.style.animationDuration = this.slowDuration
        this.output.style.animationIterationCount = "infinite";
        this.output.style.animationName = animationName;
        //this.output.style.animationDirection = "reverse";
    }

    ejecute(target) {
        this.output.addEventListener("animationiteration", this.updateText);
        this.output.addEventListener("animationend", this.updateText);

        this.targetIndex = this.arrayTexts.indexOf(target);
        if (this.targetIndex == 0) {
            this.targetIndex = this.arrayTexts.length - 1;
        } else {
            this.targetIndex--;
        }
        this.ejecuteStartAnimation();
    }
    ejecuteStartAnimation() {
        this.output.addEventListener("animationend", this.ejecuteRollingAnimation);
        this.fastEjecute(this.startAnimation, true);
    }
    ejecuteRollingAnimation() {
        this.output.removeEventListener('animationend', this.ejecuteRollingAnimation);
        this.output.addEventListener("animationend", this.ejecuteFindAnimation);

        this.slowEjecute(this.continueAnimation1, 10);
    }
    ejecuteFindAnimation() {
        this.output.removeEventListener('animationend', this.ejecuteFindAnimation);
        this.output.addEventListener("animationiteration", this.tryToStopFindAnimation);
        this.infiniteEjecute(this.continueAnimation2);
    }
    tryToStopFindAnimation() {
        const currentIndex = this.arrayTexts.indexOf(this.getText());

        if (currentIndex == this.targetIndex) {
            this.output.removeEventListener('animationiteration', this.tryToStopFindAnimation);

            this.output.addEventListener("animationend", this.ejecuteEndAnimation);
            this.slowEjecute("continue1", 1);
        }
    }
    ejecuteEndAnimation() {
        this.output.removeEventListener("animationiteration", this.updateText);
        this.output.removeEventListener("animationend", this.updateText);

        this.fastEjecute(this.endAnimationName);
        this.output.removeEventListener('animationend', this.ejecuteEndAnimation);

        this.output.addEventListener('animationend', this.onfinishAnimation);
    }

    onfinishAnimation() {
        this.output.removeEventListener('animationend', this.onfinishAnimation);
        this.onBoxFinishAnimation(this.value);
    }

    setText(text) {
        this.output.innerHTML = text;
    }
    getText() {
        return this.output.innerHTML;
    }
}

class RollAnimation {

    constructor(outputLetter, outputNumber1, outputNumber2, textLetter, textNumber1, textNumber2, startAnimation, continueAnimation1, continueAnimation2, endAnimationName, onFinishAnimation) {
        this.onBoxFinishAnimation = this.onBoxFinishAnimation.bind(this);

        this.number1 = new RollAnimationBox(outputNumber1, textNumber1, startAnimation, continueAnimation1, continueAnimation2, endAnimationName, this.onBoxFinishAnimation, 0);
        this.number2 = new RollAnimationBox(outputNumber2, textNumber2, startAnimation, continueAnimation1, continueAnimation2, endAnimationName, this.onBoxFinishAnimation, 1);
        this.letter = new RollAnimationBox(outputLetter, textLetter, startAnimation, continueAnimation1, continueAnimation2, endAnimationName, this.onBoxFinishAnimation, 2);
        this.onFinishAnimation = onFinishAnimation;

        this.box1 = false;
        this.box2 = false;
        this.box3 = false;

        this.audio = new Audio('Redoble_1.mp3');
        this.audio.volume = 0.02;

    }

    ejecute(bingoNumber) {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.currentTime = 0
        }
        this.box1 = false;
        this.box2 = false;
        this.box3 = false;

        const letter = bingoNumber.charAt(0);
        const number1 = bingoNumber.charAt(1);
        const number2 = bingoNumber.charAt(2);

        this.letter.ejecute(letter);
        this.number1.ejecute(number1);
        this.number2.ejecute(number2);
    }

    onBoxFinishAnimation(value) {
        switch (value) {
            case 0:
                this.box1 = true;
                break;
            case 1:
                this.box2 = true;
                break;
            case 2:
                this.box3 = true;
                break;
        }
        if (this.box1 && this.box2 && this.box3) {
            this.onFinishAnimation();
        }
    }

}

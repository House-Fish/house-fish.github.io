class Keyboard {
    constructor() {
        this.id = "keylamp"
        this.keylamp = document.querySelector("#" + this.id);
        createElement(this.keylamp, this.id, letters)
    }
    forward(letter) {
        const signal = letters.search(letter);
        return signal;
    }
    backward(signal) {
        const letter = letters[signal];
        return letter;
    }
}

class Plugboard {
    constructor(pairs) {
        this.id = "plugboard"
        this.left = letters;
        this.right = letters;
        [...pairs].forEach(pair => {
            const A = pair[0];
            const B = pair[1];
            const pos_A = this.left.search(A);
            const pos_B = this.left.search(B);
            this.left = this.left.slice(0, pos_A) + B + this.left.slice(pos_A+1, this.left.length);
            this.left = this.left.slice(0, pos_B) + A + this.left.slice(pos_B+1, this.left.length);
        })

        this.plugboard = document.querySelector("#" + this.id);

        this.leftElement = this.plugboard.querySelector(".left");
        createElement(this.leftElement, this.id, this.left);

        this.rightElement = this.plugboard.querySelector(".right");
        createElement(this.rightElement, this.id, this.right);
    }
    forward(signalIn) {
        const letter = this.right[signalIn];
        const signalOut = this.left.search(letter);
        drawInRectangle(this.id,
            signalIn,
            this.rightElement,
            signalOut,
            this.leftElement, 
            green)
        return signalOut;
    }
    backward(signalIn) {
        const letter = this.left[signalIn];
        const signalOut = this.right.search(letter);
        drawInRectangle(this.id,
            signalIn,
            this.leftElement,
            signalOut,
            this.rightElement, 
            red)
        return signalOut;
    }
}

class Rotor {
    constructor(wiring, notch) {
        this.left = letters;
        this.right = wiring;
        this.notch = notch;
        this.ring = 0;
    }
    createElements(id) {
        this.id = id;
        this.rotor = document.querySelector("#" + this.id);

        this.leftElement = this.rotor.querySelector(".left");
        createElement(this.leftElement, this.id, this.left);

        this.rightElement = this.rotor.querySelector(".right");
        createElement(this.rightElement, this.id, this.right);
    }
    forward(signalIn) {
        const letter = this.right[signalIn];
        const signalOut = this.left.search(letter);
        drawInRectangle(this.id,
            signalIn,
            this.rightElement,
            signalOut,
            this.leftElement,
            green)
        return signalOut;
    }
    backward(signalIn) {
        const letter = this.left[signalIn];
        const signalOut = this.right.search(letter);
        drawInRectangle(this.id,
            signalIn,
            this.leftElement,
            signalOut,
            this.rightElement, 
            red)
        return signalOut;
    }
    rotate(n=1, forward=true) {
        for (let i = 0; i < n; i++) {
            if (forward) {
                this.left = this.left.slice(1) + this.left[0];
                this.right = this.right.slice(1) + this.right[0];
            } else {
                this.left = this.left[25] + this.left.slice(0, 25);
                this.right = this.right[25] + this.right.slice(0, 25);
            }
       }
    }
    rotateToLetter(letter) {
        const n = letters.search(letter);
        this.rotate(n);
    }
    setRing(n) {
        this.ring = n - 1
        // Rotate the rotor backwards
        this.rotate(this.ring, false);

        // Adjust the turnover notch in relationship to the wiring
        const n_notch = letters.search(this.notch);
        let mod = (n_notch - n + 1) % 26
        if (mod < 0) {
            mod = mod + 26;
        }
        this.notch = letters[mod];
    }
    update() {
        updateLetters(this.leftElement, this.id, this.left);
        updateLetters(this.rightElement, this.id, this.right);

        for (let i = 0; i < this.left.length; i++) {
            this.leftElement.querySelector("#" + this.id + i).style.background = "";
        } 

        this.leftElement.querySelector("#" + this.id + this.ring).style.background = "#3FA7D6";
        this.leftElement.querySelector("#" + this.id + this.left.search(this.notch)).style.background = "#FAC05E";
    }
}

class Reflector {
    constructor(wiring) {
        this.left = letters;
        this.right = wiring;
    }
    createElements() {
        this.id = "reflector"
        this.reflector = document.querySelector("#" + this.id);

        this.leftElement = this.reflector.querySelector(".left");
        createElement(this.leftElement, this.id, this.left);

        this.rightElement = this.reflector.querySelector(".right");
        createElement(this.rightElement, this.id, this.right);
 
    }
    reflect(signalIn) {
        const letter = this.right[signalIn];
        const signalOut = this.left.search(letter);
        drawInRectangle(this.id,
            signalIn,
            this.rightElement,
            signalOut,
            this.leftElement, 
            orange)
        return signalOut;
    }
}

class Enigma {
    constructor(re, r1, r2, r3, pb, kb) {
        this.re = re;
        this.r1 = r1;
        this.r2 = r2;
        this.r3 = r3;
        this.pb = pb;
        this.kb = kb;

        this.r1.createElements("third");
        this.r2.createElements("second");
        this.r3.createElements("first");
        this.re.createElements();
    }
    setKey(key) {
        this.r1.rotateToLetter(key[0]);
        this.r2.rotateToLetter(key[1]);
        this.r3.rotateToLetter(key[2]);

    }
    setRings(rings) {
        this.r1.setRing(rings[0]);
        this.r2.setRing(rings[1]);
        this.r3.setRing(rings[2]);
    }
    encrypt(letter) {
        // Rotate the rotors
        if (this.r2.left[0] === this.r2.notch && this.r3.left[0] === this.r3.notch) {
            this.r1.rotate();
            this.r2.rotate();
            this.r3.rotate();
        } else if (this.r2.left[0] === this.r2.notch) {
            this.r1.rotate();
            this.r2.rotate();
            this.r3.rotate();
        } else if (this.r3.left[0] === this.r3.notch) {
            this.r2.rotate();
            this.r3.rotate();
        } else {
            this.r3.rotate();
        }

        // Update rotors
        this.r1.update();
        this.r2.update();
        this.r3.update();

        // Pass signal through machine
        let signal = this.kb.forward(letter);
        drawBetweenRectangle(signal,
            this.kb.id,
            this.kb.keylamp,
            this.pb.id,
            this.pb.rightElement, 
            green) 
        signal = this.pb.forward(signal);
        drawBetweenRectangle(signal,
            this.pb.id,
            this.pb.leftElement,
            this.r3.id,
            this.r3.rightElement,
            green) 
        signal = this.r3.forward(signal);
        drawBetweenRectangle(signal,
            this.r3.id,
            this.r3.leftElement,
            this.r2.id,
            this.r2.rightElement,
            green) 
        signal = this.r2.forward(signal);
        drawBetweenRectangle(signal,
            this.r2.id,
            this.r2.leftElement,
            this.r1.id,
            this.r1.rightElement,
            green) 
        signal = this.r1.forward(signal);
        drawBetweenRectangle(signal,
            this.r1.id,
            this.r1.leftElement,
            this.re.id,
            this.re.rightElement,
            green) 
        signal = this.re.reflect(signal);
        drawBetweenRectangle(signal,
            this.re.id,
            this.re.leftElement,
            this.re.id,
            this.re.rightElement,
            orange) 
        drawBetweenRectangle(signal,
            this.re.id,
            this.re.rightElement,
            this.r1.id,
            this.r1.leftElement,
            red) 
        signal = this.r1.backward(signal);
        drawBetweenRectangle(signal,
            this.r1.id,
            this.r1.rightElement,
            this.r2.id,
            this.r2.leftElement,
            red) 
        signal = this.r2.backward(signal);
        drawBetweenRectangle(signal,
            this.r2.id,
            this.r2.rightElement,
            this.r3.id,
            this.r3.leftElement, 
            red) 
        signal = this.r3.backward(signal);
        drawBetweenRectangle(signal,
            this.r3.id,
            this.r3.rightElement,
            this.pb.id,
            this.pb.leftElement,
            red) 
        signal = this.pb.backward(signal);
        drawBetweenRectangle(signal,
            this.pb.id,
            this.pb.rightElement,
            this.kb.id,
            this.kb.keylamp, 
            red) 
        letter = this.kb.backward(signal);
        return letter;
    }
}

const shift = document.querySelector("#input").getBoundingClientRect().height 
            + document.querySelector("#output").getBoundingClientRect().height
            + document.querySelector("#titles").getBoundingClientRect().height;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const alphabet = [...'abcdefghijklmnopqrstuvwxyz'];
const green = "#069C56";
const red = "#D3212C";
const orange = "#FF681E";

// Rotors and Reflectors 
const I = new Rotor("EKMFLGDQVZNTOWYHXUSPAIBRCJ", "Q");
const II = new Rotor("AJDKSIRUXBLHWTMCQGZNPYFVOE", "E");
const III = new Rotor("BDFHJLCPRTXVZNYEIWGAKMUSQO", "V");
const IV = new Rotor("ESOVPZJAYQUIRHXLNFTGKDCMWB", "J");
const V = new Rotor("VZBRGITYUPSDNHLXAWMJQOFECK", "Z");

const A = new Reflector("EJMZALYXVBWFCRQUONTSPIKHGD");
const B = new Reflector("YRUHQSLDPXNGOKMIEBFZCWVJAT");
const C = new Reflector("FVPJIAOYEDRZXWGCTKUQSBNMHL");

// Keyboard and Plugboard
const KB = new Keyboard();
const PB = new Plugboard(["AB", "CD", "EF"]);

// Enigma Machine
let enigma = new Enigma(B, IV, II, I, PB, KB);

// Set rings
enigma.setRings([5,26,2])

// Set Key
enigma.setKey("CAT");

function createElement(element, id, letters) {
    for (let i = 0; i < letters.length; ++i) {
        const letter = document.createElement('div');
        letter.setAttribute("id", id + i);
        letter.textContent = letters[i];
        element.appendChild(letter);
    }
}

function updateLetters(element, id, letters) {
    for (let i = 0; i < letters.length; ++i) {
        const letter = element.querySelector("#" + id + i);
        letter.textContent = letters[i];
    }
}

function getCoordinate(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
}

// Function to resize the canvas
function resizeCanvas() {
    const container = document.querySelector("#rectangles-container").getBoundingClientRect();
    canvas.width = container.width;
    canvas.height = container.height;
}

// Function to draw content on the canvas
function drawLine(x1, y1, x2, y2, color) {
    // Example: Draw a line
    context.beginPath();
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.moveTo(x1, y1);
    context.lineTo(x2, y2);
    context.stroke();
}

function clearCanvas() {
    context.clearRect(0,0,canvas.width,canvas.height);
}

function drawInRectangle(id, sourceIdx, sourceGroupDiv, destIdx, destGroupDiv, color) {
    const sourceDiv = sourceGroupDiv.querySelector("#" + id + sourceIdx);
    const sourceX = getCoordinate(sourceDiv).x;
    const sourceY = getCoordinate(sourceDiv).y - shift;

    const destDiv = destGroupDiv.querySelector("#" + id + destIdx);
    const destX = getCoordinate(destDiv).x;
    const destY = getCoordinate(destDiv).y - shift;

    drawLine(sourceX, sourceY, destX, destY, color);
}

function drawBetweenRectangle(idx, sourceId, sourceGroupDiv, destId, destGroupDiv, color) {
    const sourceDiv = sourceGroupDiv.querySelector("#" + sourceId + idx);
    const sourceX = getCoordinate(sourceDiv).x;
    const sourceY = getCoordinate(sourceDiv).y - shift;

    const destDiv = destGroupDiv.querySelector("#" + destId + idx);
    const destX = getCoordinate(destDiv).x;
    const destY = getCoordinate(destDiv).y - shift;

    drawLine(sourceX, sourceY, destX, destY, color);
}

window.addEventListener("keydown", (event) => {
    const key = event.key;
    if (alphabet.includes(key)) {
        clearCanvas();
        const input = document.querySelector("#input");
        const output = document.querySelector("#output");
        const letter = key.toUpperCase();
        input.textContent = input.textContent += letter;
        output.textContent = output.textContent += enigma.encrypt(letter);
    } else if (key === " ") {
        input.textContent = input.textContent += " ";
        output.textContent = output.textContent += " ";
    } else if (key === "Backspace") {
        // Why? becuz im lazy XD!
        location.reload();
    }
});

window.addEventListener('load', resizeCanvas);

window.addEventListener('resize', resizeCanvas);
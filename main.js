class Keyboard {
    constructor() {
        this.id = "keylamp"
        this.keylamp = document.querySelector("#" + this.id);
        create_element(this.keylamp, this.id, letters)
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

        this.left_element = this.plugboard.querySelector(".left");
        create_element(this.left_element, this.id, this.left);

        this.right_element = this.plugboard.querySelector(".right");
        create_element(this.right_element, this.id, this.right);
    }
    forward(signal_in) {
        const letter = this.right[signal_in];
        const signal_out = this.left.search(letter);
        drawInRectangle(this.id,
            signal_in,
            this.right_element,
            signal_out,
            this.left_element, 
            "red")
        return signal_out;
    }
    backward(signal_in) {
        const letter = this.left[signal_in];
        const signal_out = this.right.search(letter);
        drawInRectangle(this.id,
            signal_in,
            this.left_element,
            signal_out,
            this.right_element, 
            "green")
        return signal_out;
    }
}

class Rotor {
    constructor(wiring, notch) {
        this.left = letters;
        this.right = wiring;
        this.notch = notch;
    }
    create_elements(id) {
        this.id = id;
        this.rotor = document.querySelector("#" + this.id);

        this.left_element = this.rotor.querySelector(".left");
        create_element(this.left_element, this.id, this.left);

        this.right_element = this.rotor.querySelector(".right");
        create_element(this.right_element, this.id, this.right);
    }
    forward(signal_in) {
        const letter = this.right[signal_in];
        const signal_out = this.left.search(letter);
        drawInRectangle(this.id,
            signal_in,
            this.right_element,
            signal_out,
            this.left_element,
            "red")
        return signal_out;
    }
    backward(signal_in) {
        const letter = this.left[signal_in];
        const signal_out = this.right.search(letter);
        drawInRectangle(this.id,
            signal_in,
            this.left_element,
            signal_out,
            this.right_element, 
            "green")
        return signal_out;
    }
    show() {
        console.log(this.left)
        console.log(this.right)
        console.log()
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
    rotate_to_letter(letter) {
        const n = letters.search(letter);
        this.rotate(n);
    }
    set_ring(n) {
        // Rotate the rotor backwards
        this.rotate(n-1, false);

        // Adjust the turnover notch in relationship to the wiring
        const n_notch = letters.search(this.notch);
        this.notch = letters[(n_notch - n + 1) % 26];
    }
    update() {
        update_letters(this.left_element, this.id, this.left);
        update_letters(this.right_element, this.id, this.right);
    }
}

class Reflector {
    constructor(wiring) {
        this.left = letters;
        this.right = wiring;
    }
    create_elements() {
        this.id = "reflector"
        this.reflector = document.querySelector("#" + this.id);

        this.left_element = this.reflector.querySelector(".left");
        create_element(this.left_element, this.id, this.left);

        this.right_element = this.reflector.querySelector(".right");
        create_element(this.right_element, this.id, this.right);
 
    }
    reflect(signal_in) {
        const letter = this.right[signal_in];
        const signal_out = this.left.search(letter);
        drawInRectangle(this.id,
            signal_in,
            this.right_element,
            signal_out,
            this.left_element, 
            "red")
        return signal_out;
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

        this.r1.create_elements("third");
        this.r2.create_elements("second");
        this.r3.create_elements("first");
        this.re.create_elements();
    }
    set_key(key) {
        this.r1.rotate_to_letter(key[0]);
        this.r2.rotate_to_letter(key[1]);
        this.r3.rotate_to_letter(key[2]);

    }
    set_rings(rings) {
        this.r1.set_ring(rings[0]);
        this.r2.set_ring(rings[1]);
        this.r3.set_ring(rings[2]);
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

        // Pass signal through machine
        let signal = this.kb.forward(letter);
        drawBetweenRectangle(signal,
            this.kb.id,
            this.kb.keylamp,
            this.pb.id,
            this.pb.right_element, 
            "red") 
        signal = this.pb.forward(signal);
        drawBetweenRectangle(signal,
            this.pb.id,
            this.pb.left_element,
            this.r3.id,
            this.r3.right_element,
            "red") 
        signal = this.r3.forward(signal);
        drawBetweenRectangle(signal,
            this.r3.id,
            this.r3.left_element,
            this.r2.id,
            this.r2.right_element,
            "red") 
        signal = this.r2.forward(signal);
        drawBetweenRectangle(signal,
            this.r2.id,
            this.r2.left_element,
            this.r1.id,
            this.r1.right_element,
            "red") 
        signal = this.r1.forward(signal);
        drawBetweenRectangle(signal,
            this.r1.id,
            this.r1.left_element,
            this.re.id,
            this.re.right_element,
            "red") 
        signal = this.re.reflect(signal);
        drawBetweenRectangle(signal,
            this.re.id,
            this.re.left_element,
            this.re.id,
            this.re.right_element,
            "green") 
        drawBetweenRectangle(signal,
            this.re.id,
            this.re.right_element,
            this.r1.id,
            this.r1.left_element,
            "green") 
        signal = this.r1.backward(signal);
        drawBetweenRectangle(signal,
            this.r1.id,
            this.r1.right_element,
            this.r2.id,
            this.r2.left_element,
            "green") 
        signal = this.r2.backward(signal);
        drawBetweenRectangle(signal,
            this.r2.id,
            this.r2.right_element,
            this.r3.id,
            this.r3.left_element, 
            "green") 
        signal = this.r3.backward(signal);
        drawBetweenRectangle(signal,
            this.r3.id,
            this.r3.right_element,
            this.pb.id,
            this.pb.left_element,
            "green") 
        signal = this.pb.backward(signal);
        drawBetweenRectangle(signal,
            this.pb.id,
            this.pb.right_element,
            this.kb.id,
            this.kb.keylamp, 
            "green") 
        letter = this.kb.backward(signal);
        return letter;
    }
    update() {
        this.r1.update();
        this.r2.update();
        this.r3.update();
    }
}

const shift = document.querySelector("#input").getBoundingClientRect().height 
            + document.querySelector("#output").getBoundingClientRect().height;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');


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
const enigma = new Enigma(B, IV, II, I, PB, KB);

// Set rings
enigma.set_rings([5,26,2])

// Set Key
enigma.set_key("CAT");

function create_element(element, id, letters) {
    for (let i = 0; i < letters.length; ++i) {
        const letter = document.createElement('div');
        letter.setAttribute("id", id + i);
        letter.textContent = letters[i];
        element.appendChild(letter);
    }
}

function update_letters(element, id, letters) {
    for (let i = 0; i < letters.length; ++i) {
        const letter = element.querySelector("#" + id + i);
        letter.textContent = letters[i];
    }
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
}

function initializeCanvas() {
    // Set initial canvas size
    resizeCanvas(context);

    // Handle window resize events
    window.addEventListener('resize', resizeCanvas);
}

// Function to resize the canvas
function resizeCanvas() {
    const container = document.querySelector(".rectangles-container").getBoundingClientRect();
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
    const sourceX = getOffset(sourceDiv).x;
    const sourceY = getOffset(sourceDiv).y - shift;

    const destDiv = destGroupDiv.querySelector("#" + id + destIdx);
    const destX = getOffset(destDiv).x;
    const destY = getOffset(destDiv).y - shift;

    drawLine(sourceX, sourceY, destX, destY, color);

}

function drawBetweenRectangle(idx, sourceId, sourceGroupDiv, destId, destGroupDiv, color) {
    const sourceDiv = sourceGroupDiv.querySelector("#" + sourceId + idx);
    const sourceX = getOffset(sourceDiv).x;
    const sourceY = getOffset(sourceDiv).y - shift;

    const destDiv = destGroupDiv.querySelector("#" + destId + idx);
    const destX = getOffset(destDiv).x;
    const destY = getOffset(destDiv).y - shift;

    drawLine(sourceX, sourceY, destX, destY, color);
}

window.addEventListener("keydown", (event) => {
    if (event.keyCode > 64 && event.keyCode < 91) {
        clearCanvas();
        const input = document.querySelector("#input");
        const output = document.querySelector("#output");
        const letter = event.key.toUpperCase();
        input.textContent = input.textContent += letter;
        output.textContent = output.textContent += enigma.encrypt(letter);
        enigma.update(letter);
    }
});

window.addEventListener('load', () => {
    initializeCanvas();
    enigma.update();
    }
);
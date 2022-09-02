const calculateWeights = (layer1, layer2) => [...Array(layer2).keys()].map(() => [...Array(layer1).keys()].map(() => Math.random()));
const calculateNeuron = (prevLayer, bias, weights) => {
    // for the future stupid me,
    // we are incrementing bias here because value of neuron will be 0 at start
    // and then we add all the products of weights and values of neurons of previous layer
    // and we add bias in the end. so what we can do is just set innetial value of neuron 
    // as bias, like neuron = bias but we're not gonna use bias again in this function
    // so why not just increment on the bias itself and return it.
    for (let i = 0; i < weights.length; i++) {
        bias += prevLayer[i] * weights[i]
    }
    return bias;
}
const calculateLayer = (prevLayer, bias, weights_set) => {
    let layer = [];
    for (const weights of weights_set) {
        layer.push(calculateNeuron(prevLayer, bias, weights))
    }
    return layer
}

const softmax = (layer) => {
    let sum = layer.map(x => Math.exp(x)).reduce((i, j) => i + j);
    const activatedLayer = [];
    for (const neuron of layer) {
        activatedLayer.push(Math.exp(neuron) / sum);
    }
    return activatedLayer;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class NeuralNet {
    constructor(input_l, hidden_layers, output_l) {
        this.inputLayer = input_l; // it is random for now
        this.outputLength = output_l;
        this.hiddenLayersLength = hidden_layers.length;
        this.weights = []
        this.layerCount = 2 + this.hiddenLayersLength;
        this.layers = [this.inputLayer];
        this.biases = [...Array(this.hiddenLayersLength + 2).keys()].map(() => 1)
        // inetiating random weights
        if (hidden_layers.length > 0) {
            this.weights[0] = calculateWeights(this.inputLayer.length, hidden_layers[0]);
            for (let i = 0; i < hidden_layers.length - 1; i++) {
                this.weights.push(calculateWeights(hidden_layers[i], hidden_layers[i + 1]));
            }
            this.weights.push(calculateWeights(hidden_layers.slice(-1)[0], this.outputLength));
        }
        else {
            this.weights[0] = calculateWeights(this.input_l, this.outputLength);
        }

        // calculating all the layers based on input and random weights
        let lastLayer = softmax(this.inputLayer);
        let counter = 0;
        for (const weight of this.weights) {
            const layer = softmax(calculateLayer(lastLayer, this.biases[counter], weight));
            this.layers.push(layer);
            lastLayer = layer;
            counter++;
        }
    }

    print() {
        this.layers.forEach(layer => console.log(layer));
    }
}

const net = new NeuralNet([...Array(10).keys()].map(x => getRandomInt(1, 10)), [16, 16], 10);
net.print()
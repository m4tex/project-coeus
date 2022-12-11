"use strict";

class Layer {
    width;
    inputs; outputs;
    biases; weights;

    constructor(inputCount, width) {
        this.width = width;

        this.inputs = Array(inputCount)
        this.outputs = Array(width);
        this.biases = Array(width);
        this.weights = Array(width);
    }

    static #randomize(layer) {
        for (let i = 0; i < layer.biases.length; i++) {
            layer.biases[i] = Math.random() * 2 - 1;
        }

        for (let i = 0; i < layer.weights.length; i++) {
            layer.weights[i] = Array(layer.inputs.length);
            for (let j = 0; j < layer.inputs.length; j++) {
                layer.weights[i][j] = Math.random() * 2 - 1;
            }
        }
    }

    static feedThrough(layer, data) {
        layer.inputs = data;
        for (let i = 0; i < layer.outputs.length; i++) {
            let total = data.reduce((prev, current, index) => prev + current * layer.weights[i][index]);
            if (total > layer.biases[i]) layer.outputs[i] = 1;
            else layer.outputs[i] = 0;
        }
    }
}

class NeuralNetwork {
    layers;

    // Layer config is an array containing layer widths starting from the input layer to the output layer
    constructor(layerConfig) {
        this.layers = [];
        for (let i = 0; i < layerConfig.length; i++) {
            this.layers.push(new Layer(layerConfig[i], layerConfig[i+1]));
        }
    }

    static feedThrough(network, data) {
        if (network.layers[0].inputs.length !== data.length)
            throw new Error('The network\'s input node count doesn\'t match the data entry count');

        Layer.feedThrough(network.layers[0], data);
        for (let i = 1; i < network.layers.length; i++) {
            Layer.feedThrough(network.layers[i], network.layers[i-1].outputs);
        }

        return network.layers[network.layers.length-1].outputs;
    }
}
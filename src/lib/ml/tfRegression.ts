import * as tf from '@tensorflow/tfjs';

const TRAIN_X = [
  [.9,.95,.75,.03,.02,.4,.4,.3],   // NYC 2BR
  [.85,.9,.72,.025,.01,.4,.4,.25], // London 2BR
  [.7,.8,.85,.02,.015,.4,.4,.4],   // SF 2BR
  [.95,.9,.65,.01,.005,.4,.4,.2],  // Tokyo 2BR
  [.9,.85,.8,.015,.02,.4,.4,.1],   // Singapore 2BR
  [.8,.85,.68,.02,.035,.4,.4,.05], // Dubai 2BR
  [.5,.7,.22,.06,.014,.4,.4,.15],  // Mumbai 2BR
  [.4,.65,.22,.06,.016,.4,.4,.2],  // Delhi 2BR
  [.65,.7,.16,.065,.022,.4,.4,.3], // Bangalore 2BR
  [.7,.8,.55,.025,.015,.4,.4,.2],  // Sydney 2BR
  [.75,.8,.58,.02,.012,.4,.4,.15], // Toronto 2BR
  [.85,.9,.7,.04,.005,.4,.4,.1],   // Paris 2BR
  [.8,.85,.68,.025,.008,.4,.4,.05], // Berlin 2BR
  [.9,.92,.7,.02,.006,.4,.4,.1],   // HK 2BR
  [.6,.75,.18,.07,.025,.4,.4,.2],  // Bangkok 2BR
  [.55,.7,.14,.045,.018,.4,.4,.25], // Jakarta 2BR
  [.75,.8,.45,.055,.022,.4,.4,.3], // São Paulo 2BR
  [.65,.75,.38,.045,.018,.4,.4,.25], // Mexico City
  [.7,.8,.42,.038,.015,.4,.4,.15], // Istanbul 2BR
  [.8,.82,.52,.06,.01,.4,.4,.1],   // Warsaw 2BR
];

const TRAIN_Y = [[.60],[.425],[.70],[.55],[.65],[.25],[.11],[.09],[.06],[.325],[.35],[.30],[.275],[.375],[.075],[.05],[.09],[.11],[.14],[.16]];

export class PriceRegressionModel {
  model: tf.Sequential | null = null;

  async init() {
    this.model = tf.sequential({
      layers: [
        tf.layers.dense({ units: 16, activation: 'relu', inputShape: [8] }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 8, activation: 'relu' }),
        tf.layers.dense({ units: 1 }),
      ]
    });

    this.model.compile({ 
      optimizer: tf.train.adam(0.01), 
      loss: 'meanSquaredError' 
    });

    const xs = tf.tensor2d(TRAIN_X);
    const ys = tf.tensor2d(TRAIN_Y);

    await this.model.fit(xs, ys, { 
      epochs: 150, 
      batchSize: 4, 
      shuffle: true, 
      verbose: 0 
    });

    xs.dispose();
    ys.dispose();
  }

  async predict(inputs: number[]): Promise<number> {
    if (!this.model) await this.init();
    const inputTensor = tf.tensor2d([inputs], [1, 8]);
    const prediction = this.model!.predict(inputTensor) as tf.Tensor;
    const value = (await prediction.data())[0];
    inputTensor.dispose();
    prediction.dispose();
    // Denormalize (based on 2M reference)
    return Math.max(0.1, value) * 2000000;
  }
}

export const modelInstance = new PriceRegressionModel();

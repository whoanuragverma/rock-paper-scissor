"""
    author: Anurag Verma
    license: MIT
    This file trains the model on processed Dataset and exports a tensorflow-js model to model/
"""
import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow import keras
import tensorflowjs as tfjs

df = pd.read_csv('python/processedDS.csv', sep='|')
# Shuffling the Dataset
df = df.reindex(np.random.permutation(df.index))

# Dataset Size 684 - Train - 650 - Test - 34
X = np.array([eval(i) for i in df['Coords'].values])
# One-hot encoding the Gesture Values
Y = tf.keras.utils.to_categorical(df['Gesture'], num_classes=3)
Xtrain = X[:650]
Ytrain = Y[:650]
Xtest = X[650:]
Ytest = Y[650:]

model = tf.keras.models.Sequential([keras.layers.Dense(128, input_shape=(21, 2,), activation='relu'),
                                    keras.layers.Flatten(),
                                    keras.layers.Dense(256, activation='relu'),
                                    keras.layers.Dropout(0.3),
                                    keras.layers.Dense(256, activation='relu'),
                                    keras.layers.Dropout(0.3),
                                    keras.layers.Dense(128, activation='relu'),
                                    keras.layers.Dropout(0.3),
                                    keras.layers.Dense(64, activation='relu'),
                                    keras.layers.Dropout(0.3),
                                    keras.layers.Dense(3, activation='softmax')])

model.compile(loss='categorical_crossentropy',
              optimizer='adam', metrics=['acc'])
model.summary()

model.fit(Xtrain, Ytrain, epochs=25, batch_size=10,
          validation_data=(Xtest, Ytest))

# Converting to tfjs model
tfjs.converters.save_keras_model(model, 'model/')

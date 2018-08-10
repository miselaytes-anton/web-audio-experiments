'use strict'

const STATE = {};
const SUBSCRIPTIONS = []

const setState = (values) => {
  const newState = Object.assign(STATE, STATE, values)
  SUBSCRIPTIONS.forEach(subscription => subscription(newState));
}
const subscribe = subscription => SUBSCRIPTIONS.push(subscription);

module.exports = {setState, subscribe};

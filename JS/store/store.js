import PubSub from './lib/pubsub.js';

export default class Store {
    constructor(params) {
        let self = this;

        self.actions = {};
        self.mutations = {};
        self.state = {};
        self.status = 'default state';
        self.events = new PubSub();

        if (params.hasOwnProperty('actions')) {
            self.actions = params.actions;
        }

        if (params.hasOwnProperty('mutations')) {
            self.mutations = params.mutations;
        }

        self.state = new Proxy((params.state || {}), {
            set: function (state, key, value) {

                state[key] = value;

                console.log(`stateChange: ${key}: ${value}`);

                if(typeof value === 'object'){
                    console.log(`changedObject: `, value);
                }

                self.events.publish('stateChange', self.state);

                if (self.status !== 'mutation') {
                    console.warn(`You should use a mutation to set ${key}`);
                }

                self.status = 'resting';

                return true;
            },
            get: function(target, property) {
                console.log(`stateRetrieved for property: ${property}`);

                self.status = 'resting';

                return target[property];
            }
        });
    }

    dispatch(actionKey, payload = {}, storeKey = undefined) {
        let self = this;
        let module = undefined;

        if (actionKey.includes("/")) {
            let actionSplit = actionKey.split("/");
            actionKey = actionSplit[1];
            module = actionSplit[0]
        }

        if (typeof self.actions[module][actionKey] !== 'function') {
            console.error(`Action "${actionKey}" doesn't exist.`);
            return false;
        }

        console.groupCollapsed(`ACTION: ${actionKey}`);

        self.status = 'action';

        self.actions[module][actionKey](self, payload, storeKey);

        console.groupEnd();

        return true;
    }

    commit(mutationKey, payload = {}, storeKey = undefined) {
        let self = this;
        let module = undefined;

        if (mutationKey.includes("/")) {
            let mutationSplit = mutationKey.split("/");
            mutationKey = mutationSplit[1];
            module = mutationSplit[0]
        }

        if (typeof self.mutations[module][mutationKey] !== 'function') {
            console.log(`Mutation "${mutationKey}" doesn't exist`);
            return false;
        }

        self.status = 'mutation';

        let newState = self.mutations[module][mutationKey](self.state, payload, storeKey);

        self.state = Object.assign(self.state, newState);

        return true;
    }
}

import React, { useState, useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Toppings from './components/Toppings';
import Home from './components/Home';
import Base from './components/Base';
import Order from './components/Order';
import { AnimatePresence, useCycle } from 'framer-motion';
import Modal from './components/Modal';
import Loader from './components/Loader';

const App = () => {
    const location = useLocation();
    const pizzaProps = { base: '', toppings: [] };
    const storage = window.localStorage;

    const animations = ['animeOne', 'animeTwo'];
    const [cycle, switchCycle] = useCycle(...animations);

    const initialState = JSON.parse(storage.getItem('storedPizzaProps')) || pizzaProps;

    const [pizza, setPizza] = useState(initialState);

    useEffect(() => {
        storage.setItem('storedPizzaProps', JSON.stringify(pizza));
    }, [storage, pizza]);

    const addBase = base => setPizza({ ...pizza, base: pizza.base === base ? '' : base });

    const addToppings = topping => {
        let newToppings = [];
        if (!pizza.toppings.includes(topping)) {
            newToppings = [...pizza.toppings, topping];
        } else {
            newToppings = pizza.toppings.filter(item => item !== topping);
        }
        setPizza({ ...pizza, toppings: newToppings });
    };
    const resetState = () => setPizza(pizzaProps);

    return (
        <>
            <Header pizza={pizza}/>
            <AnimatePresence exitBeforeEnter>
                <Switch location={location} key={location.key}>
                    <Route path='/payment'>
                        <Modal pizza={pizza}/>
                    </Route>
                    <Route path='/base'>
                        <Base addBase={addBase} pizza={pizza}/>
                    </Route>
                    <Route path='/toppings'>
                        <Toppings addToppings={addToppings} pizza={pizza}/>
                    </Route>
                    <Route path='/order'>
                        <Order pizza={pizza} resetState={resetState}/>
                    </Route>
                    <Route path='/loader'>
                        <Loader cycle={cycle} switchCycle={switchCycle}/>
                    </Route>
                    <Route path='/'>
                        <Home pizza={pizza} resetState={resetState}/>
                    </Route>
                </Switch>
            </AnimatePresence>
        </>
    );
};

export default App;

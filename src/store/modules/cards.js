import { db } from '../../main.js'
import { collection, getDocs, setDoc, doc } from "firebase/firestore"; 
// import { push } from 'core-js/core/array';

export default {
    state: {
        cards: [],
        payments: [],
    },
    getters: {
        allPayments(state){
            return state.payments
        },
        allCards(state){
            return state.cards
        },
    },
    actions: {
        async fetchCards(context){
            let cards = []
            await getDocs(collection(db, "cards"))
            .then( docs => docs.forEach((doc) => {
                cards.push(doc.data());}));
            context.commit('updateCards', cards)
        },
        async fetchPayments(context){
            let payments = []
            await getDocs(collection(db, "payments"))
            .then( docs => docs.forEach((doc) => {
                payments.push(doc.data());}));
            context.commit('updatePayments', payments)
        },
        async addPaymentFromDialog({commit, dispatch}, payment){
            let ID =  await dispatch('idGenerator');
            console.log(ID)
            await setDoc(doc(db, "payments", ID), {
                        sum: payment.sum,
                        name: payment.name,
                        department: payment.department,
                        cardNumber: payment.cardNumber,
                        })
            dispatch('fetchPayments')
            commit('updatePayments')
        },
        async addCard({commit, dispatch}, newCard){
            console.log('Hi from addCard')
            let ID = await dispatch('idGenerator')
            await setDoc(doc(db, "cards", ID), {
                currency: newCard.currency,
                holder: newCard.holder,
                logo: newCard.logo,
                name: newCard.name,
                number: newCard.number,
                password: newCard.password,
                total: newCard.total,
                type: newCard.type
                })
            dispatch('fetchCards')
            commit('updateCards')
        }
    },
    mutations: {
        updateCards(state, cards){
            state.cards = cards
        },
        updatePayments(state, payments){
            state.payments = payments
        }
    }
}
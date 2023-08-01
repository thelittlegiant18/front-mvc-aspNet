import { defineStore } from 'pinia'
import axios from "axios";
import Swal from "sweetalert2";

export const useArticle = defineStore({
    id: 'cart',
    state: () => ({
        items: [],
        totalPrices: 0,
        success_msg: null,
        error_msg: null,
        error: null,
        loading: false,
    }),
    getters: {
        totalPrice: state => {
            return state.items.reduce((total, item) => {
                return total + item.price * item.quantity
            }, 0)
        },
        getItems() {
            return this.items.map(obj => {
                const interpretedObj = {
                    isActive: obj.isActive === true,
                };

                return Object.entries(obj).reduce((acc, [ key, value ]) => {
                    if (key !== 'isActive') {
                        acc[key] = value;
                    }
                    return acc;
                }, interpretedObj);
            });
        },
        getResponse() {
            return {
                success_msg: this.success_msg,
                error: this.error,
                error_msg: this.error_msg,
            }
        }
    },
    actions: {

        async fetchArticle() {

            await new Promise(resolve => setTimeout(resolve, 500))
            this.loading = true

            try {
                const response = await axios.get(
                    "api/Article"
                )
                if (response.data.success === true) {
                    if (response.data.data.length < 1) {
                        this.items = []; // Asignar un array vacío si data es nulo
                        this.error_msg = "No se encontraron Banners, por favor ingrese el primer banner"
                        setTimeout(() => {
                            this.error_msg = null;
                        }, 2000);
                    } else {
                        this.items = response.data.data;
                        this.success_msg = response.data.message
                        setTimeout(() => {
                            this.success_msg = null;
                        }, 2000);
                    }
                } else {
                    this.error = response.data.error
                    this.error_msg = response.data.message
                    await Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        confirmButtonColor: '#d34b4b',
                        text: this.error_msg,
                    })
                    setTimeout(() => {
                        this.error_msg = null;
                    }, 1000);
                }
            } catch (error) {
                this.error_msg = error.response.data.message;
                this.error = error.response.data
                await Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    confirmButtonColor: '#d34b4b',
                    text: this.error_msg,
                })
                setTimeout(() => {
                    this.error_msg = null;
                }, 1000);
            } finally {
                this.loading = false
            }

        },
        async saveArticle(item) {
            // console.log(item)
            await new Promise(resolve => setTimeout(resolve, 500));

            const existingItem = this.items.find(i => i.code === item.code)

            if (existingItem) {
                console.log("Articulo existente")
            } else {
                this.items.push({ ...item })
            }

            this.loading = true

            try {
                const response = await axios.post(
                    `api/Article`, item);
                if (response.data.success === true) {
                    this.success_msg = response.data.message
                    this.error_msg = null
                    this.error = null
                    setTimeout(() => {
                        this.success_msg = null;
                    }, 3000);
                } else {
                    this.success_msg = null
                    this.error = response.data
                    this.error_msg = response.data.message
                }
            } catch (error) {
                this.success_msg = null
                this.error = error
                this.error_msg = error.response.data.message
            } finally {
                this.loading = false
            }
        },
        async removeArticle(itemId) {
            await new Promise(resolve => setTimeout(resolve, 500));
            this.loading = true
            try {
                const response = await axios.delete(
                    `api/Article/${ itemId }`);
                // console.log(response)
                if (response.data.success === true) {
                    console.log(response.data.message)
                    this.success_msg = response.data.message
                    this.error_msg = null
                    this.error = null
                    setTimeout(() => {
                        this.success_msg = null;
                    }, 3000);
                } else {
                    this.success_msg = null
                    this.error = response.data
                    this.error_msg = response.data.message
                }
            } catch (error) {
                this.success_msg = null
                this.error = error
                this.error_msg = error.response.data.message
            } finally {
                this.loading = false
            }
        },
        async editArticle(article) {
            // console.log(article)
            await new Promise(resolve => setTimeout(resolve, 500));
            this.loading = true
            try {
                const response = await axios.put(
                    `api/Article/${ article.id }`, article);
                if (response.data.success === true) {
                    // console.log()
                    this.success_msg = response.data.message
                    this.error_msg = null
                    this.error = null
                    setTimeout(() => {
                        this.success_msg = null;
                    }, 3000);
                } else {
                    this.success_msg = null
                    this.error = response.data
                    this.error_msg = response.data.message
                }
            } catch (error) {
                this.success_msg = null
                this.error = error
                this.error_msg = error.response.data.message
            } finally {
                this.loading = false
            }
        },
        updateItemQuantity(item, newQuantity) {
            const itemIndex = this.items.findIndex(
                cartItem => cartItem.id === item.id
            )

            if (itemIndex >= 0) {
                const updatedItem = { ...item, quantity: newQuantity }
                this.items.splice(itemIndex, 1, updatedItem)
            }
        },
    },
    persist: true,
})


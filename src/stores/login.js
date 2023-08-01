import {defineStore} from "pinia";

import axios from "axios";
import router from '../router'
import Swal from "sweetalert2";

export const useLogin = defineStore({
    id: "login",
    state: () => ({
        isLoggedIn: false,
        user: [],
        token: null,
        loading: false,
        success_msg: null,
        error_msg: null,
        error: false
    }),
    getters: {
        getUser(){
            return {
                user: this.user
            }
        }
    },
    actions: {
        logged() {
            if (this.isLoggedIn === true) {
                router.push('/articles')
            } else {
                router.push('/')
            }
        },
        async login(email, password) {
            this.loading = true;
            this.error = false;
            let authentication = {
                email: email,
                password: password,
            };
            try {
                const response = await axios.post(
                    "api/Login",
                    authentication
                )
                if (response.data.success === true) {
                    // console.log(response);
                    this.isLoggedIn = true;
                    this.error = false;
                    this.error_msg = null;
                    this.user = response.data.user
                    this.success_msg = response.data.message
                    //localStorage.setItem("token", response.data.token);
                    //this.token = response.data.token;
                    //localStorage.setItem("xtoken", response.data.token);
                    await Swal.fire({
                        icon: 'success',
                        title: 'Excelente',
                        confirmButtonColor: '#153c30',
                        text: this.success_msg,
                    })
                    setTimeout(() => {
                        router.push('/articles')
                        this.success_msg = null;
                    }, 1000)
                } else {
                    // console.log(response.data);
                    this.error = true;
                    this.error_msg = response.data.message;
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
                // console.log("Error => ", error.response.data);
            } finally {
                this.loading = false;
            }
        },
        logout() {
            this.isLoggedIn = false;
            this.user = null;
            this.error = null;
            this.success_msg = null;
            this.error_msg = null;
            this.loading = false;
            localStorage.clear();
            router.push('/')
        },
    },
    persist: true,
});
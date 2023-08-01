import { defineStore } from "pinia";
import Swal from 'sweetalert2';
import axios from "axios";
import router from '../router'

export const useRegister = defineStore({
  id: "register",
  state: () => ({
    loading: false,
    success_msg: null,
    error_msg: null,
    error: false
  }),
  actions: {
    async registerUser(name, lastName, email, password) {

      this.loading = true;
      this.error = false;

      let register = {
        Name: name,
        LastName: lastName,
        Email: email,
        Password: password,
      };

      console.log(register)

      try {
        const response = await axios.post(
          "api/Register", register
        );
        if (response.data.success === true) {
          this.success_msg = response.data.message;
          await Swal.fire({
            icon: 'success',
            title: 'Excelente',
            confirmButtonColor: '#153c30',
            text: this.success_msg,
          })
          // console.log(response);
        } else if (response.data.success === false) {
          this.error = true;
          this.error_msg = response.data.message;
          await Swal.fire({
            icon: 'error',
            title: 'Oops...',
            confirmButtonColor: '#d34b4b',
            text: this.error_msg,
          })
          // console.log(response.data.message);
        }
        // console.log(register)
      } catch (error) {
        this.error = error.response.data
        this.error_msg = error.response.data.message
        console.table("Error => ", error.response.data);

        await Swal.fire({
          icon: 'error',
          title: 'Oops...',
          confirmButtonColor: '#d34b4b',
          text: this.error_msg,
        })
      } finally {
        this.loading = false;
      }

    },
  },
  persist: true,
})
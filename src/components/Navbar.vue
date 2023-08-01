<template>
  <nav class="card relative z-2">
    <div class="p-menubar p-component bg-blue-50 flex align-items-center">
      <ul class="p-menubar-root-list flex align-items-center flex-wrap list-none p-0">
        <li class="p-menuitem">
          <div class="p-menuitem-content p-2">
            <a class="p-menuitem-link cursor-pointer" @click="logout">
              <span class="p-menuitem-icon pi pi-fw pi-power-off"></span>
              <span class="p-menuitem-text">Quit</span>
            </a>
          </div>
        </li>
      </ul>
    </div>
  </nav>
</template>
<script setup>
import { useLogin } from '@/stores/login';
const useLoginFetch = useLogin();
const logout = () => {
  useLoginFetch.logout();
};
</script>
<style>

</style>
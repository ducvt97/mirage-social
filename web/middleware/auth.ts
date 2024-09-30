export default defineNuxtRouteMiddleware((to, from) => {
    const isLoggedIn = false;
    if (isLoggedIn === false) {
        return navigateTo("/login");
    }
});

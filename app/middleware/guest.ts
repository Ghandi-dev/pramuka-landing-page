export default defineNuxtRouteMiddleware((to, from) => {
  const { token } = useAdminAuth();

  if (token.value) {
    return navigateTo("/admin?already_logged_in=true");
  }
});

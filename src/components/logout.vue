<template>
    <div></div>
</template>
<script>
export default {
    name : 'Logout',
    created : function(){
        this.$store.dispatch('clearUserInfo').then( () => {
            localStorage.clear();
            this.$store.commit('emptyCart')
            this.$router.push(`/`)
        })
    }
}
</script>

<style>

</style>